'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useGallery, type GalleryImageWithProps } from '@/lib/images/sanity-client'
import { store } from '@/lib/store'
import Image from 'next/image'
import { GalleryImageButton } from './gallery-image-button'

export function HouseGalleryClient() {
  const gallery = useGallery()
  const categories = gallery.categories()

  return (
    <div className="space-y-8">
      {/* Category Navigation with Thumbnails */}
      <div className="space-y-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-4">
            {categories.map((categoryKey) => (
              <CategoryThumbnail
                key={`thumbnail-${categoryKey}`}
                categoryKey={categoryKey}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* All Categories Grid */}
      <div className="space-y-12">
        {categories.map((categoryKey) => (
          <CategoryGrid key={`grid-${categoryKey}`} categoryKey={categoryKey} />
        ))}
      </div>
    </div>
  )
}

function CategoryThumbnail({ categoryKey }: { categoryKey: string }) {
  const gallery = useGallery()
  const count = gallery.count({ category: categoryKey })
  const [image] = gallery.images({ category: categoryKey, limit: 1 })
  const label = gallery.categoryLabel(categoryKey)

  if (!image) return null

  return (
    <button
      onClick={() => {
        const targetElement = document.getElementById(categoryKey)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className="border-primary-foreground/20 hover:border-primary-foreground/40 flex h-auto cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors"
    >
      <div className="relative aspect-4/3 w-32 overflow-hidden rounded-md">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          placeholder={image.placeholder}
          blurDataURL={image.blurDataURL}
          className="object-cover"
          sizes="128px"
        />
        <div className="absolute right-0 bottom-0">
          <Badge
            variant="secondary"
            className="min-w-7 rounded-none rounded-tl-md rounded-br-md text-xs"
          >
            {count}
          </Badge>
        </div>
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function CategoryGrid({ categoryKey }: { categoryKey: string }) {
  const gallery = useGallery()
  const images = gallery.images({ category: categoryKey })
  const label = gallery.categoryLabel(categoryKey)

  if (images.length === 0) return null

  return (
    <div id={categoryKey} className="scroll-mt-8 space-y-4">
      <h3 className="text-xl font-semibold">{label}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image: GalleryImageWithProps) => (
          <GalleryImageButton
            key={image.id}
            onClick={() => store.setState({ photoId: image.id })}
            imageProps={image}
            className="aspect-square rounded-lg"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ))}
      </div>
    </div>
  )
}
