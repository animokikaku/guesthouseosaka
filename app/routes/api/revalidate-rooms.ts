/**
 * Called by the `guesthouseosaka-rooms` Worker, through its service binding,
 * after a sync changed rooms: purges the responses that show availability (see
 * docs/rooms.md).
 */
import { ROOMS_CACHE_TAG } from '@/lib/cache-control'
import { serverEnv } from '@/lib/env.server'
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

        // Throws where there is no Workers Cache, as in local dev and preview.
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
