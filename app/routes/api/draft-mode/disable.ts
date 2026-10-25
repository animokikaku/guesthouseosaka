import { disableDraftMode } from '@/sanity/lib/draft-mode.server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/draft-mode/disable')({
  server: {
    handlers: {
      GET: ({ request }) => {
        disableDraftMode(request)
        return Response.json(
          { status: 'Draft mode disabled' },
          { headers: { 'Cache-Control': 'no-store' } }
        )
      }
    }
  }
})
