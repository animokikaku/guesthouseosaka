/**
 * Keeps the `rooms` table in step with the shares.house listings in
 * `LISTING_URLS`, on `POST /sync` with `Authorization: Bearer <SYNC_TOKEN>`,
 * then purges the site's cached pages that show availability. The
 * `guesthouseosaka-rooms-cron` Worker (cron/) calls it on a schedule. See
 * docs/rooms.md.
 */
import { hasBearerToken } from './auth'
import type { D1Database } from './d1'
import { syncListing } from './sync'

interface Env {
  ROOMS_DB: D1Database
  LISTING_URLS: string[]
  /** The site's Worker, through a service binding. */
  SITE?: { fetch(input: string, init?: RequestInit): Promise<Response> }
  /** Secret (`wrangler secret put SYNC_TOKEN`). Without it, `POST /sync` is refused. */
  SYNC_TOKEN?: string
  /** Secret shared with the site, which refuses a purge without it. */
  ROOMS_REVALIDATE_SECRET?: string
}

const PURGE_ATTEMPTS = 3

type Result =
  | { url: string; ok: true; propertyId: string; rooms: number; changed: number }
  | { url: string; ok: false; error: string }

// One JSON object per line, which Workers Logs indexes by field.
function log(level: 'info' | 'error', event: string, fields: Record<string, unknown>) {
  console[level](JSON.stringify({ event, ...fields }))
}

function describe(error: unknown): string {
  if (!(error instanceof Error)) return String(error)
  return error.cause === undefined ? error.message : `${error.message}: ${describe(error.cause)}`
}

/** Syncs every listing in turn; one failing leaves the others, and its own stored rooms, untouched. */
async function syncAll(env: Env, force: boolean): Promise<Result[]> {
  const results: Result[] = []
  for (const url of env.LISTING_URLS) {
    const startedAt = Date.now()
    try {
      const result = await syncListing(env.ROOMS_DB, url, { force })
      log('info', 'listing_synced', { url, ...result, durationMs: Date.now() - startedAt })
      results.push({ url, ok: true, ...result })
    } catch (error) {
      log('error', 'listing_sync_failed', {
        url,
        error: describe(error),
        durationMs: Date.now() - startedAt
      })
      results.push({ url, ok: false, error: describe(error) })
    }
  }
  return results
}

/**
 * Asks the site to purge its cached pages that show availability, through
 * `/api/revalidate-rooms`. A purge that never lands leaves them up to a day
 * old, until the next run's purge.
 */
async function purgeSite(env: Env): Promise<boolean> {
  const { SITE, ROOMS_REVALIDATE_SECRET } = env
  if (!SITE || !ROOMS_REVALIDATE_SECRET) {
    log('error', 'site_purge_failed', { error: 'SITE or ROOMS_REVALIDATE_SECRET is missing' })
    return false
  }

  for (let attempt = 1; attempt <= PURGE_ATTEMPTS; attempt++) {
    if (attempt > 1) await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 2)))
    try {
      // The service binding ignores the host; the path picks the route.
      const response = await SITE.fetch('https://guesthouseosaka.com/api/revalidate-rooms', {
        method: 'POST',
        headers: { Authorization: `Bearer ${ROOMS_REVALIDATE_SECRET}` },
        signal: AbortSignal.timeout(10_000)
      })
      if (response.ok) {
        log('info', 'site_purged', { attempt })
        return true
      }
      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      log('error', 'site_purge_failed', { attempt, error: describe(error) })
    }
  }
  return false
}

/**
 * Syncs every listing, then purges the site whatever changed: that also retries
 * a purge an earlier run missed, and replaces pages rendered from counts that
 * have since aged out (see `getRoomCounts`). It re-renders a few pages every
 * six hours. `ok` is false when either step failed.
 */
async function run(env: Env, { force = false } = {}) {
  const results = await syncAll(env, force)
  const purged = await purgeSite(env)
  return { ok: results.every((result) => result.ok) && purged, results, purged }
}

export default {
  async fetch(request: Request, env: Env) {
    if (new URL(request.url).pathname !== '/sync') return new Response('Not found', { status: 404 })
    if (request.method !== 'POST')
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } })
    if (!(await hasBearerToken(request, env.SYNC_TOKEN)))
      return new Response('Unauthorized', { status: 401 })

    // `?force=1` writes a listing that shrank by more than half (see `writeRooms`).
    const force = new URL(request.url).searchParams.get('force') === '1'
    const { ok, results, purged } = await run(env, { force })
    return Response.json({ results, purged }, { status: ok ? 200 : 502 })
  }
}
