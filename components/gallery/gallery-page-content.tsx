'use client'

import { GalleryModal } from '@/components/gallery/gallery-modal'
import { HouseGallery } from '@/components/gallery/house-gallery'
import { StickyCategoryNav } from '@/components/gallery/sticky-category-nav'
import { useStickyNav } from '@/hooks/use-sticky-nav'
import {
  groupGalleryByCategory,
  type Gallery,
  type GalleryItem
} from '@/lib/gallery'
import { createDataAttribute } from 'next-sanity'
import { useOptimistic } from 'next-sanity/hooks'
import * as React from 'react'
import { SanityDocument } from 'sanity'

type GalleryPageContentProps = {
  documentId: string
  documentType: string
  gallery: Gallery
  title: string
  /** Back button element (Link or Dialog.Close) */
  backButton: React.ReactNode
}

export function GalleryPageContent({
  documentId,
  documentType,
  gallery: initialGallery,
  title,
  backButton
}: GalleryPageContentProps) {
  const gallery = useOptimistic<
    Gallery,
    SanityDocument & { gallery?: GalleryItem[] }
  >(initialGallery, (currentGallery, action) => {
    if (action.id === documentId && action.document.gallery) {
      // Optimistic document only has partial data, merge with current
      return action.document.gallery.map(
        (item) => currentGallery?.find((g) => g._key === item._key) ?? item
      )
    }
    return currentGallery
  })

  const dataAttribute = createDataAttribute({
    id: documentId,
    type: documentType
  })

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
            <HouseGallery
              gallery={gallery}
              sentinelRef={sentinelRef}
              dataAttribute={dataAttribute}
            />
          </div>
        </div>
      </div>

      <GalleryModal
        gallery={gallery}
        title={title}
        dataAttribute={dataAttribute}
      />
    </>
  )
}
