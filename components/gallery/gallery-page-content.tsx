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
  const categories = useMemo(() => toGalleryCategories(galleryCategories), [galleryCategories])
  const sectionIds = useMemo(() => categories.map((c) => c._id), [categories])

  const { activeId } = useStickyNav({
    sectionIds,
    scrollContainerRef
  })

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/70 flex shrink-0 items-center gap-2 p-4 backdrop-blur-xl">
        <div className="shrink-0">{backButton}</div>
        <StickyCategoryNav categories={categories} activeId={activeId} />
      </div>

      <main
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto scroll-smooth"
        aria-label="Gallery Content"
      >
        <HouseGallery categories={categories} dataAttribute={dataAttribute} />
      </main>

      <GalleryModal
        galleryCategories={galleryCategories}
        title={title}
        dataAttribute={dataAttribute}
      />
    </div>
  )
}
