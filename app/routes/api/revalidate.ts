/**
 * Sanity's publish webhook (configured in sanity.io/manage, see
 * docs/sanity-workflow.md): purges the responses that read the published
 * document's type, so a publish shows within seconds instead of once the cache
 * expires, and the rest of the site stays cached.
 */
import { env as serverEnv } from '@/env'
import { typesToPurge } from '@/sanity/lib/content-types'
import { purgePublishedResponses } from '@/sanity/lib/fetch.server'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'
import { createFileRoute } from '@tanstack/react-router'

const NO_STORE = { 'Cache-Control': 'no-store' }

export const Route = createFileRoute('/api/revalidate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = serverEnv.SANITY_WEBHOOK_SECRET
        // Verified as received: re-encoded JSON may not match what Sanity signed.
        const body = await request.text()
        const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? ''
        if (!secret || !(await isValidSignature(body, signature, secret))) {
          return new Response('Invalid signature', { status: 401, headers: NO_STORE })
        }

        const types = typesToPurge(body)
        if (types === null) return Response.json({ purged: false }, { headers: NO_STORE })

        // Throws where there is no Workers Cache, as in local dev and preview.
        const { success, errors } = await purgePublishedResponses(types).catch(
          (error: unknown) => ({ success: false, errors: [error] })
        )
        if (!success) {
          console.error('Failed to purge published responses', errors)
          // Sanity retries a webhook that answers with a 5xx.
          return Response.json({ purged: false }, { status: 503, headers: NO_STORE })
        }
        return Response.json({ purged: types ?? 'all' }, { headers: NO_STORE })
      }
    }
  }
})
