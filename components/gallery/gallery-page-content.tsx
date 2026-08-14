'use client'

import { Lightbox } from '@/components/lightbox'
import { HouseGallery } from '@/components/gallery/house-gallery'
import { StickyCategoryNav } from '@/components/gallery/sticky-category-nav'
import { useStickyNav } from '@/hooks/use-sticky-nav'
import {
  flattenGalleryItems,
  type GalleryCategories,
  type GalleryCategoryData
} from '@/lib/gallery'
import { toGalleryLightboxItem } from '@/lib/gallery-image'
import { useSanityOptimisticArray } from '@/lib/sanity-optimistic'
import { toGalleryCategories } from '@/lib/transforms/gallery'
import { useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'
import { useRef, type ComponentProps, type ReactNode } from 'react'

/**
 * Keeps the grid scrolled to the active trigger so the close morph always lands
 * on-screen. Both moments are instant: the viewer covers the page while it runs,
 * so the repositioning is never visible. Triggers carry `scroll-my-*` padding.
 */
const SCROLL_TRIGGER_INTO_VIEW: ComponentProps<typeof Lightbox.Root>['scrollTriggerIntoView'] = [
  { type: 'onOpenComplete', behavior: 'instant', block: 'nearest' },
  { type: 'onChange', behavior: 'instant', block: 'nearest' }
]

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
  const t = useTranslations('GalleryPageContent')

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
  const categories = toGalleryCategories(galleryCategories)
  const sectionIds = categories.map((c) => c._id)

  const lightboxItemEntries = flattenGalleryItems(galleryCategories).flatMap((item) => {
    const lightboxItem = toGalleryLightboxItem(item)
    return lightboxItem ? [{ key: item._key, lightboxItem }] : []
  })
  const lightboxItems = lightboxItemEntries.map((entry) => entry.lightboxItem)
  const indexByKey = new Map(lightboxItemEntries.map((entry, index) => [entry.key, index]))

  const { activeId } = useStickyNav({
    sectionIds,
    scrollContainerRef
  })

  return (
    <Lightbox.Root scrollTriggerIntoView={SCROLL_TRIGGER_INTO_VIEW}>
      <div className="flex h-full flex-col">
        {/* Sits above the scroll container rather than over it, so it is opaque:
            nothing ever passes behind it to tint or blur. */}
        <div className="bg-background border-border/50 flex shrink-0 items-center gap-2 border-b p-4">
          <div className="shrink-0">{backButton}</div>
          <StickyCategoryNav categories={categories} activeId={activeId} />
        </div>

        <main
          ref={scrollContainerRef}
          className="relative flex-1 overflow-y-auto scroll-smooth"
          aria-label={t('gallery_content_label')}
        >
          <HouseGallery
            categories={categories}
            dataAttribute={dataAttribute}
            indexByKey={indexByKey}
          />
        </main>
      </div>

      <Lightbox.Gallery items={lightboxItems} ariaLabel={title || t('gallery_title')} />
    </Lightbox.Root>
  )
}
