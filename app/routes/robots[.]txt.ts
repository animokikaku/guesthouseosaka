import robots, { toRobotsTxt } from '@/app/robots'
import { STATIC_FILE_CACHE_CONTROL } from '@/lib/cache-control'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(toRobotsTxt(robots()), {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': STATIC_FILE_CACHE_CONTROL
          }
        })
    }
  }
})
