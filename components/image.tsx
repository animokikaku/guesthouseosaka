import { transformBaseImageProps } from '@unpic/core/base'
import { blurhashToGradientCssObject } from '@unpic/placeholder'
import type { ComponentProps, CSSProperties } from 'react'
import { preload as preloadResource } from 'react-dom'

/** Builds the URL of one `srcset` candidate. */
export type ImageLoader = (options: { src: string; width: number; quality?: number }) => string

// Widths offered to a `sizes`-driven image, from the small fixed sizes (the
// smallest images are 40–56px icons) up to a full-width desktop slide.
const BREAKPOINTS = [64, 128, 192, 256, 384, 480, 640, 750, 828, 1080, 1200, 1600]

export type ImageProps = Omit<ComponentProps<'img'>, 'src' | 'width' | 'height' | 'loading'> & {
  src: string
  alt: string
  width?: number
  height?: number
  /** Stretches the image over its positioned parent, sized by `sizes`. */
  fill?: boolean
  loader?: ImageLoader
  quality?: number
  /** Painted as a CSS gradient behind the image until it covers it. */
  blurHash?: string | null
  /** Loads the image eagerly and preloads it from the document head. */
  preload?: boolean
  loading?: 'eager' | 'lazy'
}

/** The blurhash as CSS gradients; nothing for one that doesn't decode. */
function blurHashStyle(blurHash: string | null | undefined): CSSProperties | undefined {
  if (!blurHash) return undefined
  try {
    return { ...blurhashToGradientCssObject(blurHash), backgroundRepeat: 'no-repeat' }
  } catch {
    return undefined
  }
}

type Transformer = (url: string | URL, operations: { width?: number }) => string

/**
 * The `src`, `srcset` and `sizes` unpic builds: a fixed `width` without
 * `sizes` gets its 1x and 2x, `sizes` or `fill` gets every breakpoint for the
 * browser to pick from.
 */
function responsiveAttributes({
  src,
  transformer,
  width,
  height,
  sizes,
  fill
}: {
  src: string
  transformer: Transformer
  width?: number
  height?: number
  sizes?: string
  fill?: boolean
}) {
  const shared = { src, transformer, unstyled: true }
  const attributes =
    width && height && !sizes && !fill
      ? transformBaseImageProps({ ...shared, layout: 'fixed', width, height })
      : transformBaseImageProps({
          ...shared,
          layout: 'fullWidth',
          breakpoints: BREAKPOINTS,
          sizes: sizes ?? '100vw'
        })
  return {
    src: String(attributes.src),
    srcSet: attributes.srcset ? String(attributes.srcset) : undefined,
    sizes: attributes.sizes ? String(attributes.sizes) : undefined
  }
}

/**
 * `<img>` with what this site needs on top: a `srcset` built by unpic through a
 * `loader` (images then come straight from their CDN, resized there), `fill`,
 * a blurhash placeholder, and lazy loading by default. Without a loader, or for
 * an inline source, the source is used as-is.
 */
export function Image({
  src,
  alt,
  width,
  height,
  fill,
  loader,
  quality,
  sizes,
  blurHash,
  preload,
  loading,
  fetchPriority,
  style,
  ...props
}: ImageProps) {
  // Inline sources have nothing to resize.
  const transformer: Transformer | undefined =
    loader && !/^(?:data|blob):/.test(src)
      ? (url, { width: candidate }) =>
          loader({
            src: url.toString(),
            width: candidate ?? BREAKPOINTS[BREAKPOINTS.length - 1],
            quality
          })
      : undefined
  const responsive =
    transformer && responsiveAttributes({ src, transformer, width, height, sizes, fill })
  const resolvedSrc = responsive?.src ?? src
  const resolvedSizes = responsive?.sizes ?? sizes

  if (preload) {
    preloadResource(resolvedSrc, {
      as: 'image',
      imageSrcSet: responsive?.srcSet,
      imageSizes: resolvedSizes,
      fetchPriority: 'high'
    })
  }

  return (
    <img
      {...props}
      alt={alt}
      src={resolvedSrc}
      srcSet={responsive?.srcSet}
      sizes={resolvedSizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={preload ? 'eager' : (loading ?? 'lazy')}
      fetchPriority={preload ? 'high' : fetchPriority}
      decoding="async"
      style={{
        color: 'transparent',
        ...(fill && FILL_STYLE),
        ...blurHashStyle(blurHash),
        ...style
      }}
    />
  )
}

const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%'
}
