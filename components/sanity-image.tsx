import { Image, type ImageProps } from '@/components/image'
import { sanityImageLoader } from '@/lib/sanity-image-loader'

/**
 * `Image` for Sanity CDN sources: each `srcset` candidate is resized by
 * Sanity through {@link sanityImageLoader}.
 */
export function SanityImage(props: Omit<ImageProps, 'loader'>) {
  return <Image loader={sanityImageLoader} {...props} />
}
