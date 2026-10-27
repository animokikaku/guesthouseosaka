/** For generated files (robots.txt, the sitemap): shared for a day, never by browsers. */
export const STATIC_FILE_CACHE_CONTROL = 'public, max-age=0, s-maxage=86400'

/** Tags every published response built from Sanity content, which `/api/revalidate` purges. */
export const SANITY_CACHE_TAG = 'sanity'

/** Japan has no daylight saving time: midnight in Osaka is always 15:00 UTC. */
const TOKYO_OFFSET_MS = 9 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

/** Seconds until the next midnight in Osaka, from 1 just before it to 86400 right after. */
export function secondsUntilTokyoMidnight(now = Date.now()) {
  return Math.ceil((DAY_MS - ((now + TOKYO_OFFSET_MS) % DAY_MS)) / 1000)
}

/**
 * Lets Workers Cache serve published responses until the next midnight in
 * Osaka, at most a day; after that the next request renders them again. Pages
 * show what depends on the date, like which rooms are available today, as of
 * the day they rendered, so a copy must not outlive it. Publishing in Sanity
 * purges them right away, through `/api/revalidate`, and every deploy starts an
 * empty cache. Draft responses are never shared.
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
export function cacheHeaders(isDraftMode: boolean, now = Date.now()): Record<string, string> {
  if (isDraftMode) return { 'Cache-Control': 'private, no-store', Vary: 'Cookie' }

  return {
    'Cache-Control': `public, max-age=0, s-maxage=${secondsUntilTokyoMidnight(now)}`,
    // Cloudflare strips it before the response reaches the browser.
    'Cache-Tag': SANITY_CACHE_TAG,
    Vary: 'Cookie'
  }
}
