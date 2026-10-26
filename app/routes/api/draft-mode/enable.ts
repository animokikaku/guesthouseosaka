/**
 * Lets Presentation put the app in draft mode, which loads Visual Editing and
 * queries draft content to preview it as it will appear once published.
 */
import { serverEnv } from '@/lib/env.server'
import { client } from '@/sanity/lib/client'
import { enableDraftMode } from '@/sanity/lib/draft-mode.server'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/draft-mode/enable')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const {
          isValid,
          redirectTo = '/',
          studioPreviewPerspective
        } = await validatePreviewUrl(
          client.withConfig({ token: serverEnv.SANITY_API_READ_TOKEN }),
          request.url
        )

        if (!isValid) {
          return new Response('Invalid secret', { status: 401 })
        }

        enableDraftMode(request, studioPreviewPerspective ?? undefined)
        return new Response(null, {
          status: 307,
          headers: { Location: redirectTo, 'Cache-Control': 'no-store' }
        })
      }
    }
  }
})
