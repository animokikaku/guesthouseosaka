/**
 * Sanity's publish webhook (configured in sanity.io/manage, see
 * docs/sanity-workflow.md): purges the responses built from published content,
 * so a publish shows within seconds instead of once the cache expires.
 */
import { serverEnv } from '@/lib/env.server'
import { purgePublishedResponses } from '@/sanity/lib/fetch.server'
import {
  isValidSanitySignature,
  SANITY_SIGNATURE_HEADER
} from '@/sanity/lib/webhook-signature.server'
import { createFileRoute } from '@tanstack/react-router'

const NO_STORE = { 'Cache-Control': 'no-store' }

export const Route = createFileRoute('/api/revalidate')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = serverEnv.SANITY_WEBHOOK_SECRET
        const body = await request.text()
        if (
          !secret ||
          !isValidSanitySignature(body, request.headers.get(SANITY_SIGNATURE_HEADER), secret)
        ) {
          return new Response('Invalid signature', { status: 401, headers: NO_STORE })
        }

        // Throws where there is no Workers Cache, as in local dev and preview.
        const { success, errors } = await purgePublishedResponses().catch((error: unknown) => ({
          success: false,
          errors: [error]
        }))
        if (!success) {
          console.error('Failed to purge published responses', errors)
          // Sanity retries a webhook that answers with a 5xx.
          return Response.json({ purged: false }, { status: 503, headers: NO_STORE })
        }
        return Response.json({ purged: true }, { headers: NO_STORE })
      }
    }
  }
})
