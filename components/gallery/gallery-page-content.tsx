'use client'

import { GalleryModal } from '@/components/gallery/gallery-modal'
import { StickyCategoryNav } from '@/components/gallery/sticky-category-nav'
import { useStickyNav } from '@/hooks/use-sticky-nav'
import { groupGalleryByCategory, type Gallery } from '@/lib/gallery'
import * as React from 'react'
import { HouseGalleryClient } from './house-gallery-client'

type GalleryPageContentProps = {
  gallery: Gallery
  title: string
  /** Back button element (Link or Dialog.Close) */
  backButton: React.ReactNode
}

export function GalleryPageContent({
  gallery,
  title,
  backButton
}: GalleryPageContentProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [scrollContainer, setScrollContainer] =
    React.useState<HTMLDivElement | null>(null)

  // Compute categories for sticky nav
  const categories = React.useMemo(
    () => groupGalleryByCategory(gallery).filter((c) => c.items.length > 0),
    [gallery]
  )

  const sectionIds = React.useMemo(
    () => categories.map((c) => c.key),
    [categories]
  )

  const { isVisible, sentinelRef, activeId } = useStickyNav({
    sectionIds,
    scrollContainer
  })

  // Set scroll container after mount (needed for IntersectionObserver root)
  React.useEffect(() => {
    setScrollContainer(scrollContainerRef.current)
  }, [])

  return (
    <>
      {/* Header with back button and category nav */}
      <div className="border-border/50 flex shrink-0 items-center gap-2 p-4 md:border-b">
        {backButton}
        <div className="container-wrapper min-w-0 flex-1">
          <div className="container p-0">
            <StickyCategoryNav
              categories={categories}
              activeId={activeId}
              isVisible={isVisible}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto scroll-smooth"
      >
        <div className="container-wrapper">
          <div className="container py-8 md:py-12">
            <HouseGalleryClient gallery={gallery} sentinelRef={sentinelRef} />
          </div>
        </div>
      </div>

      <GalleryModal gallery={gallery} title={title} />
    </>
  )
}
