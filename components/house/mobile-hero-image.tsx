'use client'

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { useGallery } from '@/lib/images/sanity-client'
import { HouseIdentifier } from '@/lib/types'
import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type MobileHeroImageProps = {
  id: HouseIdentifier
}

export function MobileHeroImage({ id }: MobileHeroImageProps) {
  const t = useTranslations('MobileHeroImage')
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(1)

  const gallery = useGallery()
  const images = gallery.images()

  if (id === 'orange') {
    const [heroImage] = images.splice(11, 1)
    if (heroImage) images.unshift(heroImage)
  }

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
      <Empty className="min-h-96 w-full border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>{t('empty_title')}</EmptyTitle>
          <EmptyDescription>{t('empty_description')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <Link
      href={{ pathname: '/[house]/gallery', params: { house: id } }}
      className="select-none"
    >
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
