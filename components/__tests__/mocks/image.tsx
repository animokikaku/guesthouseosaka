/**
 * Stands in for `@/components/image` so component tests can assert on what the
 * component passed down. Optimization-only props become `data-*` attributes, since jsdom
 * has nothing to do with them but tests still need to see them.
 *
 * Props that only mean something to `Image` are dropped rather than
 * forwarded: React warns when a function or boolean reaches a DOM attribute.
 */
export function Image({
  src,
  alt,
  blurHash,
  sizes,
  fill: _fill,
  loader: _loader,
  preload: _preload,
  quality: _quality,
  unoptimized: _unoptimized,
  ...props
}: {
  src: string
  alt: string
  blurHash?: string | null
  sizes?: string
  fill?: boolean
  loader?: unknown
  preload?: boolean
  quality?: number
  unoptimized?: boolean
} & React.ComponentProps<'img'>) {
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      data-testid="image"
      data-blur-hash={blurHash ?? undefined}
      data-sizes={sizes}
    />
  )
}
