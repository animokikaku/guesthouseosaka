import type { LightboxItem } from '@/components/lightbox'
import type { FeaturedImage, GalleryItem } from '@/lib/gallery'
import { sanityImageLoader } from '@/lib/sanity-image-loader'
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
  /**
   * Serve from Sanity's CDN through {@link sanityImageLoader} rather than the
   * Next optimizer, letting the browser pick a width from `sizes` instead of
   * downloading one oversized file. `width`/`height` then only pin the crop
   * aspect ratio.
   */
  responsive?: boolean
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
    includeDimensions = true,
    responsive = false
  }: SizedGalleryImageOptions = {}
): GalleryImageProps | null {
  if (!image.asset) return null

  let builder = urlFor(image)

  if (width) builder = builder.width(width)
  if (height) builder = builder.height(height)
  // The loader derives each candidate width itself, so a baked-in dpr would
  // just double every request on top of it.
  if (dpr && !responsive) builder = builder.dpr(dpr)
  if (fit) builder = builder.fit(fit)

  return {
    src: builder.url(),
    alt: cleanGalleryAlt(alt),
    width: includeDimensions ? width : undefined,
    height: includeDimensions ? height : undefined,
    blurDataURL: image.preview ?? undefined,
    placeholder: image.preview ? 'blur' : undefined,
    ...(responsive ? { loader: sanityImageLoader } : {})
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

/**
 * Maps a gallery item to ramka's `LightboxItem` shape for `Lightbox.Gallery`.
 *
 * Trigger and destination must share the same photograph and aspect ratio —
 * square tiles are a CSS crop (`aspect-square` + `object-cover`), not a
 * Sanity `fit=crop` URL. The destination `src` is the full-aspect Sanity CDN
 * URL (same pipeline as the trigger via `sanityImageLoader`).
 *
 * No LQIP here on purpose: the lightbox image must not carry a `blur`
 * placeholder, because next/image paints it as an inline background that covers
 * ramka's trigger-thumbnail bridge. The blur belongs on the trigger — see
 * `toGalleryImageProps`, which the grid tiles use.
 */
export function toGalleryLightboxItem(item: GalleryItem): LightboxItem | null {
  const { image, _key } = item
  if (!image?.asset) return null

  const dimensions = getImageDimensions(image.asset)
  const alt = cleanGalleryAlt(image.alt)

  return {
    id: _key,
    src: urlFor(image).fit('max').url(),
    // 128px matches `THUMBNAIL_SIZE` in `components/lightbox.tsx`, the only
    // place this is rendered. Strip thumbs are not the morph source.
    thumb: urlFor(image).width(128).height(128).dpr(2).fit('crop').auto('format').quality(75).url(),
    alt,
    caption: alt,
    width: dimensions.width,
    height: dimensions.height
  }
}
