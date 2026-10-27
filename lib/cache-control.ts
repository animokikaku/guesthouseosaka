/**
 * Lets Workers Cache serve published responses for five minutes, then refresh
 * them in the background while serving the cached copy, which stands in for
 * Next's prerendering plus tag revalidation. Draft responses are never shared.
 *
 * Cookies aren't part of the cache key, so `Vary: Cookie` keeps a cached
 * published copy from reaching a draft-mode visitor. The cost: a request with
 * any cookie (a language choice, Cloudflare's `cf_clearance` after a bot
 * challenge) gets its own copy, which per-visitor cookies make a miss.
 */
/** For generated files (robots.txt, the sitemap): shared for a day, never by browsers. */
export const STATIC_FILE_CACHE_CONTROL = 'public, max-age=0, s-maxage=86400'

export function cacheHeaders(isDraftMode: boolean) {
  return {
    'Cache-Control': isDraftMode
      ? 'private, no-store'
      : 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    Vary: 'Cookie'
  }
}
