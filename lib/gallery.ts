import type { HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - now pre-processed by GROQ
export type GalleryCategories = NonNullable<HouseQueryResult>['galleryCategories']
export type GalleryCategory = GalleryCategories[number]
export type GalleryImages = NonNullable<HouseQueryResult>['galleryImages']
export type GalleryImage = NonNullable<GalleryImages>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Transform featured image to match gallery image shape
export function featuredToGalleryImage(
  image: NonNullable<FeaturedImage>
): GalleryImage {
  return {
    _key: 'featured',
    src: image.asset?.url ?? '',
    alt: image.alt ?? '',
    width: image.asset?.dimensions?.width ?? 800,
    height: image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.asset?.lqip ?? null,
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
