'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { storage } from '@/lib/images'
import { store } from '@/lib/store'
import { HouseIdentifier } from '@/lib/types'
import { useLocale, useTranslations } from 'next-intl'
import { default as Image } from 'next/image'
import { GalleryImageButton } from './gallery-image-button'

export function HouseGalleryClient({ house }: { house: HouseIdentifier }) {
  const locale = useLocale()
  const t = useTranslations('HouseGalleryClient')
  const categories = storage({ house, locale }).categories()

  const categoryMap = {
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
            {categories.map(({ category, images }) => (
              <button
                key={category}
                onClick={() => {
                  const targetElement = document.getElementById(category)
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="border-primary-foreground/20 hover:border-primary-foreground/40 flex h-auto cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors"
              >
                <div className="relative aspect-4/3 w-32 overflow-hidden rounded-md">
                  <Image
                    src={images[0].src}
                    alt={images[0].alt}
                    fill
                    placeholder="blur"
                    blurDataURL={images[0].blurDataURL}
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute right-0 bottom-0">
                    <Badge
                      variant="secondary"
                      className="min-w-7 rounded-none rounded-tl-md rounded-br-md text-xs"
                    >
                      {images.length}
                    </Badge>
                  </div>
                </div>
                <span className="text-xs font-medium">
                  {categoryMap[category]}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* All Categories Grid */}
      <div className="space-y-12">
        {categories.map(({ category, images }) => (
          <div key={category} id={category} className="scroll-mt-8 space-y-4">
            <h3 className="text-xl font-semibold">{categoryMap[category]}</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images.map((image) => (
                <GalleryImageButton
                  key={image.id}
                  onClick={() => store.setState({ photoId: image.id })}
                  className="aspect-square rounded-lg"
                  imageProps={image}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
