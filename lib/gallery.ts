import type { HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - image objects with hotspot/crop for urlFor
export type GalleryCategories = NonNullable<HouseQueryResult>['galleryCategories']
export type GalleryCategory = GalleryCategories[number]
export type GalleryImages = NonNullable<HouseQueryResult>['galleryImages']
export type GalleryImage = NonNullable<GalleryImages>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']
export type CategoryImage = NonNullable<GalleryCategory['images']>[number]

// Transform featured image to match gallery image shape
export function featuredToGalleryImage(
  image: NonNullable<FeaturedImage>
): GalleryImage {
  return {
    _key: 'featured',
    image,
    categoryOrder: -1 // Featured always first
  }
}

// Get index of image by key
export function getImageIndex(
  images: GalleryImage[],
  photoKey: string
): number {
  const index = images.findIndex((img) => img._key === photoKey)
  return index >= 0 ? index : 0
}
