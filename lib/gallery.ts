import type { HouseGalleryQueryResult, HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - gallery is now pre-grouped by category
export type GalleryCategories = NonNullable<HouseGalleryQueryResult>['galleryCategories']
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

/** The featured image (when it has an asset) followed by the gallery images. */
export function buildGallerySlides({
  featuredImage,
  galleryImages
}: {
  featuredImage?: FeaturedImage
  galleryImages: GalleryItem[] | null
}): GallerySlide[] {
  return featuredImage?.asset
    ? [{ _key: 'featured', image: featuredImage }, ...(galleryImages ?? [])]
    : (galleryImages ?? [])
}

// Flatten all gallery items from categories (for modal navigation)
export function flattenGalleryItems(categories: GalleryCategories | null): GalleryItem[] {
  if (!categories) return []
  return categories.flatMap((cat) => cat.items ?? [])
}
