'use client'

import { GalleryModal } from '@/components/gallery/gallery-modal'
import { HouseGallery } from '@/components/gallery/house-gallery'
import { StickyCategoryNav } from '@/components/gallery/sticky-category-nav'
import { useStickyNav } from '@/hooks/use-sticky-nav'
import { type GalleryCategories, type GalleryCategoryData } from '@/lib/gallery'
import { useSanityOptimisticArray } from '@/lib/sanity-optimistic'
import { toGalleryCategories } from '@/lib/transforms/gallery'
import { createDataAttribute } from 'next-sanity'
import { useMemo, useRef, type ReactNode } from 'react'

type GalleryPageContentProps = {
  documentId: string
  documentType: string
  galleryCategories: GalleryCategories
  title: string
  /** Back button element (Link or Dialog.Close) */
  backButton: ReactNode
}

export function GalleryPageContent({
  documentId,
  documentType,
  galleryCategories: initialGalleryCategories,
  title,
  backButton
}: GalleryPageContentProps) {
  const galleryCategories = useSanityOptimisticArray<
    GalleryCategoryData,
    GalleryCategories,
    { galleryCategories?: GalleryCategoryData[] }
  >(documentId, initialGalleryCategories, (document) => document.galleryCategories)

  const dataAttribute = createDataAttribute({
    id: documentId,
    type: documentType
  })

  const scrollContainerRef = useRef<HTMLElement>(null)
  const categories = useMemo(
    () => toGalleryCategories(galleryCategories),
    [galleryCategories]
  )
  const sectionIds = useMemo(() => categories.map((c) => c._id), [categories])

  const { isVisible, sentinelRef, activeId } = useStickyNav({
    sectionIds,
    scrollContainerRef
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-border/50 flex shrink-0 items-center gap-2 p-4 md:border-b">
        <div className="shrink-0">{backButton}</div>
        <div className="container-wrapper min-w-0 flex-1">
          <div className="container p-0">
            <StickyCategoryNav categories={categories} activeId={activeId} isVisible={isVisible} />
          </div>
        </div>
      </div>

      <main
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto scroll-smooth"
        aria-label="Gallery Content"
      >
        <div className="container-wrapper">
          <div className="container py-8 md:py-12">
            <HouseGallery
              categories={categories}
              sentinelRef={sentinelRef}
              dataAttribute={dataAttribute}
              stickyNavVisible={isVisible}
            />
          </div>
        </div>
      </main>

      <GalleryModal
        galleryCategories={galleryCategories}
        title={title}
        dataAttribute={dataAttribute}
      />
    </div>
  )
}
