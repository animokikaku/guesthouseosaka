/**
 * Keeps the `rooms` table in step with the houses' shares.house listings, then
 * purges the cached responses that show availability when they're out of date.
 * An EventBridge rule in AWS Tokyo calls it every hour, with
 * `Authorization: Bearer <SYNC_TOKEN>`, and the Studio's Site Settings on demand,
 * with a preview secret its user just created. See docs/rooms.md.
 */
import { env as serverEnv } from '@/env'
import { ROOMS_CACHE_TAG } from '@/lib/cache-control'
import { SANITY_STUDIO_HOSTS } from '@/lib/config'
import { hasBearerToken } from '@/lib/rooms-sync/auth'
import { needsPurge, recordPurge, syncListing } from '@/lib/rooms-sync/sync.server'
import { PROPERTY_IDS } from '@/lib/rooms.server'
import { HouseIdentifierValues, type HouseIdentifier } from '@/lib/types'
import { client } from '@/sanity/lib/client'
import { urlSearchParamPreviewSecret, validatePreviewUrl } from '@sanity/preview-url-secret'
import { createFileRoute } from '@tanstack/react-router'
import { cache, env, waitUntil } from 'cloudflare:workers'

const NO_STORE = { 'Cache-Control': 'no-store' }

// The hosted Studios, and `sanity dev`'s, may read the response.
const STUDIO_ORIGINS = new Set([
  ...Object.values(SANITY_STUDIO_HOSTS).map((host) => `https://${host}.sanity.studio`),
  'http://localhost:3333'
])

type Result =
  | {
      house: HouseIdentifier
      url: string
      ok: true
      propertyId: string
      rooms: number
      changed: number
    }
  | { house: HouseIdentifier; url: string; ok: false; error: string }

// One JSON object per line, which Workers Logs indexes by field.
function log(level: 'info' | 'error', event: string, fields: Record<string, unknown>) {
  console[level](JSON.stringify({ event, ...fields }))
}

function describe(error: unknown): string {
  if (!(error instanceof Error)) return String(error)
  return error.cause === undefined ? error.message : `${error.message}: ${describe(error.cause)}`
}

/** Syncs every house's listing in turn; one failing leaves the others, and its own stored rooms, untouched. */
async function syncAll(force: boolean): Promise<Result[]> {
  const results: Result[] = []
  for (const house of HouseIdentifierValues) {
    const id = PROPERTY_IDS[house]
    // The Japanese page: its dates are numeric, the English page's typed by hand.
    const url = `https://shares.house/a_detail/q_${id}/`
    const startedAt = Date.now()
    try {
      const result = await syncListing(env.ROOMS_DB, url, { force })
      log('info', 'listing_synced', { url, ...result, durationMs: Date.now() - startedAt })
      results.push({ house, url, ok: true, ...result })
    } catch (error) {
      log('error', 'listing_sync_failed', {
        url,
        error: describe(error),
        durationMs: Date.now() - startedAt
      })
      results.push({ house, url, ok: false, error: describe(error) })
    }
  }
  return results
}

/**
 * Purges the responses that show availability when they're out of date (see
 * `needsPurge`): on most days once or twice, though the sync runs hourly. A
 * page rendered while D1 failed waits for the next purge or its cache expiry.
 */
async function purgeIfNeeded(): Promise<'purged' | 'skipped' | 'failed'> {
  const now = new Date().toISOString()
  // Purges when it can't tell.
  const needed = await needsPurge(env.ROOMS_DB, now).catch((error: unknown) => {
    log('error', 'purge_check_failed', { error: describe(error) })
    return true
  })
  if (!needed) return 'skipped'

  // The dev server has no Workers Cache, so nothing to purge.
  if (typeof cache?.purge === 'function') {
    const { success, errors } = await cache
      .purge({ tags: [ROOMS_CACHE_TAG] })
      .catch((error: unknown) => ({ success: false, errors: [error] }))
    if (!success) {
      log('error', 'site_purge_failed', { error: describe(errors) })
      return 'failed'
    }
  }
  // Unrecorded, the purge is only tried again.
  await recordPurge(env.ROOMS_DB, now).catch((error: unknown) =>
    log('error', 'purge_record_failed', { error: describe(error) })
  )
  log('info', 'site_purged', {})
  return 'purged'
}

/** Syncs every listing, then purges if needed. `ok` is false when either step failed. */
async function run(force: boolean) {
  const results = await syncAll(force)
  const purge = await purgeIfNeeded()
  return { ok: results.every((result) => result.ok) && purge !== 'failed', results, purge }
}

/**
 * The schedule's bearer token, or the Studio's preview secret as the body: one
 * a signed-in Studio user created in the dataset, which only the read token can
 * see, valid for an hour. In the body rather than the URL, it stays out of logs.
 */
async function isAuthorized(request: Request) {
  if (await hasBearerToken(request, serverEnv.SYNC_TOKEN)) return true
  const secret = (await request.text()).trim()
  if (!secret || secret.length > 256) return false
  const url = new URL(request.url)
  url.searchParams.set(urlSearchParamPreviewSecret, secret)
  const { isValid } = await validatePreviewUrl(
    client.withConfig({ token: serverEnv.SANITY_API_READ_TOKEN }),
    url.toString()
  )
  return isValid
}

export const Route = createFileRoute('/api/sync-rooms')({
  server: {
    handlers: {
      // A text body and no custom header make the Studio's request simple: no preflight.
      POST: async ({ request }) => {
        const origin = request.headers.get('Origin')
        const headers = {
          ...NO_STORE,
          Vary: 'Origin',
          ...(origin && STUDIO_ORIGINS.has(origin) && { 'Access-Control-Allow-Origin': origin })
        }
        if (!(await isAuthorized(request))) {
          return new Response('Unauthorized', { status: 401, headers })
        }

        // `?force=1` writes a listing that shrank by more than half (see `writeRooms`).
        const force = new URL(request.url).searchParams.get('force') === '1'
        // EventBridge gives up on a response after 5 s; the run finishes anyway.
        const running = run(force)
        waitUntil(running)
        const { ok, results, purge } = await running
        // EventBridge retries a 5xx.
        return Response.json({ results, purge }, { status: ok ? 200 : 502, headers })
      }
    }
  }
})
