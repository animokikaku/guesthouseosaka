import { groupByCategory } from '@/lib/utils/group-by-category'
import type { HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - flat gallery array with category info
export type Gallery = NonNullable<HouseQueryResult>['gallery']
export type GalleryItem = NonNullable<Gallery>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Minimal type for components that only need _key and image (e.g., MobileHeroImage carousel)
export type GalleryImage = Pick<GalleryItem, '_key' | 'image'>

// Grouped category type for frontend display (extends base grouping with computed fields)
export interface GalleryCategory {
  _id: string
  key: string
  label: string | null
  order: number | null
  count: number
  thumbnail: GalleryItem['image'] | null
  items: GalleryItem[]
}

// Transform featured image to match GalleryImage shape (for MobileHeroImage)
export function featuredToGalleryImage(
  image: NonNullable<FeaturedImage>
): GalleryImage {
  return {
    _key: 'featured',
    image
  }
}

// Get index of image by key
export function getImageIndex(
  images: GalleryItem[],
  photoKey: string
): number {
  const index = images.findIndex((img) => img._key === photoKey)
  return index >= 0 ? index : 0
}

// Group gallery items by category (for frontend display)
// Uses generic utility and adds computed fields (count, thumbnail)
export function groupGalleryByCategory(
  gallery: Gallery | null
): GalleryCategory[] {
  const grouped = groupByCategory(gallery)
  return grouped.map((category) => ({
    ...category,
    _id: category._id ?? '',
    count: category.items.length,
    thumbnail: category.items[0]?.image ?? null
  }))
}
