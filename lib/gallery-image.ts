import type { LightboxItem } from '@/components/lightbox'
import type { FeaturedImage, GalleryItem } from '@/lib/gallery'
import { urlFor } from '@/sanity/lib/image'
import { getImageDimensions } from '@sanity/asset-utils'
import { stegaClean } from '@sanity/client/stega'
import type { ImageProps } from 'next/image'

/**
 * Lightbox strip tabs are `--lb-thumb-size` (3.5rem/56px) with `object-fit:
 * cover`; the Sanity loader adds the 2x candidate. Lives here rather than in
 * the client-only lightbox module so server code can read the value.
 */
export const LIGHTBOX_THUMBNAIL_SIZE = 56

export type SanityGalleryImage = NonNullable<GalleryItem['image']> | NonNullable<FeaturedImage>
export type GalleryImageProps = Omit<ImageProps, 'fill' | 'className' | 'loader'>

type ToGalleryImagePropsOptions = {
  width?: number
  height?: number
  fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  alt?: string | null
  includeDimensions?: boolean
}

export function cleanGalleryAlt(alt?: string | null): string {
  return stegaClean(alt) ?? ''
}

/**
 * Props for `SanityImage`, whose loader derives every `srcset` candidate from
 * the source URL: `width`/`height` only pin the crop aspect ratio, and no `dpr`
 * is baked in because the candidate widths already cover device pixel ratio.
 */
export function toGalleryImageProps(
  image: SanityGalleryImage,
  {
    width,
    height,
    fit = 'crop',
    alt = image.alt,
    includeDimensions = true
  }: ToGalleryImagePropsOptions = {}
): GalleryImageProps | null {
  if (!image.asset) return null

  let builder = urlFor(image)

  if (width) builder = builder.width(width)
  if (height) builder = builder.height(height)
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

/**
 * Maps a gallery item to ramka's `LightboxItem` shape for `Lightbox.Gallery`.
 *
 * Trigger and destination must share the same photograph and aspect ratio —
 * square tiles are a CSS crop (`aspect-square` + `object-cover`), not a
 * Sanity `fit=crop` URL. The destination `src` is the full-aspect Sanity CDN
 * URL (same `sanityImageLoader` pipeline as the trigger's `SanityImage`).
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
    // Strip thumbs are not the morph source, so a square crop is fine here.
    thumb: urlFor(image)
      .width(LIGHTBOX_THUMBNAIL_SIZE)
      .height(LIGHTBOX_THUMBNAIL_SIZE)
      .fit('crop')
      .url(),
    alt,
    caption: alt,
    width: dimensions.width,
    height: dimensions.height
  }
}
