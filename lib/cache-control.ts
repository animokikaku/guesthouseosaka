/** For generated files (robots.txt, the sitemap): shared for a day, never by browsers. */
export const STATIC_FILE_CACHE_CONTROL = 'public, max-age=0, s-maxage=86400'

/** Tags every published response built from Sanity content, so one purge can drop them all. */
export const SANITY_CACHE_TAG = 'sanity'

/** Tags the responses that show room availability, which a room sync purges (see docs/rooms.md). */
export const ROOMS_CACHE_TAG = 'rooms'

/**
 * Tags the responses that read documents of a Sanity type, which publishing
 * one of them purges (see `app/routes/api/revalidate.ts`).
 */
export function sanityTypeTag(type: string) {
  return `sanity-${type}`
}

/** The tags of a published response that reads `types`: {@link SANITY_CACHE_TAG}, a tag per type, and `extraTags`. */
export function cacheTags(types: readonly string[], extraTags: readonly string[] = []) {
  return [SANITY_CACHE_TAG, ...types.map(sanityTypeTag), ...extraTags]
}

/** `Cache-Tag` values merged into one, without repeats. */
export function mergeCacheTags(...values: (string | undefined)[]) {
  const tags = values.flatMap((value) => value?.split(',') ?? []).map((tag) => tag.trim())
  return [...new Set(tags.filter(Boolean))].join(',')
}

/**
 * Lets Workers Cache serve published responses for a day; after that the next
 * request renders them again. Publishing in Sanity purges the ones that read
 * the published document's type right away, through `/api/revalidate`, and
 * every deploy starts an empty cache, so the day only bounds how long a missed
 * purge lasts. Draft responses are never shared.
 *
 * No `stale-while-revalidate`. Workers Cache ignores it whenever `s-maxage` is
 * present, and `s-maxage` is what keeps this lifetime away from browsers, which
 * would honor it and show a copy a purge can't reach.
 * @see https://developers.cloudflare.com/workers/cache/debugging/
 *
 * Cookies aren't part of the cache key, so `Vary: Cookie` keeps a cached
 * published copy from reaching a draft-mode visitor. The cost: a request with
 * any cookie (a language choice, Cloudflare's `cf_clearance` after a bot
 * challenge) gets its own copy, which per-visitor cookies make a miss.
 *
 * Without `tags`, the response carries no `Cache-Tag`: a page's tags come from
 * the loaders that render it (see `setCacheHeaders`).
 */
export function cacheHeaders(
  isDraftMode: boolean,
  tags?: readonly string[]
): Record<string, string> {
  if (isDraftMode) return { 'Cache-Control': 'private, no-store', Vary: 'Cookie' }

  return {
    'Cache-Control': 'public, max-age=0, s-maxage=86400',
    // Cloudflare strips it before the response reaches the browser.
    ...(tags && { 'Cache-Tag': mergeCacheTags(...tags) }),
    Vary: 'Cookie'
  }
}
