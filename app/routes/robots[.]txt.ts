import { STATIC_FILE_CACHE_CONTROL } from '@/lib/cache-control'
import { robotsTxt } from '@/lib/robots'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(robotsTxt(), {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': STATIC_FILE_CACHE_CONTROL
          }
        })
    }
  }
})
