import { cacheHeaders, cacheTags } from '@/lib/cache-control'
import { webManifest } from '@/lib/manifest'
import { LOADER_CONTENT_TYPES } from '@/sanity/lib/content-types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manifest.webmanifest')({
  server: {
    handlers: {
      GET: async () =>
        Response.json(await webManifest(), {
          headers: {
            ...cacheHeaders(false, cacheTags(LOADER_CONTENT_TYPES.manifest)),
            'Content-Type': 'application/manifest+json'
          }
        })
    }
  }
})
