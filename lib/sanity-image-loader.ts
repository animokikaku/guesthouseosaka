import type { ImageLoader } from '@/components/image'

/**
 * Lets `Image` (`components/image.tsx`) build a responsive `srcset` from
 * Sanity's CDN, which resizes each candidate.
 *
 * `Image` calls this once per candidate width, so the `w`/`h` already on the
 * source URL only serve to pin the crop aspect ratio — both are recomputed
 * here. `dpr` is dropped on purpose: the candidate widths already encode
 * device pixel ratio, and keeping it would double every request.
 *
 * Lightbox trigger and destination URLs must not pin a different aspect than
 * the asset. If both `w` and `h` are present, every srcset candidate keeps
 * that ratio (e.g. a square `w=400&h=400` source stays 1:1). Use CSS
 * `object-cover` for square tiles instead of baking a crop into the file.
 */
export const sanityImageLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src)
  const baseWidth = Number(url.searchParams.get('w'))
  const baseHeight = Number(url.searchParams.get('h'))

  url.searchParams.set('w', String(width))
  if (baseWidth > 0 && baseHeight > 0) {
    url.searchParams.set('h', String(Math.round((width * baseHeight) / baseWidth)))
  }
  url.searchParams.delete('dpr')
  url.searchParams.set('auto', 'format')
  url.searchParams.set('q', String(quality ?? 75))

  return url.toString()
}

/**
 * How wide Sanity can serve `src` without scaling it up, or `undefined` for a
 * URL that doesn't say. Asset file names end in their pixel size
 * (`…-663x1000.jpg`), `rect` narrows it to the hotspot or Studio crop, and a
 * `fit=crop` to another aspect ratio only uses the part of that area it fills.
 *
 * Wider candidates gain nothing: `fit=crop` scales the source up, for a
 * heavier file with no more detail, and `fit=max` answers with the same image
 * under one more URL.
 */
export function sanitySourceWidth(src: string): number | undefined {
  let url: URL
  try {
    url = new URL(src)
  } catch {
    return undefined
  }

  const [, , rectWidth, rectHeight] = url.searchParams.get('rect')?.split(',').map(Number) ?? []
  const [, fileWidth, fileHeight] = /-(\d+)x(\d+)\.\w+$/.exec(url.pathname)?.map(Number) ?? []
  const sourceWidth = rectWidth > 0 && rectHeight > 0 ? rectWidth : fileWidth
  const sourceHeight = rectWidth > 0 && rectHeight > 0 ? rectHeight : fileHeight
  if (!(sourceWidth > 0 && sourceHeight > 0)) return undefined

  const width = Number(url.searchParams.get('w'))
  const height = Number(url.searchParams.get('h'))
  if (url.searchParams.get('fit') !== 'crop' || !(width > 0 && height > 0)) return sourceWidth
  return Math.min(sourceWidth, Math.round((sourceHeight * width) / height))
}
