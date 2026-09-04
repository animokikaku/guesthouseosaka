/**
 * Stands in for `next/image` so component tests can assert on what the component
 * passed down. Optimization-only props become `data-*` attributes, since jsdom
 * has nothing to do with them but tests still need to see them.
 */
export default function NextImage({
  src,
  alt,
  blurDataURL,
  placeholder,
  sizes,
  fill: _fill,
  priority: _priority,
  ...props
}: {
  src: string
  alt: string
  blurDataURL?: string
  placeholder?: string
  sizes?: string
  fill?: boolean
  priority?: boolean
} & React.ComponentProps<'img'>) {
  return (
    // oxlint-disable-next-line nextjs/no-img-element
    <img
      {...props}
      src={src}
      alt={alt}
      data-testid="next-image"
      data-blur-url={blurDataURL}
      data-placeholder={placeholder}
      data-sizes={sizes}
    />
  )
}
