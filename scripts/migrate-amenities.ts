/**
 * Migration script: Restructure amenities to nested categories
 *
 * Current structure:
 * - house.amenities[] = flat array of { amenity (ref), note, featured, customLabel }
 * - amenity documents with category references
 *
 * New structure:
 * - house.amenityCategories[] = [
 *     { category (ref), items: [{ amenity (ref), note, featured, customLabel }] }
 *   ]
 *
 * Run with: bun --env-file=.env.local run scripts/migrate-amenities.ts
 */

import { createClient } from '@sanity/client'

// Default values from .env.example
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '515wijoz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-16'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET')
  process.exit(1)
}

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN - required for mutations')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false
})

// Types for the migration
interface InternationalizedString {
  _key: string
  value: string
}

interface AmenityCategory {
  _id: string
  key: { current: string }
  icon: string | null
  label: InternationalizedString[]
  orderRank: string | null
}

interface Amenity {
  _id: string
  key: { current: string }
  label: InternationalizedString[]
  icon: string
  category: { _ref: string }
}

interface HouseAmenity {
  _key: string
  amenity: { _ref: string }
  note: 'private' | 'shared' | 'coin' | null
  featured: boolean | null
  customLabel: InternationalizedString[] | null
}

interface House {
  _id: string
  slug: string
  amenities: HouseAmenity[] | null
}

interface NewAmenityCategory {
  _key: string
  _type: 'houseAmenityCategory'
  category: { _type: 'reference'; _ref: string }
  items: NewHouseAmenity[]
}

interface NewHouseAmenity {
  _key: string
  _type: 'houseAmenity'
  amenity: { _type: 'reference'; _ref: string }
  note?: 'private' | 'shared' | 'coin'
  featured?: boolean
  customLabel?: InternationalizedString[]
}

async function fetchData() {
  console.log('Fetching amenity categories...')
  const categories: AmenityCategory[] = await client.fetch(`
    *[_type == "amenityCategory"] | order(orderRank) {
      _id,
      key,
      icon,
      label,
      orderRank
    }
  `)
  console.log(`  Found ${categories.length} categories`)

  console.log('Fetching amenities...')
  const amenities: Amenity[] = await client.fetch(`
    *[_type == "amenity"] {
      _id,
      key,
      label,
      icon,
      category
    }
  `)
  console.log(`  Found ${amenities.length} amenities`)

  console.log('Fetching houses with amenities...')
  const houses: House[] = await client.fetch(`
    *[_type == "house"] {
      _id,
      slug,
      amenities[] {
        _key,
        amenity,
        note,
        featured,
        customLabel
      }
    }
  `)
  console.log(`  Found ${houses.length} houses`)

  return { categories, amenities, houses }
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 11)
}

function transformHouseAmenities(
  house: House,
  amenities: Amenity[],
  categories: AmenityCategory[]
): NewAmenityCategory[] {
  if (!house.amenities || house.amenities.length === 0) {
    return []
  }

  // Create a map of amenity ID to category ID
  const amenityToCategoryMap = new Map<string, string>()
  for (const amenity of amenities) {
    amenityToCategoryMap.set(amenity._id, amenity.category._ref)
  }

  // Group house amenities by category
  const categoryGroups = new Map<string, HouseAmenity[]>()

  for (const houseAmenity of house.amenities) {
    const amenityId = houseAmenity.amenity._ref
    const categoryId = amenityToCategoryMap.get(amenityId)

    if (!categoryId) {
      console.warn(
        `  Warning: Amenity ${amenityId} not found in amenities list (house: ${house.slug})`
      )
      continue
    }

    if (!categoryGroups.has(categoryId)) {
      categoryGroups.set(categoryId, [])
    }
    categoryGroups.get(categoryId)!.push(houseAmenity)
  }

  // Sort categories by orderRank
  const sortedCategoryIds = Array.from(categoryGroups.keys()).sort((a, b) => {
    const catA = categories.find((c) => c._id === a)
    const catB = categories.find((c) => c._id === b)
    const rankA = catA?.orderRank || ''
    const rankB = catB?.orderRank || ''
    return rankA.localeCompare(rankB)
  })

  // Transform to new structure
  const result: NewAmenityCategory[] = []

  for (const categoryId of sortedCategoryIds) {
    const items = categoryGroups.get(categoryId)!

    const newCategory: NewAmenityCategory = {
      _key: generateKey(),
      _type: 'houseAmenityCategory',
      category: { _type: 'reference', _ref: categoryId },
      items: items.map((item) => {
        const newItem: NewHouseAmenity = {
          _key: item._key, // Preserve original key
          _type: 'houseAmenity',
          amenity: { _type: 'reference', _ref: item.amenity._ref }
        }

        if (item.note) {
          newItem.note = item.note
        }
        if (item.featured) {
          newItem.featured = item.featured
        }
        if (item.customLabel && item.customLabel.length > 0) {
          newItem.customLabel = item.customLabel
        }

        return newItem
      })
    }

    result.push(newCategory)
  }

  return result
}

async function main() {
  console.log('=== Amenities Migration Script ===\n')

  const { categories, amenities, houses } = await fetchData()

  console.log('\n--- Transformation Preview ---\n')

  const mutations: Array<{
    patch: {
      id: string
      set: { amenityCategories: NewAmenityCategory[] }
    }
  }> = []

  for (const house of houses) {
    const newStructure = transformHouseAmenities(house, amenities, categories)

    console.log(`House: ${house.slug} (${house._id})`)
    console.log(`  Current amenities: ${house.amenities?.length ?? 0}`)
    console.log(`  New categories: ${newStructure.length}`)

    for (const cat of newStructure) {
      const category = categories.find((c) => c._id === cat.category._ref)
      const label = category?.label?.[0]?.value || category?.key?.current || 'Unknown'
      console.log(`    - ${label}: ${cat.items.length} items`)
    }

    mutations.push({
      patch: {
        id: house._id,
        set: { amenityCategories: newStructure }
        // Note: We don't unset 'amenities' here - do that manually after verifying migration
      }
    })

    console.log('')
  }

  // Output mutations as JSON for review
  console.log('\n--- Generated Mutations (JSON) ---\n')
  console.log(JSON.stringify(mutations, null, 2))

  // Ask for confirmation
  console.log('\n--- Ready to Apply Mutations ---')
  console.log(`Total mutations: ${mutations.length}`)
  console.log('\nTo apply these mutations, run with --apply flag:')
  console.log('  bun --env-file=.env.local run scripts/migrate-amenities.ts --apply\n')

  if (process.argv.includes('--apply')) {
    console.log('Applying mutations...\n')

    for (const mutation of mutations) {
      try {
        await client.patch(mutation.patch.id).set(mutation.patch.set).commit()
        console.log(`  ✓ Updated ${mutation.patch.id}`)
      } catch (error) {
        console.error(`  ✗ Failed to update ${mutation.patch.id}:`, error)
      }
    }

    console.log('\nMigration complete!')
    console.log('\nNext steps:')
    console.log('1. Deploy schema: bunx sanity schema deploy')
    console.log('2. Regenerate types: bun run typegen')
    console.log('3. Update queries and components')
    console.log('4. After verification, manually unset old "amenities" field from each house')
  }
}

main().catch(console.error)
