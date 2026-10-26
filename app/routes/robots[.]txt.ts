import robots, { toRobotsTxt } from '@/app/robots'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(toRobotsTxt(robots()), {
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=0, s-maxage=86400'
          }
        })
    }
  }
})
