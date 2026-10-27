import sitemap, { toSitemapXml } from '@/app/sitemap'
import { STATIC_FILE_CACHE_CONTROL } from '@/lib/cache-control'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(toSitemapXml(sitemap()), {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': STATIC_FILE_CACHE_CONTROL
          }
        })
    }
  }
})
