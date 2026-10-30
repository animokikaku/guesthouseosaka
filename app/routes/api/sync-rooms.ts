/**
 * Keeps the `rooms` table in step with the houses' shares.house listings, on
 * `POST` with `Authorization: Bearer <SYNC_TOKEN>`, then purges the cached
 * responses that show availability. An EventBridge rule in AWS Tokyo calls it
 * on a schedule. See docs/rooms.md.
 */
import { env as serverEnv } from '@/env'
import { ROOMS_CACHE_TAG } from '@/lib/cache-control'
import { hasBearerToken } from '@/lib/rooms-sync/auth'
import { syncListing } from '@/lib/rooms-sync/sync.server'
import { PROPERTY_IDS } from '@/lib/rooms.server'
import { createFileRoute } from '@tanstack/react-router'
import { cache, env, waitUntil } from 'cloudflare:workers'

const NO_STORE = { 'Cache-Control': 'no-store' }

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

/** Syncs every house's listing in turn; one failing leaves the others, and its own stored rooms, untouched. */
async function syncAll(force: boolean): Promise<Result[]> {
  const results: Result[] = []
  for (const id of Object.values(PROPERTY_IDS)) {
    // The Japanese page: its dates are numeric, the English page's typed by hand.
    const url = `https://shares.house/a_detail/q_${id}/`
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

/** Purges the responses that show availability; a failure leaves them up to a day old, until the next run's purge. */
async function purge(): Promise<boolean> {
  // The dev server has no Workers Cache, so nothing to purge.
  if (typeof cache?.purge !== 'function') return true
  const { success, errors } = await cache
    .purge({ tags: [ROOMS_CACHE_TAG] })
    .catch((error: unknown) => ({ success: false, errors: [error] }))
  if (!success) log('error', 'site_purge_failed', { error: describe(errors) })
  return success
}

/**
 * Syncs every listing, then purges, whatever changed: that also retries a purge
 * an earlier run missed, and replaces pages rendered from counts that have
 * since aged out (see `getRoomCounts`). `ok` is false when either step failed.
 */
async function run(force: boolean) {
  const results = await syncAll(force)
  const purged = await purge()
  return { ok: results.every((result) => result.ok) && purged, results, purged }
}

export const Route = createFileRoute('/api/sync-rooms')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await hasBearerToken(request, serverEnv.SYNC_TOKEN))) {
          return new Response('Unauthorized', { status: 401, headers: NO_STORE })
        }

        // `?force=1` writes a listing that shrank by more than half (see `writeRooms`).
        const force = new URL(request.url).searchParams.get('force') === '1'
        // EventBridge gives up on a response after 5 s; the run finishes anyway.
        const running = run(force)
        waitUntil(running)
        const { ok, results, purged } = await running
        // EventBridge retries a 5xx.
        return Response.json({ results, purged }, { status: ok ? 200 : 502, headers: NO_STORE })
      }
    }
  }
})
