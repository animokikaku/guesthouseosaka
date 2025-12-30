/**
 * Migration script to set orderRank values for categories based on existing order field
 * Run with: bun --env-file=.env.local run scripts/migrate-orderrank.ts
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
})

interface CategoryDoc {
  _id: string
  _type: string
  order: number | null
  orderRank: string | null
}

// Convert numeric order to LexoRank format
// LexoRank format: bucket|rank: where bucket is 0, 1, or 2
// Using middle bucket (1) and generating ranks that maintain sort order
function orderToLexoRank(order: number | null): string {
  if (order === null || order === undefined) {
    return '1|zzzzzz:' // Sort nulls to end
  }
  // Generate a base-36 string that maintains sort order
  // Starting with 'a' and incrementing based on order
  // Each order value gets a unique rank in the middle of the lexicographic space
  const baseChar = 'a'.charCodeAt(0)
  const rankChar = String.fromCharCode(baseChar + Math.min(order - 1, 25))
  return `0|${rankChar}00000:`
}

async function migrate() {
  console.log('Fetching categories to fix orderRank format...')

  const categories = await client.fetch<CategoryDoc[]>(`
    *[_type in ["galleryCategory", "amenityCategory"]] {
      _id,
      _type,
      order,
      orderRank
    }
  `)

  if (categories.length === 0) {
    console.log('No categories found!')
    return
  }

  console.log(`Found ${categories.length} categories to update`)

  // Build transaction
  const transaction = client.transaction()

  for (const cat of categories) {
    const orderRank = orderToLexoRank(cat.order)
    console.log(`  ${cat._type}/${cat._id}: order=${cat.order} -> orderRank="${orderRank}"`)
    transaction.patch(cat._id, (patch) => patch.set({ orderRank }))
  }

  console.log('\nCommitting transaction...')
  const result = await transaction.commit()
  console.log(`Successfully updated ${result.results.length} categories`)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
