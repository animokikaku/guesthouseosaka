'use client'

import dynamic from 'next/dynamic'

// The indicator depends on @sanity/visual-editing, which is only needed in draft mode.
// Loading it on demand keeps that code out of the bundle for regular visitors.
export const LazyDraftModeIndicator = dynamic(() =>
  import('@/components/draft-mode-indicator').then((mod) => mod.DraftModeIndicator)
)
