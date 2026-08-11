/* eslint-disable @next/next/no-img-element */
import type { ImageLoader } from 'next/image'
import type { ComponentProps } from 'react'

type NextImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  alt: string
  src: string | { src: string }
  blurDataURL?: string
  fill?: boolean
  placeholder?: string
  preload?: boolean
  priority?: boolean
  unoptimized?: boolean
  loader?: ImageLoader
}

export default function NextImage({
  alt,
  src,
  blurDataURL: _blurDataURL,
  fill: _fill,
  placeholder: _placeholder,
  preload: _preload,
  priority: _priority,
  unoptimized: _unoptimized,
  loader,
  ...props
}: NextImageProps) {
  const rawSrc = typeof src === 'string' ? src : src.src
  const width = Number(props.width)
  // Mirror `next/image`: a custom loader owns the final URL. Without a width
  // there is no candidate to resolve, so fall back to the source as-is.
  const resolvedSrc = loader && width > 0 ? loader({ src: rawSrc, width }) : rawSrc

  return <img {...props} src={resolvedSrc} alt={alt} />
}
