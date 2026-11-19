import { Image, type ImageProps } from '@/components/image'
import { sanityImageLoader, sanitySourceWidth } from '@/lib/sanity-image-loader'

/**
 * `Image` for Sanity CDN sources: each `srcset` candidate is resized by
 * Sanity through {@link sanityImageLoader}, up to the width the source has
 * (see {@link sanitySourceWidth}).
 */
export function SanityImage(props: Omit<ImageProps, 'loader' | 'maxWidth'>) {
  return <Image loader={sanityImageLoader} maxWidth={sanitySourceWidth(props.src)} {...props} />
}
