import { CategoryGrid } from '@/components/gallery/gallery-category-grid'
import { CategoryThumbnail } from '@/components/gallery/gallery-category-thumbnail'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { toGalleryCategories, type GalleryCategories } from '@/lib/gallery'
import * as React from 'react'

type DataAttributeFn = (path: string) => string

type HouseGalleryProps = {
  galleryCategories: GalleryCategories
  /** Ref for sentinel element (used to detect when thumbnails scroll out of view) */
  sentinelRef?: React.RefObject<HTMLDivElement | null>
  /** Data attribute helper for Sanity visual editing */
  dataAttribute?: DataAttributeFn
  /** Whether the sticky nav is visible (thumbnails should be removed from tab order) */
  stickyNavVisible?: boolean
}

export function HouseGallery({
  galleryCategories,
  sentinelRef,
  dataAttribute,
  stickyNavVisible = false
}: HouseGalleryProps) {
  // Transform to display format with computed fields
  const categories = React.useMemo(
    () => toGalleryCategories(galleryCategories),
    [galleryCategories]
  )

  return (
    <div className="space-y-8">
      {/* Category Navigation with Thumbnails */}
      <div className="space-y-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-4">
            {categories.map((category) => (
              <CategoryThumbnail
                key={`thumbnail-${category._id}`}
                category={category}
                tabIndex={stickyNavVisible ? -1 : 0}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {/* Sentinel element - when this scrolls out of view, show sticky nav */}
        {sentinelRef && <div ref={sentinelRef} aria-hidden="true" />}
      </div>

      {/* All Categories Grid */}
      <div className="space-y-12">
        {categories.map((category) => (
          <CategoryGrid
            key={`grid-${category._id}`}
            category={category}
            dataAttribute={dataAttribute}
          />
        ))}
      </div>
    </div>
  )
}
