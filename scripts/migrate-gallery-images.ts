/**
 * Migration script to upload gallery images to Sanity
 *
 * Usage: SANITY_API_WRITE_TOKEN=xxx bun run scripts/migrate-gallery-images.ts
 *
 * This script:
 * 1. Reads image data from lib/images/data/*.json
 * 2. Reads alt texts from messages/{en,ja,fr}.json via IMAGE_LABEL_KEYS
 * 3. Fetches images from blob storage
 * 4. Uploads them to Sanity as assets
 * 5. Updates house documents with gallery arrays including category references
 * 6. Sets category cover images to the first image of each category
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import { IMAGE_LABEL_KEYS } from '../lib/images/labels'

// Configuration
const BLOB_STORAGE_URL = 'https://mnaukbn4lqwsvyid.public.blob.vercel-storage.com'
const PROJECT_ID = '515wijoz'
const DATASET = 'development'

// House document IDs (from previous seeding)
const HOUSE_IDS: Record<string, string> = {
  apple: '860e9fd9-273c-4c84-a618-33d5a4cb007f',
  lemon: '3e4bdf0a-77a1-4003-b459-7a10cfd7d5cf',
  orange: 'f5140e3b-1d0b-4ecc-be68-76f814f66e5e'
}

// Gallery category IDs (from Sanity query)
const CATEGORY_IDS: Record<string, string> = {
  room: '5eca5cd4-2001-4c6d-91e9-8df8c9597d6b',
  'common-spaces': '60ec565c-f2ff-4356-b862-4134fe526137',
  facilities: 'd84f0e57-a32c-4958-adfd-37f326e2ae13',
  'building-features': '24e1ff46-bb58-44c0-a565-061e5aef52e5',
  neighborhood: '32d33d0e-22d8-46eb-913f-d68748f243e7',
  'floor-plan': 'f85fcbaa-06e6-4efc-9acf-db2577aa9de7',
  maps: 'f15d7c52-3dac-4f0a-8a24-a60467fee608'
}

interface ImageData {
  id: number
  src: string
  width: number
  height: number
  blurDataURL: string
  category: string
}

interface MessagesFile {
  images: Record<string, Record<string, Record<string, string>>>
}

interface AltTexts {
  en: string
  ja: string
  fr: string
}

const LOCALES = ['en', 'ja', 'fr'] as const

// Create Sanity client with token for write access
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-12-16',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN
})

// Load all messages files for alt texts
const messagesFiles: Record<string, MessagesFile> = {}
for (const locale of LOCALES) {
  const messagesPath = join(process.cwd(), 'messages', `${locale}.json`)
  messagesFiles[locale] = JSON.parse(readFileSync(messagesPath, 'utf-8'))
}

function getAltTexts(imageId: number): AltTexts {
  const labelKey = IMAGE_LABEL_KEYS[imageId as keyof typeof IMAGE_LABEL_KEYS]

  // Default to empty strings - no fallback text
  const result: AltTexts = { en: '', ja: '', fr: '' }

  if (labelKey) {
    // Parse the key: 'apple.room.wood_flooring' -> ['apple', 'room', 'wood_flooring']
    const [house, cat, key] = labelKey.split('.')

    for (const locale of LOCALES) {
      const altText = messagesFiles[locale]?.images?.[house]?.[cat]?.[key]
      if (altText) {
        result[locale] = altText
      }
    }
  }

  return result
}

async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function uploadImage(
  imageData: ImageData
): Promise<{ assetId: string; url: string }> {
  const imageUrl = `${BLOB_STORAGE_URL}/${imageData.src}`
  console.log(`  Fetching: ${imageData.src}`)

  const buffer = await fetchImageAsBuffer(imageUrl)
  const filename = imageData.src.split('/').pop() || 'image.jpg'

  console.log(`  Uploading: ${filename}`)
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg'
  })

  return {
    assetId: asset._id,
    url: asset.url
  }
}

function generateKey(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Track first image per category for cover images
const categoryCoverImages: Record<string, string> = {}

async function migrateHouseGallery(houseName: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Processing ${houseName.toUpperCase()} house gallery`)
  console.log('='.repeat(60))

  const houseId = HOUSE_IDS[houseName]
  if (!houseId) {
    console.error(`Unknown house: ${houseName}`)
    return
  }

  // Read image data
  const dataPath = join(process.cwd(), 'lib', 'images', 'data', `${houseName}.json`)
  const imageDataList: ImageData[] = JSON.parse(readFileSync(dataPath, 'utf-8'))

  console.log(`Found ${imageDataList.length} images to migrate`)

  // Sort by ID to ensure consistent ordering
  imageDataList.sort((a, b) => a.id - b.id)

  const galleryItems: Array<{
    _key: string
    _type: 'galleryImage'
    image: {
      _type: 'localizedImage'
      asset: { _type: 'reference'; _ref: string }
      alt: Array<{ _key: string; _type: 'internationalizedArrayStringValue'; value: string }>
    }
    category: { _type: 'reference'; _ref: string }
  }> = []

  // Track which categories we've seen (for cover images)
  const seenCategories = new Set<string>()

  for (let i = 0; i < imageDataList.length; i++) {
    const imageData = imageDataList[i]
    console.log(`\n[${i + 1}/${imageDataList.length}] ID:${imageData.id} - ${imageData.category}/${imageData.src.split('/').pop()}`)

    try {
      // Get category ID
      const categoryId = CATEGORY_IDS[imageData.category]
      if (!categoryId) {
        console.warn(`  Warning: Unknown category "${imageData.category}", skipping`)
        continue
      }

      // Upload image to Sanity
      const { assetId } = await uploadImage(imageData)

      // Get alt texts for all locales (empty if no mapping exists)
      const altTexts = getAltTexts(imageData.id)
      console.log(`  Alt (en): "${altTexts.en || '(empty)'}")`)

      // Check if this is the first image of this category (for cover image)
      if (!seenCategories.has(imageData.category)) {
        seenCategories.add(imageData.category)
        // Only set if not already set by another house
        if (!categoryCoverImages[imageData.category]) {
          categoryCoverImages[imageData.category] = assetId
          console.log(`  -> Set as cover image for category "${imageData.category}"`)
        }
      }

      // Create gallery item with all localized alt texts
      galleryItems.push({
        _key: generateKey(),
        _type: 'galleryImage',
        image: {
          _type: 'localizedImage',
          asset: { _type: 'reference', _ref: assetId },
          alt: [
            { _key: 'en', _type: 'internationalizedArrayStringValue', value: altTexts.en },
            { _key: 'ja', _type: 'internationalizedArrayStringValue', value: altTexts.ja },
            { _key: 'fr', _type: 'internationalizedArrayStringValue', value: altTexts.fr }
          ]
        },
        category: { _type: 'reference', _ref: categoryId }
      })

      console.log(`  Success!`)
    } catch (error) {
      console.error(`  Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // Update house document with gallery
  if (galleryItems.length > 0) {
    console.log(`\nUpdating house document with ${galleryItems.length} gallery items...`)

    await client
      .patch(houseId)
      .set({ gallery: galleryItems })
      .commit()

    console.log(`Successfully updated ${houseName} house with ${galleryItems.length} gallery images`)
  }
}

async function updateCategoryCoverImages(): Promise<void> {
  console.log(`\n${'='.repeat(60)}`)
  console.log('Updating category cover images')
  console.log('='.repeat(60))

  for (const [categoryKey, assetId] of Object.entries(categoryCoverImages)) {
    const categoryId = CATEGORY_IDS[categoryKey]
    if (!categoryId) continue

    console.log(`Setting cover image for "${categoryKey}"...`)

    await client
      .patch(categoryId)
      .set({
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: assetId }
        }
      })
      .commit()

    console.log(`  Done!`)
  }
}

async function main(): Promise<void> {
  console.log('Gallery Image Migration Script')
  console.log('==============================')
  console.log(`Project: ${PROJECT_ID}`)
  console.log(`Dataset: ${DATASET}`)
  console.log(`Blob Storage: ${BLOB_STORAGE_URL}`)

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('\nError: SANITY_API_WRITE_TOKEN environment variable is required')
    console.log('You can create a token at: https://www.sanity.io/manage/project/515wijoz/api#tokens')
    process.exit(1)
  }

  const houses = ['apple', 'lemon', 'orange']

  for (const house of houses) {
    await migrateHouseGallery(house)
  }

  // Update category cover images after all houses are processed
  await updateCategoryCoverImages()

  console.log('\n' + '='.repeat(60))
  console.log('Migration complete!')
  console.log('='.repeat(60))
}

main().catch(console.error)
