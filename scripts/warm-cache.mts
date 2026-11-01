/**
 * Warms Workers Cache after a deploy: each Worker version starts with an empty
 * cache, so without this the first visitor to each page in each language
 * waits for a render. Requests every page in the sitemap, in every locale,
 * like a first-time visitor (no cookies, no query string). The cache is
 * tiered, so one request fills it for every Cloudflare data center.
 *
 * Usage: bun scripts/warm-cache.mts [origin], https://guesthouseosaka.com by default.
 */
const origin = process.argv[2] ?? 'https://guesthouseosaka.com'
const CONCURRENCY = 4

const sitemap = await fetch(new URL('/sitemap.xml', origin))
if (!sitemap.ok) throw new Error(`Failed to fetch the sitemap: ${sitemap.status}`)

// Each <url> lists its page in every locale as `hreflang` alternates.
const urls = [
  ...new Set([...(await sitemap.text()).matchAll(/href="([^"]+)"/g)].map(([, url]) => url))
]

let failed = 0
const queue = [...urls]
async function worker() {
  for (let url = queue.shift(); url; url = queue.shift()) {
    const started = performance.now()
    const response = await fetch(url, { redirect: 'manual' }).catch((error: unknown) => error)
    if (!(response instanceof Response)) {
      failed++
      console.error(`failed  ${url}`, response)
      continue
    }
    await response.arrayBuffer()
    if (!response.ok) failed++
    const status = response.headers.get('cf-cache-status') ?? '-'
    const ms = Math.round(performance.now() - started)
    console.log(`${response.status} ${status.padEnd(7)} ${String(ms).padStart(5)} ms  ${url}`)
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))

console.log(`Warmed ${urls.length - failed}/${urls.length} pages`)
// A page that fails to warm is only slower for its first visitor: don't fail the deploy.
