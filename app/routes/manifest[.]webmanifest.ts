import manifest from '@/app/manifest'
import { cacheHeaders } from '@/lib/cache-control'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manifest.webmanifest')({
  server: {
    handlers: {
      GET: async () =>
        Response.json(await manifest(), {
          headers: {
            ...cacheHeaders(false),
            'Content-Type': 'application/manifest+json'
          }
        })
    }
  }
})
