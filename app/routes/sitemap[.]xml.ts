import { STATIC_FILE_CACHE_CONTROL } from '@/lib/cache-control'
import { sitemapXml } from '@/lib/sitemap'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(), {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': STATIC_FILE_CACHE_CONTROL
          }
        })
    }
  }
})
