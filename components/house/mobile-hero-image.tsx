'use client'

import { GalleryEmptyState } from '@/components/gallery/gallery-empty-state'
import { SanityImage } from '@/components/sanity-image'
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useCarouselIndex } from '@/hooks/use-carousel-index'
import { Link } from '@/i18n/navigation'
import type { GallerySlide } from '@/lib/gallery'
import { toGalleryImageProps } from '@/lib/gallery-image'
import { useTranslations } from 'next-intl'
import { ComponentProps, useState } from 'react'

type MobileHeroImageProps = {
  href: ComponentProps<typeof Link>['href']
  images: GallerySlide[]
}

export function MobileHeroImage({ href, images }: MobileHeroImageProps) {
  const t = useTranslations('MobileHeroImage')
  const [api, setApi] = useState<CarouselApi>()
  const currentIndex = useCarouselIndex(api)

  if (images.length === 0) {
    return (
      <div className="sm:hidden">
        <GalleryEmptyState className="min-h-96 w-full" />
      </div>
    )
  }

  return (
    <Link prefetch href={href} aria-label={t('view_gallery')} className="select-none sm:hidden">
      <Carousel className="max-h-96 w-full cursor-pointer select-none" setApi={setApi}>
        <CarouselContent>
          {images.map(({ _key, image }, index) => {
            const imageProps = toGalleryImageProps(image, {
              width: 640,
              height: 384,
              includeDimensions: false
            })
            if (!imageProps) return null

            return (
              <CarouselItem className="relative h-96 w-full select-none" key={_key}>
                <SanityImage
                  {...imageProps}
                  fill
                  // Mobile LCP candidate. Eager + high priority rather than
                  // `preload`: the desktop grid has its own LCP tile, and a
                  // preload link would fetch this one on every viewport.
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  className="object-cover"
                  sizes="(max-width: 639px) 100vw, 0"
                />
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <div className="absolute right-3 bottom-12 z-10 rounded bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          {currentIndex + 1} / {images.length}
        </div>
      </Carousel>
    </Link>
  )
}
