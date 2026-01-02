import type { HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - gallery is now pre-grouped by category
export type GalleryCategories =
  NonNullable<HouseQueryResult>['galleryCategories']
export type GalleryCategoryData = NonNullable<GalleryCategories>[number]
export type GalleryItem = NonNullable<GalleryCategoryData['items']>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Minimal type for components that only need _key and image (e.g., MobileHeroImage carousel)
export type GalleryImage = Pick<GalleryItem, '_key' | 'image'>

// Category with computed fields for frontend display (flattened structure)
export interface GalleryCategory {
  _key: string
  _id: string
  slug: string
  label: string | null
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

// Flatten all gallery items from categories (for modal navigation)
export function flattenGalleryItems(
  categories: GalleryCategories | null
): GalleryItem[] {
  if (!categories) return []
  return categories.flatMap((cat) => cat.items ?? [])
}

// Get index of image by key across all categories
export function getImageIndex(
  categories: GalleryCategories | null,
  photoKey: string
): number {
  const items = flattenGalleryItems(categories)
  const index = items.findIndex((img) => img._key === photoKey)
  return index >= 0 ? index : 0
}

// Transform pre-grouped data to frontend display format with computed fields
// Note: Data is pre-sorted and filtered (empty categories excluded) in GROQ query
export function toGalleryCategories(
  data: GalleryCategories | null
): GalleryCategory[] {
  if (!data) return []
  return data.map((cat) => ({
    _key: cat._key,
    _id: cat.category._id,
    slug: cat.category.slug,
    label: cat.category.label,
    count: cat.items?.length ?? 0,
    thumbnail: cat.items?.[0]?.image ?? null,
    items: cat.items ?? []
  }))
}
