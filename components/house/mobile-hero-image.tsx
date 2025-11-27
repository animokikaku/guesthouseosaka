'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import { Empty, EmptyTitle } from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { storage } from '@/lib/images'
import { HouseIdentifier } from '@/lib/types'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function MobileHeroImage({ house }: { house: HouseIdentifier }) {
  const locale = useLocale()
  const t = useTranslations('gallery')
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(1)

  const images = storage({ house, locale }).images()

  useEffect(() => {
    if (!api) return

    const updateIndex = () => {
      setCurrentIndex(api.selectedScrollSnap() + 1)
    }

    updateIndex()
    api.on('select', updateIndex)
    api.on('reInit', updateIndex)

    return () => {
      api.off('select', updateIndex)
      api.off('reInit', updateIndex)
    }
  }, [api])

  if (images.length === 0) {
    return (
      <Empty className="min-h-96 w-full">
        <EmptyTitle>{t('noImages')}</EmptyTitle>
      </Empty>
    )
  }

  return (
    <Link href={`/${house}/gallery`} className="select-none">
      <Carousel
        className="max-h-96 w-full cursor-pointer select-none"
        setApi={(carouselApi) => setApi(carouselApi)}
      >
        <CarouselContent>
          {images.map(({ id, src, alt, blurDataURL }, index) => (
            <CarouselItem
              className="relative h-96 w-full select-none sm:hidden"
              key={id}
            >
              <Image
                src={src}
                alt={alt}
                fill
                preload={index === 0}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className="object-cover"
                sizes="(max-width: 639px) 100vw, 0"
                placeholder={blurDataURL ? 'blur' : undefined}
                blurDataURL={blurDataURL}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute right-3 bottom-12 z-10 block rounded-sm bg-black/60 px-3 py-1 text-xs text-white backdrop-blur sm:hidden">
          {currentIndex} / {images.length}
        </div>
      </Carousel>
    </Link>
  )
}
