import type { HouseQueryResult } from '@/sanity.types'
import type { ImageProps } from 'next/image'

// Types from Sanity query result
export type GalleryByCategory = NonNullable<HouseQueryResult>['galleryByCategory']
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']
type CategoryGroup = GalleryByCategory[number]
type CategoryImage = NonNullable<CategoryGroup['images']>[number]

// Processed image with Next.js Image props
export type GalleryImage = Omit<ImageProps, 'fill'> & {
  id: string
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
  placeholder?: 'blur'
}

// Category with images for gallery grid
export type GalleryCategory = {
  key: string
  label: string | null
  count: number
  thumbnail: GalleryImage
  images: GalleryImage[]
}

// Transform a single image from Sanity to Next.js props
function toGalleryImage(image: CategoryImage): GalleryImage {
  return {
    id: image._key,
    src: image.image.asset?.url ?? '',
    alt: image.image.alt ?? '',
    width: image.image.asset?.dimensions?.width ?? 800,
    height: image.image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.image.asset?.lqip ?? undefined,
    placeholder: image.image.asset?.lqip ? 'blur' : undefined
  }
}

// Transform featured image to gallery image
export function featuredToGalleryImage(
  image: NonNullable<FeaturedImage>
): GalleryImage {
  return {
    id: 'featured',
    src: image.asset?.url ?? '',
    alt: image.alt ?? '',
    width: image.asset?.dimensions?.width ?? 800,
    height: image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.asset?.lqip ?? undefined,
    placeholder: image.asset?.lqip ? 'blur' : undefined
  }
}

// Process gallery by category into structured data for components
export function processGalleryByCategory(
  galleryByCategory: GalleryByCategory
): GalleryCategory[] {
  return galleryByCategory
    .map((group) => {
      const images = (group.images ?? []).map(toGalleryImage)
      if (images.length === 0) return null

      return {
        key: group.category.key,
        label: group.category.label,
        count: images.length,
        thumbnail: images[0],
        images
      }
    })
    .filter((category): category is GalleryCategory => category !== null)
}

// Flatten gallery categories into a single images array
export function flattenGalleryImages(
  galleryByCategory: GalleryByCategory
): GalleryImage[] {
  return galleryByCategory.flatMap((group) =>
    (group.images ?? []).map(toGalleryImage)
  )
}

// Get index of image by ID
export function getImageIndex(images: GalleryImage[], photoId: string): number {
  return images.findIndex((img) => img.id === photoId)
}
