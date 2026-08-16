import type { ImageLoader } from 'next/image'

/**
 * Lets `next/image` build a responsive `srcset` while images keep coming
 * straight from Sanity's CDN instead of the Next optimizer.
 *
 * Next calls this once per candidate width, so the `w`/`h` already on the
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
