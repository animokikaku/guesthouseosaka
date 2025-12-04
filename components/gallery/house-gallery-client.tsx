'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useImages } from '@/lib/images'
import { CategoriesValues, ImageCategory } from '@/lib/images/storage'
import { store } from '@/lib/store'
import { useTranslations } from 'next-intl'
import { default as Image } from 'next/image'
import { GalleryImageButton } from './gallery-image-button'

export function HouseGalleryClient() {
  const t = useTranslations('HouseGalleryClient')

  const categoryMap: Record<ImageCategory, string> = {
    room: t('categories.room'),
    'common-spaces': t('categories.common_spaces'),
    facilities: t('categories.facilities'),
    'building-features': t('categories.building_features'),
    neighborhood: t('categories.neighborhood'),
    'floor-plan': t('categories.floor_plan'),
    maps: t('categories.maps')
  }

  return (
    <div className="space-y-8">
      {/* Category Navigation with Thumbnails */}
      <div className="space-y-4">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-4">
            {CategoriesValues.map((category) => (
              <CategoryThumbnail
                key={`thumbnail-${category}`}
                id={category}
                title={categoryMap[category]}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* All Categories Grid */}
      <div className="space-y-12">
        {CategoriesValues.map((category) => (
          <CategoryGrid
            key={`grid-${category}`}
            id={category}
            title={categoryMap[category]}
          />
        ))}
      </div>
    </div>
  )
}

function CategoryThumbnail({
  id,
  title
}: {
  id: ImageCategory
  title: string
}) {
  const storage = useImages()
  const count = storage.count({ category: id })
  const [image] = storage.images({ category: id, limit: 1 })

  if (!image) return null

  return (
    <button
      onClick={() => {
        const targetElement = document.getElementById(id)
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
          placeholder="blur"
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
      <span className="text-xs font-medium">{title}</span>
    </button>
  )
}

function CategoryGrid({ id, title }: { id: ImageCategory; title: string }) {
  const storage = useImages()
  const images = storage.images({ category: id })

  if (images.length === 0) return null

  return (
    <div id={id} className="scroll-mt-8 space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
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
