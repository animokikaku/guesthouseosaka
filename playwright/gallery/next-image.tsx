/* eslint-disable @next/next/no-img-element */
import type { ComponentProps } from 'react'

type NextImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  alt: string
  src: string | { src: string }
  blurDataURL?: string
  fill?: boolean
  placeholder?: string
  preload?: boolean
  priority?: boolean
}

export default function NextImage({
  alt,
  src,
  blurDataURL: _blurDataURL,
  fill: _fill,
  placeholder: _placeholder,
  preload: _preload,
  priority: _priority,
  ...props
}: NextImageProps) {
  return <img {...props} src={typeof src === 'string' ? src : src.src} alt={alt} />
}
