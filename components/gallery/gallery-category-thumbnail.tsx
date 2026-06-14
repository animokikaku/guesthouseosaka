'use client'

import { Badge } from '@/components/ui/badge'
import type { GalleryCategory } from '@/lib/gallery'
import { toGalleryImageProps } from '@/lib/gallery-image'
import { scrollToGalleryCategory } from '@/lib/gallery-scroll'
import Image from 'next/image'

type CategoryThumbnailProps = {
  category: GalleryCategory
  tabIndex?: number
}

export function CategoryThumbnail({ category, tabIndex = 0 }: CategoryThumbnailProps) {
  const thumbnail = category.thumbnail
  if (category.items.length === 0 || !thumbnail) return null

  const imageProps = toGalleryImageProps(thumbnail, {
    width: 256,
    height: 192,
    alt: thumbnail.alt ?? category.label,
    includeDimensions: false
  })
  if (!imageProps) return null

  return (
    <button
      type="button"
      onClick={() => scrollToGalleryCategory(category._id)}
      tabIndex={tabIndex}
      className="group focus-visible:ring-ring flex h-auto w-[154px] shrink-0 cursor-pointer flex-col gap-2 rounded-lg p-3 text-center transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
    >
      <span className="relative mx-auto block aspect-4/3 w-32 overflow-hidden rounded-md">
        <Image {...imageProps} fill className="object-cover" sizes="128px" />
        <Badge
          variant="secondary"
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 min-w-7 rounded-none rounded-tl-md rounded-br-md text-xs"
        >
          {category.items.length}
        </Badge>
      </span>
      <span className="text-muted-foreground group-hover:text-foreground line-clamp-2 text-xs font-medium transition-colors">
        {category.label}
      </span>
    </button>
  )
}
