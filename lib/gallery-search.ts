/**
 * The gallery's search params: `photo` is the `_key` of the photo open in the
 * lightbox, so every photo has its own shareable URL.
 */
export type GallerySearch = { photo?: string }

export function validateGallerySearch(search: Record<string, unknown>): GallerySearch {
  const { photo } = search
  // A key that looks like a number (`123`, `1e5`) is parsed as one.
  if (typeof photo === 'string' && photo) return { photo }
  if (typeof photo === 'number') return { photo: String(photo) }
  return {}
}
