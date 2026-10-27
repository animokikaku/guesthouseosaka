import { waitUntil } from 'cloudflare:workers'

/** Served as is for this long, then served stale while it refreshes in the background. */
const FRESH_SECONDS = 60
/** How long a stale entry may still be served while it refreshes. */
const STALE_SECONDS = 86_400
const STORED_AT = 'x-stored-at'
const CACHE_NAME = 'edge-cache'

/**
 * Keys this isolate is refreshing, so stale hits arriving together start one
 * refresh between them rather than one each. Other isolates keep their own.
 */
const refreshing = new Set<string>()

async function cacheRequest(key: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  const hash = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0'))
  // The Cache API keys entries by URL; this host is never fetched.
  return new Request(`https://edge-cache.internal/${hash.join('')}`)
}

async function store(request: Request, value: unknown) {
  const cache = await caches.open(CACHE_NAME)
  await cache.put(
    request,
    new Response(JSON.stringify(value), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${FRESH_SECONDS + STALE_SECONDS}`,
        [STORED_AT]: String(Date.now())
      }
    })
  )
}

/**
 * Caches a JSON result in this data center's Cache API with
 * stale-while-revalidate, which the Cache API lacks: a stale hit is returned at
 * once and refreshed in the background, kept alive by `waitUntil`. Stands in
 * for Next's `'use cache'`, so a page renders without waiting on its source.
 */
export async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const request = await cacheRequest(key)
  const hit = await (await caches.open(CACHE_NAME)).match(request)

  if (hit) {
    const age = (Date.now() - Number(hit.headers.get(STORED_AT))) / 1000
    if (age > FRESH_SECONDS && !refreshing.has(request.url)) {
      refreshing.add(request.url)
      waitUntil(
        // Started inside the chain, so even a `load` that throws synchronously
        // ends in the `finally` instead of failing this stale hit.
        Promise.resolve()
          .then(load)
          .then((value) => store(request, value))
          .finally(() => refreshing.delete(request.url))
      )
    }
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- written by `store` for this key
    return (await hit.json()) as T
  }

  const value = await load()
  waitUntil(store(request, value))
  return value
}
