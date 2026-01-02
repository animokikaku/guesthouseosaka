'use client'

import { GalleryModal } from '@/components/gallery/gallery-modal'
import { HouseGallery } from '@/components/gallery/house-gallery'
import { StickyCategoryNav } from '@/components/gallery/sticky-category-nav'
import { useStickyNav } from '@/hooks/use-sticky-nav'
import {
  toGalleryCategories,
  type GalleryCategories,
  type GalleryCategoryData
} from '@/lib/gallery'
import { createDataAttribute } from 'next-sanity'
import { useOptimistic } from 'next-sanity/hooks'
import * as React from 'react'
import { SanityDocument } from 'sanity'

type GalleryPageContentProps = {
  documentId: string
  documentType: string
  galleryCategories: GalleryCategories
  title: string
  /** Back button element (Link or Dialog.Close) */
  backButton: React.ReactNode
}

export function GalleryPageContent({
  documentId,
  documentType,
  galleryCategories: initialGalleryCategories,
  title,
  backButton
}: GalleryPageContentProps) {
  const galleryCategories = useOptimistic<
    GalleryCategories,
    SanityDocument & { galleryCategories?: GalleryCategoryData[] }
  >(initialGalleryCategories, (current, action) => {
    if (action.id === documentId && action.document.galleryCategories) {
      // Optimistic document only has partial data, merge with current
      return action.document.galleryCategories.map(
        (cat) => current?.find((c) => c._key === cat._key) ?? cat
      )
    }
    return current
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
    () => toGalleryCategories(galleryCategories),
    [galleryCategories]
  )

  const sectionIds = React.useMemo(
    () => categories.map((c) => c.category.key),
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
              galleryCategories={galleryCategories}
              sentinelRef={sentinelRef}
              dataAttribute={dataAttribute}
            />
          </div>
        </div>
      </div>

      <GalleryModal
        galleryCategories={galleryCategories}
        title={title}
        dataAttribute={dataAttribute}
      />
    </>
  )
}
