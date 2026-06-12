'use client'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { toGalleryImageProps, type GallerySlide } from '@/lib/gallery'
import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ComponentProps, useEffect, useState } from 'react'

type MobileHeroImageProps = {
  href: ComponentProps<typeof Link>['href']
  images: GallerySlide[]
}

export function MobileHeroImage({ href, images }: MobileHeroImageProps) {
  const t = useTranslations('MobileHeroImage')
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(1)

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
      <div className="sm:hidden">
        <Empty className="min-h-96 w-full border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>{t('empty_title')}</EmptyTitle>
            <EmptyDescription>{t('empty_description')}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <Link href={href} className="select-none sm:hidden">
      <Carousel className="max-h-96 w-full cursor-pointer select-none" setApi={setApi}>
        <CarouselContent>
          {images.map(({ _key, image }, index) => {
            const imageProps = toGalleryImageProps(image, {
              width: 640,
              height: 384,
              includeDimensions: false
            })

            return (
              <CarouselItem className="relative h-96 w-full select-none" key={_key}>
                <Image
                  {...imageProps}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="object-cover"
                  sizes="(max-width: 639px) 100vw, 0"
                />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <div className="absolute right-3 bottom-12 z-10 rounded bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          {currentIndex} / {images.length}
        </div>
      </Carousel>
    </Link>
  )
}
