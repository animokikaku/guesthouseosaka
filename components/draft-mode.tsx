import { DraftModeIndicator } from '@/components/draft-mode-indicator'
import { client } from '@/sanity/lib/client'
import { getLiveToken } from '@/sanity/lib/draft-mode.functions'
import { VisualEditing, type HistoryAdapter } from '@sanity/visual-editing/react'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

/**
 * Everything draft mode adds to the page, loaded on demand: Visual Editing's
 * overlays, kept in sync with the router, a refresh whenever a draft changes,
 * and the indicator to leave draft mode.
 */
export default function DraftMode() {
  const router = useRouter()

  // Stands in for `<SanityLive includeDrafts />`: reload the route data when
  // any document the Live Content API reports on changes.
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined
    let cancelled = false

    void getLiveToken().then((token) => {
      if (!token || cancelled) return
      subscription = client
        .withConfig({ token, useCdn: false })
        .live.events({ includeDrafts: true, tag: 'draft-mode' })
        .subscribe((event) => {
          if (event.type === 'message' || event.type === 'restart') void router.invalidate()
        })
    })

    return () => {
      cancelled = true
      subscription?.unsubscribe()
    }
  }, [router])

  const history: HistoryAdapter = {
    subscribe: (navigate) => {
      navigate({ type: 'push', url: router.state.location.href })
      return router.subscribe('onResolved', ({ toLocation }) =>
        navigate({ type: 'push', url: toLocation.href })
      )
    },
    update: ({ type, url }) => {
      if (type === 'pop') return router.history.back()
      void router.navigate({ href: url, replace: type === 'replace' })
    }
  }

  return (
    <>
      <VisualEditing portal history={history} refresh={() => router.invalidate()} />
      <DraftModeIndicator />
    </>
  )
}
