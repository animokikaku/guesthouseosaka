/** For generated files (robots.txt, the sitemap): shared for a day, never by browsers. */
export const STATIC_FILE_CACHE_CONTROL = 'public, max-age=0, s-maxage=86400'

/** Tags every published response built from Sanity content, which `/api/revalidate` purges. */
export const SANITY_CACHE_TAG = 'sanity'

/**
 * Lets Workers Cache serve published responses for a day; after that the next
 * request renders them again. Publishing in Sanity purges them right away,
 * through `/api/revalidate`, and every deploy starts an empty cache, so the day
 * only bounds how long a missed purge lasts. Draft responses are never shared.
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
 */
export function cacheHeaders(isDraftMode: boolean): Record<string, string> {
  if (isDraftMode) return { 'Cache-Control': 'private, no-store', Vary: 'Cookie' }

  return {
    'Cache-Control': 'public, max-age=0, s-maxage=86400',
    // Cloudflare strips it before the response reaches the browser.
    'Cache-Tag': SANITY_CACHE_TAG,
    Vary: 'Cookie'
  }
}
