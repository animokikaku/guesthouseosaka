'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { GalleryCategories, GalleryCategory } from '@/lib/gallery'
import { store } from '@/lib/store'
import Image from 'next/image'
import { GalleryImageButton } from './gallery-image-button'

type HouseGalleryClientProps = {
  categories: GalleryCategories
}

export function HouseGalleryClient({ categories }: HouseGalleryClientProps) {
  // Filter out categories with no images
  const validCategories = categories.filter((c) => c.images && c.images.length > 0)

  return (
    <div className="space-y-8">
      {/* Category Navigation with Thumbnails */}
      <div className="space-y-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-4">
            {validCategories.map((category) => (
              <CategoryThumbnail key={`thumbnail-${category.key}`} category={category} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* All Categories Grid */}
      <div className="space-y-12">
        {validCategories.map((category) => (
          <CategoryGrid key={`grid-${category.key}`} category={category} />
        ))}
      </div>
    </div>
  )
}

function CategoryThumbnail({ category }: { category: GalleryCategory }) {
  if (!category.thumbnail) return null

  return (
    <button
      onClick={() => {
        const targetElement = document.getElementById(category.key)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className="border-primary-foreground/20 hover:border-primary-foreground/40 flex h-auto cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors"
    >
      <div className="relative aspect-4/3 w-32 overflow-hidden rounded-md">
        <Image
          src={category.thumbnail.src ?? ''}
          alt={category.thumbnail.alt ?? ''}
          fill
          placeholder={category.thumbnail.blurDataURL ? 'blur' : undefined}
          blurDataURL={category.thumbnail.blurDataURL ?? undefined}
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
      <span className="text-xs font-medium">{category.label}</span>
    </button>
  )
}

function CategoryGrid({ category }: { category: GalleryCategory }) {
  if (!category.images || category.images.length === 0) return null

  return (
    <div id={category.key} className="scroll-mt-8 space-y-4">
      <h3 className="text-xl font-semibold">{category.label}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.images.map((image) => (
          <GalleryImageButton
            key={image._key}
            onClick={() => store.setState({ photoId: image._key })}
            imageProps={{
              src: image.src ?? '',
              alt: image.alt ?? '',
              width: image.width ?? 800,
              height: image.height ?? 600,
              blurDataURL: image.blurDataURL ?? undefined,
              placeholder: image.blurDataURL ? 'blur' : undefined
            }}
            className="aspect-square rounded-lg"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ))}
      </div>
    </div>
  )
}
