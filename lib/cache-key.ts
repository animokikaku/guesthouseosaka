/**
 * Query parameters that ad, social and email platforms append to links. No
 * page reads them, so they are left out of the cache key: each visitor from a
 * campaign carries a different value, which would otherwise make every visit
 * a cache miss that renders the page again.
 */
const TRACKING_PARAMS = new Set([
  '_gl',
  'dclid',
  'fbclid',
  'gad_campaignid',
  'gad_source',
  'gbraid',
  'gclid',
  'igshid',
  'li_fat_id',
  'mc_cid',
  'mc_eid',
  'msclkid',
  'srsltid',
  'ttclid',
  'twclid',
  'wbraid',
  'yclid'
])

function isTrackingParam(name: string) {
  return name.startsWith('utm_') || TRACKING_PARAMS.has(name)
}

/** `url` without its tracking parameters, and the parameters it had, in order. */
export function withoutTrackingParams(url: URL) {
  const tracking = [...url.searchParams].filter(([name]) => isTrackingParam(name))
  if (tracking.length === 0) return { url, tracking }

  const stripped = new URL(url)
  stripped.search = new URLSearchParams(
    [...url.searchParams].filter(([name]) => !isTrackingParam(name))
  ).toString()
  return { url: stripped, tracking }
}

/**
 * A redirect's `Location` with the tracking parameters added back, so a
 * campaign keeps its attribution through the site's own redirects (legacy
 * URLs, trailing slashes, the locale prefix). Other locations are kept as is.
 */
export function withTrackingParams(location: string, tracking: [string, string][]) {
  if (tracking.length === 0 || !location.startsWith('/') || location.startsWith('//')) {
    return location
  }
  const url = new URL(location, 'http://localhost')
  for (const [name, value] of tracking) url.searchParams.append(name, value)
  return url.pathname + url.search + url.hash
}

/** Whether the `Cookie` header sets `name`, whatever its value. */
export function hasCookie(cookieHeader: string | null, name: string) {
  return (cookieHeader ?? '').split(';').some((pair) => pair.trim().startsWith(`${name}=`))
}
