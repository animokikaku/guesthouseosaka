import type { HouseQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions } from '@sanity/asset-utils'
import { stegaClean } from '@sanity/client/stega'
import type { ImageProps } from 'next/image'

// Types from Sanity query result - gallery is now pre-grouped by category
export type GalleryCategories = NonNullable<HouseQueryResult>['galleryCategories']
export type GalleryCategoryData = NonNullable<GalleryCategories>[number]
export type GalleryItem = NonNullable<GalleryCategoryData['items']>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Minimal type for hero carousel slides (Sanity-backed _key + image)
export type GallerySlide = Pick<GalleryItem, '_key' | 'image'>
export type SanityGalleryImage = NonNullable<GalleryItem['image']> | NonNullable<FeaturedImage>
export type GalleryImageProps = Omit<ImageProps, 'fill' | 'className'>

type SizedGalleryImageOptions = {
  size?: 'thumbnail'
  width?: number
  height?: number
  dpr?: number
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  alt?: string | null
  includeDimensions?: boolean
}

type FullGalleryImageOptions = {
  size: 'full'
  alt?: string | null
}

export type ToGalleryImagePropsOptions = SizedGalleryImageOptions | FullGalleryImageOptions

// Category with computed fields for frontend display (flattened structure)
export interface GalleryCategory {
  _key: string
  _id: string
  label: string | null
  thumbnail: GalleryItem['image'] | null
  items: GalleryItem[]
}

export function cleanGalleryAlt(alt?: string | null): string {
  return stegaClean(alt) ?? ''
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

function toSizedGalleryImageProps(
  image: SanityGalleryImage,
  {
    width,
    height,
    dpr = 2,
    fit = 'crop',
    alt = image.alt,
    includeDimensions = true
  }: SizedGalleryImageOptions = {}
): GalleryImageProps {
  let builder = urlFor(image)

  if (width) builder = builder.width(width)
  if (height) builder = builder.height(height)
  if (dpr) builder = builder.dpr(dpr)
  if (fit) builder = builder.fit(fit)

  return {
    src: builder.url(),
    alt: cleanGalleryAlt(alt),
    width: includeDimensions ? width : undefined,
    height: includeDimensions ? height : undefined,
    blurDataURL: image.preview ?? undefined,
    placeholder: image.preview ? 'blur' : undefined
  }
}

function toFullGalleryImageProps(
  image: SanityGalleryImage,
  { alt = image.alt }: FullGalleryImageOptions
): GalleryImageProps | null {
  if (!image.asset) return null

  const dimensions = getImageDimensions(image.asset)

  return {
    src: urlFor(image).url(),
    alt: cleanGalleryAlt(alt),
    width: dimensions.width,
    height: dimensions.height,
    blurDataURL: image.preview ?? undefined,
    placeholder: image.preview ? 'blur' : undefined
  }
}

export function toGalleryImageProps(
  image: SanityGalleryImage,
  options: FullGalleryImageOptions
): GalleryImageProps | null
export function toGalleryImageProps(
  image: SanityGalleryImage,
  options?: SizedGalleryImageOptions
): GalleryImageProps
export function toGalleryImageProps(
  image: SanityGalleryImage,
  options: ToGalleryImagePropsOptions = {}
): GalleryImageProps | null {
  if (options.size === 'full') {
    return toFullGalleryImageProps(image, options)
  }

  return toSizedGalleryImageProps(image, options)
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
