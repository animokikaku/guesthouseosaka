import type { HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - gallery is now pre-grouped by category
export type GalleryCategories = NonNullable<HouseQueryResult>['galleryCategories']
export type GalleryCategoryData = NonNullable<GalleryCategories>[number]
export type GalleryItem = NonNullable<GalleryCategoryData['items']>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Minimal type for hero carousel slides (Sanity-backed _key + image)
export type GallerySlide = Pick<GalleryItem, '_key' | 'image'>

// Category with computed fields for frontend display (flattened structure)
export interface GalleryCategory {
  _key: string
  _id: string
  label: string | null
  thumbnail: GalleryItem['image'] | null
  items: GalleryItem[]
}

// Transform featured image to match GallerySlide shape (for MobileHeroImage)
export function featuredToGallerySlide(image: NonNullable<FeaturedImage>): GallerySlide {
  return {
    _key: 'featured',
    image
  }
}

export function buildGallerySlides({
  featuredImage,
  galleryImages,
  limit
}: {
  featuredImage?: FeaturedImage
  galleryImages: GalleryItem[] | null
  limit?: number
}): GallerySlide[] {
  const slides: GallerySlide[] = featuredImage?.asset
    ? [featuredToGallerySlide(featuredImage), ...(galleryImages ?? [])]
    : (galleryImages ?? [])

  return typeof limit === 'number' ? slides.slice(0, limit) : slides
}

// Flatten all gallery items from categories (for modal navigation)
export function flattenGalleryItems(categories: GalleryCategories | null): GalleryItem[] {
  if (!categories) return []
  return categories.flatMap((cat) => cat.items ?? [])
}

// Get index of image by key across all categories
export function getImageIndex(categories: GalleryCategories | null, photoKey: string): number {
  const items = flattenGalleryItems(categories)
  const index = items.findIndex((img) => img._key === photoKey)
  return index >= 0 ? index : 0
}
