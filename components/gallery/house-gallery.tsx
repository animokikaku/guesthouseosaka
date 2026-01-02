import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  toGalleryCategories,
  type GalleryCategories,
  type GalleryCategory,
  type GalleryItem
} from '@/lib/gallery'
import { store } from '@/lib/store'
import { urlFor } from '@/sanity/lib/image'
import { stegaClean } from '@sanity/client/stega'
import Image from 'next/image'
import * as React from 'react'
import { GalleryImageButton } from './gallery-image-button'

type DataAttributeFn = (path: string) => string

type HouseGalleryProps = {
  galleryCategories: GalleryCategories
  /** Ref for sentinel element (used to detect when thumbnails scroll out of view) */
  sentinelRef?: React.RefObject<HTMLDivElement | null>
  /** Data attribute helper for Sanity visual editing */
  dataAttribute?: DataAttributeFn
}

export function HouseGallery({
  galleryCategories,
  sentinelRef,
  dataAttribute
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
                key={`thumbnail-${category.category.key}`}
                category={category}
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
            key={`grid-${category.category.key}`}
            category={category}
            dataAttribute={dataAttribute}
          />
        ))}
      </div>
    </div>
  )
}

type CategoryThumbnailProps = {
  category: GalleryCategory
}

function CategoryThumbnail({ category }: CategoryThumbnailProps) {
  const thumbnail = category.thumbnail
  const firstItemKey = category.items[0]?._key
  if (!thumbnail || !firstItemKey) return null

  const src = urlFor(thumbnail).width(256).height(192).dpr(2).fit('crop').url()

  return (
    <button
      onClick={() => {
        const targetElement = document.getElementById(category.category.key)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className="group focus-visible:ring-ring flex h-auto w-[154px] shrink-0 cursor-pointer flex-col gap-2 rounded-lg p-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative aspect-4/3 w-32 overflow-hidden rounded-md">
        <Image
          src={src}
          alt={stegaClean(thumbnail.alt) ?? ''}
          fill
          placeholder={thumbnail.preview ? 'blur' : undefined}
          blurDataURL={thumbnail.preview ?? undefined}
          className="object-cover"
          sizes="128px"
        />
        <div className="absolute right-0 bottom-0">
          <Badge
            variant="secondary"
            className="min-w-7 rounded-none rounded-tl-md rounded-br-md text-xs"
          >
            {category.count}
          </Badge>
        </div>
      </div>
      <span className="text-muted-foreground group-hover:text-foreground line-clamp-2 text-xs font-medium transition-colors">
        {category.category.label}
      </span>
    </button>
  )
}

type CategoryGridProps = {
  category: GalleryCategory
  dataAttribute?: DataAttributeFn
}

function CategoryGrid({ category, dataAttribute }: CategoryGridProps) {
  if (category.items.length === 0) return null

  return (
    <div
      id={category.category.key}
      className="scroll-mt-3 space-y-4"
      data-sanity={dataAttribute?.(
        `galleryCategories[_key=="${category._key}"]`
      )}
    >
      <h3 className="text-xl font-semibold">{category.category.label}</h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {category.items.map((item) => (
          <GalleryGridItem
            key={item._key}
            item={item}
            categoryKey={category._key}
            dataAttribute={dataAttribute}
          />
        ))}
      </div>
    </div>
  )
}

type GalleryGridItemProps = {
  item: GalleryItem
  categoryKey: string
  dataAttribute?: DataAttributeFn
}

function GalleryGridItem({
  item,
  categoryKey,
  dataAttribute
}: GalleryGridItemProps) {
  const { _key, image } = item
  if (!image) return null

  const src = urlFor(image).width(400).height(400).dpr(2).fit('crop').url()

  return (
    <GalleryImageButton
      onClick={() => store.setState({ photoId: _key })}
      imageProps={{
        src,
        alt: stegaClean(image.alt) ?? '',
        width: 400,
        height: 400,
        blurDataURL: image.preview ?? undefined,
        placeholder: image.preview ? 'blur' : undefined
      }}
      className="aspect-square rounded-lg"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      data-sanity={dataAttribute?.(
        `galleryCategories[_key=="${categoryKey}"].items[_key=="${_key}"]`
      )}
    />
  )
}
