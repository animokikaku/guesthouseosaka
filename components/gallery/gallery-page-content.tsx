import { CategoryGrid } from '@/components/gallery/gallery-category-grid'
import { LightboxGallery } from '@/components/gallery/lightbox-gallery'
import { Lightbox } from '@/components/ui/lightbox'
import { StickyCategoryNav } from '@/components/gallery/sticky-category-nav'
import {
  type PhotoNavigate,
  useLightboxUrlState
} from '@/components/gallery/use-lightbox-url-state'
import { useStickyNav } from '@/hooks/use-sticky-nav'
import {
  flattenGalleryItems,
  type GalleryCategories,
  type GalleryCategoryData
} from '@/lib/gallery'
import { toGalleryLightboxItem, type LightboxItem } from '@/lib/gallery-image'
import { OptimisticArray } from '@/components/optimistic-array'
import { toGalleryCategories } from '@/lib/transforms/gallery'
import { useTranslations } from 'use-intl'
import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute'
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
  /** The `_key` of the photo the URL opens in the lightbox */
  photo: string | undefined
  /** Moves the route's URL to a photo, keeping its mask if it has one */
  onPhotoNavigate: PhotoNavigate
}

export function GalleryPageContent(props: GalleryPageContentProps) {
  return (
    <OptimisticArray
      documentId={props.documentId}
      value={props.galleryCategories}
      select={(document: { galleryCategories?: GalleryCategoryData[] }) =>
        document.galleryCategories
      }
    >
      {(galleryCategories) => (
        <GalleryPageBody {...props} galleryCategories={galleryCategories ?? []} />
      )}
    </OptimisticArray>
  )
}

function GalleryPageBody({
  documentId,
  documentType,
  galleryCategories,
  title,
  backButton,
  photo,
  onPhotoNavigate
}: GalleryPageContentProps) {
  const t = useTranslations('GalleryPageContent')

  const dataAttribute = createDataAttribute({
    id: documentId,
    type: documentType
  })

  const scrollContainerRef = useRef<HTMLElement>(null)
  const categories = toGalleryCategories(galleryCategories)
  const sectionIds = categories.map((c) => c._id)

  const lightboxItems: LightboxItem[] = []
  const indexByKey = new Map<string, number>()
  for (const item of flattenGalleryItems(galleryCategories)) {
    const lightboxItem = toGalleryLightboxItem(item)
    if (!lightboxItem) continue
    indexByKey.set(item._key, lightboxItems.length)
    lightboxItems.push(lightboxItem)
  }

  const lightbox = useLightboxUrlState({
    photo,
    keys: lightboxItems.map((item) => item.id),
    navigate: onPhotoNavigate
  })

  const { activeId } = useStickyNav({
    sectionIds,
    scrollContainerRef
  })

  return (
    <Lightbox.Root
      open={lightbox.open}
      onOpenChange={lightbox.onOpenChange}
      value={lightbox.value}
      onValueChange={lightbox.onValueChange}
      // Items register in effects, so a deep link's server render would count 0.
      count={lightboxItems.length}
      scrollTriggerIntoView={SCROLL_TRIGGER_INTO_VIEW}
      awaitImageDecode={false}
    >
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
          {/* The first section sits flush with the top so jumping to it leaves
              nothing to scroll back up to. */}
          <div className="pb-10">
            {categories.map((category) => (
              <CategoryGrid
                key={category._id}
                category={category}
                dataAttribute={dataAttribute}
                indexByKey={indexByKey}
              />
            ))}
          </div>
        </main>
      </div>

      <LightboxGallery
        items={lightboxItems}
        ariaLabel={title || t('gallery_title')}
        // A deep link renders the viewer open on the server, where a portal
        // can't render: keep it in place for this mount.
        inPlace={lightbox.openedOnLoad}
        captionFallback={lightbox.openedOnLoad ? lightboxItems[lightbox.value]?.caption : undefined}
      />
    </Lightbox.Root>
  )
}
