/**
 * Lets the CDN serve published responses for five minutes, then refresh them in
 * the background while serving the cached copy, which stands in for Next's
 * prerendering plus tag revalidation. Draft responses are never shared, and
 * `Vary: Cookie` keeps a cached published copy from reaching a draft-mode
 * visitor, whose request carries the draft cookie.
 */
export function cacheHeaders(isDraftMode: boolean) {
  return {
    'Cache-Control': isDraftMode
      ? 'private, no-store'
      : 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    Vary: 'Cookie'
  }
}
