import sitemap, { toSitemapXml } from '@/app/sitemap'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(toSitemapXml(sitemap()), {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=0, s-maxage=86400'
          }
        })
    }
  }
})
