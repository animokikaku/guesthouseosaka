import type { FeaturedImage, GalleryItem } from '@/lib/gallery'
import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions } from '@sanity/asset-utils'
import { stegaClean } from '@sanity/client/stega'
import type { ImageProps } from 'next/image'

export type SanityGalleryImage = NonNullable<GalleryItem['image']> | NonNullable<FeaturedImage>
export type GalleryImageProps = Omit<ImageProps, 'fill' | 'className'>

type SizedGalleryImageOptions = {
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

export function cleanGalleryAlt(alt?: string | null): string {
  return stegaClean(alt) ?? ''
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
): GalleryImageProps | null {
  if (!image.asset) return null

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
): GalleryImageProps | null
export function toGalleryImageProps(
  image: SanityGalleryImage,
  options: ToGalleryImagePropsOptions = {}
): GalleryImageProps | null {
  if ('size' in options && options.size === 'full') {
    return toFullGalleryImageProps(image, options)
  }

  return toSizedGalleryImageProps(image, options)
}
