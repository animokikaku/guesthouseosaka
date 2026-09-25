'use client'

import { sanityImageLoader } from '@/lib/sanity-image-loader'
import Image from 'next/image'
import type { ComponentProps } from 'react'

/**
 * `next/image` for Sanity CDN sources: each `srcset` candidate is resized by
 * Sanity through {@link sanityImageLoader} instead of being fetched and
 * re-encoded by the Next optimizer. A client component because a loader is a
 * function, which server components can't pass across the boundary.
 */
export function SanityImage(props: Omit<ComponentProps<typeof Image>, 'loader'>) {
  return <Image loader={sanityImageLoader} {...props} />
}
