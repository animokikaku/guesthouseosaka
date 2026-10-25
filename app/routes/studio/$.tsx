// Required since @sanity/ui v4: static styles are extracted to a stylesheet at
// build time instead of being injected at runtime.
import '@sanity/ui/styles.css'
import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

// Studio is a client-only app, kept out of the server render and its bundle.
const Studio = lazy(() => import('@/components/studio'))

export const Route = createFileRoute('/studio/$')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Sanity Studio' },
      { name: 'robots', content: 'noindex' },
      { name: 'referrer', content: 'same-origin' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
    ]
  }),
  component: Studio
})
