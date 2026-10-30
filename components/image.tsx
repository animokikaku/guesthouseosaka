import { useState, type ComponentProps, type CSSProperties } from 'react'
import { preload as preloadResource } from 'react-dom'

/** Builds the URL of one `srcset` candidate. */
export type ImageLoader = (options: { src: string; width: number; quality?: number }) => string

// Layout widths for `sizes`-driven images, plus small fixed sizes. The smallest
// images are 40–56px icons; 192 fills the 128→256 gap small gallery-wall tiles
// fell into at 1x.
const DEVICE_SIZES = [480, 640, 750, 828, 1080, 1200, 1600]
const ALL_SIZES = [64, 128, 192, 256, 384, ...DEVICE_SIZES]

export type ImageProps = Omit<ComponentProps<'img'>, 'src' | 'width' | 'height' | 'loading'> & {
  src: string
  alt: string
  width?: number
  height?: number
  /** Stretches the image over its positioned parent, sized by `sizes`. */
  fill?: boolean
  loader?: ImageLoader
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  /** Loads the image eagerly and preloads it from the document head. */
  preload?: boolean
  loading?: 'eager' | 'lazy'
}

/**
 * Responsive candidates: every configured width when `sizes` describes a
 * layout, else the 1x and 2x of a fixed width.
 */
function candidateWidths(width: number | undefined, sizes: string | undefined) {
  if (sizes) {
    // A `vw` size only ever needs candidates from that share of the smallest device up.
    const percentages = [...sizes.matchAll(/(^|\s)(1?\d?\d)vw/g)].map((m) => Number(m[2]))
    if (percentages.length === 0) return { widths: ALL_SIZES, descriptor: 'w' as const }
    const smallest = DEVICE_SIZES[0] * (Math.min(...percentages) * 0.01)
    return { widths: ALL_SIZES.filter((w) => w >= smallest), descriptor: 'w' as const }
  }
  if (!width) return { widths: DEVICE_SIZES, descriptor: 'w' as const }
  const widths = [width, width * 2].map(
    (target) => ALL_SIZES.find((size) => size >= target) ?? ALL_SIZES.at(-1) ?? target
  )
  return { widths: [...new Set(widths)], descriptor: 'x' as const }
}

/**
 * The LQIP, blurred: an SVG Gaussian blur whose alpha is then made opaque, so
 * the edges don't fade to transparent. With intrinsic dimensions the SVG
 * stretches to them; for `fill`, it follows `object-fit`.
 */
function blurPlaceholder(
  blurDataURL: string,
  width: number | undefined,
  height: number | undefined,
  objectFit: CSSProperties['objectFit']
) {
  const viewBox = width && height ? `viewBox='0 0 ${width} ${height}'` : ''
  const preserveAspectRatio = viewBox
    ? 'none'
    : objectFit === 'contain'
      ? 'xMidYMid'
      : objectFit === 'cover'
        ? 'xMidYMid slice'
        : 'none'
  const svg = `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(%23b);' href='${blurDataURL}'/%3E%3C/svg%3E`
  return `url("data:image/svg+xml;charset=utf-8,${svg}")`
}

/** `object-fit` as a background size; `fill` and unset values cover. */
function backgroundSize(objectFit: CSSProperties['objectFit']) {
  if (objectFit === 'fill') return '100% 100%'
  return objectFit && !['-moz-initial', 'none', 'scale-down'].includes(objectFit)
    ? objectFit
    : 'cover'
}

/**
 * `<img>` with what this site needs on top: a `srcset` built by a `loader`
 * (images then come straight from their CDN, resized there), `fill`, a blurred
 * placeholder until load, and lazy loading by default. Without a loader, or for
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
  placeholder,
  blurDataURL,
  preload,
  loading,
  fetchPriority,
  style,
  onLoad,
  ref,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  let srcSet: string | undefined
  let resolvedSrc = src
  // Inline sources have nothing to resize.
  if (loader && !/^(?:data|blob):/.test(src)) {
    const { widths, descriptor } = candidateWidths(width, sizes)
    srcSet = widths
      .map(
        (w, i) =>
          `${loader({ src, width: w, quality })} ${descriptor === 'w' ? `${w}w` : `${i + 1}x`}`
      )
      .join(', ')
    resolvedSrc = loader({ src, width: widths.at(-1) ?? width ?? DEVICE_SIZES[0], quality })
  }
  const resolvedSizes = sizes ?? (fill && loader ? '100vw' : undefined)

  if (preload) {
    preloadResource(resolvedSrc, {
      as: 'image',
      imageSrcSet: srcSet,
      imageSizes: resolvedSizes,
      fetchPriority: 'high'
    })
  }

  const showBlur = placeholder === 'blur' && blurDataURL && !loaded
  // Keeps the placeholder until the image can paint.
  const removeBlurOnceDecoded = (img: HTMLImageElement) => {
    img.decode().then(
      () => setLoaded(true),
      () => setLoaded(true)
    )
  }

  return (
    <img
      {...props}
      alt={alt}
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={resolvedSizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={preload ? 'eager' : (loading ?? 'lazy')}
      fetchPriority={preload ? 'high' : fetchPriority}
      decoding="async"
      // An image cached before hydration never fires `load`, so check on mount.
      ref={(img) => {
        if (img?.complete && img.naturalWidth > 0) removeBlurOnceDecoded(img)
        if (typeof ref === 'function') return ref(img)
        if (ref) ref.current = img
      }}
      onLoad={(event) => {
        removeBlurOnceDecoded(event.currentTarget)
        onLoad?.(event)
      }}
      style={{
        color: 'transparent',
        ...(fill && FILL_STYLE),
        ...(showBlur && {
          backgroundImage: blurPlaceholder(
            blurDataURL,
            fill ? undefined : width,
            fill ? undefined : height,
            style?.objectFit
          ),
          backgroundSize: backgroundSize(style?.objectFit),
          backgroundPosition: style?.objectPosition ?? '50% 50%',
          backgroundRepeat: 'no-repeat'
        }),
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
