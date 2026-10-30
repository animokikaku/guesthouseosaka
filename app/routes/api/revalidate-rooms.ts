/**
 * Called by the `guesthouseosaka-rooms` Worker, through its service binding,
 * after a sync changed rooms: purges the responses that show availability (see
 * docs/rooms.md).
 */
import { ROOMS_CACHE_TAG } from '@/lib/cache-control'
import { env as serverEnv } from '@/env'
import { hasBearerToken } from '@/workers/rooms/src/auth'
import { createFileRoute } from '@tanstack/react-router'
import { cache } from 'cloudflare:workers'

const NO_STORE = { 'Cache-Control': 'no-store' }

export const Route = createFileRoute('/api/revalidate-rooms')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await hasBearerToken(request, serverEnv.ROOMS_REVALIDATE_SECRET))) {
          return new Response('Unauthorized', { status: 401, headers: NO_STORE })
        }

        // The dev server has no Workers Cache, so nothing to purge.
        if (typeof cache?.purge !== 'function') {
          return Response.json({ purged: false }, { headers: NO_STORE })
        }

        const { success, errors } = await cache
          .purge({ tags: [ROOMS_CACHE_TAG] })
          .catch((error: unknown) => ({ success: false, errors: [error] }))
        if (!success) {
          console.error('Failed to purge room responses', errors)
          // The rooms Worker retries a 5xx.
          return Response.json({ purged: false }, { status: 503, headers: NO_STORE })
        }
        return Response.json({ purged: true }, { headers: NO_STORE })
      }
    }
  }
})
