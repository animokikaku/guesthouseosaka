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
import { GalleryImageWithProps, useGallery } from '@/lib/images/sanity-client'
import type { HouseQueryResult } from '@/sanity.types'
import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ComponentProps, useEffect, useMemo, useState } from 'react'

type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

export function MobileHeroImage({
  href,
  featuredImage
}: {
  href: ComponentProps<typeof Link>['href']
  featuredImage?: FeaturedImage
}) {
  const t = useTranslations('MobileHeroImage')
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(1)

  const gallery = useGallery()
  const galleryImages = gallery.images()

  // Prepend featured image if available
  const images = useMemo(() => {
    if (!featuredImage?.asset?.url) return galleryImages

    const featured: GalleryImageWithProps = {
      id: 'featured',
      src: featuredImage.asset.url,
      alt: featuredImage.alt ?? '',
      width: featuredImage.asset.dimensions?.width ?? 800,
      height: featuredImage.asset.dimensions?.height ?? 600,
      blurDataURL: featuredImage.asset.lqip ?? undefined,
      placeholder: featuredImage.asset.lqip ? 'blur' : undefined,
      category: { key: 'featured', label: null, order: -1 }
    }

    return [featured, ...galleryImages]
  }, [featuredImage, galleryImages])

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
      <Carousel
        className="max-h-96 w-full cursor-pointer select-none"
        setApi={(carouselApi) => setApi(carouselApi)}
      >
        <CarouselContent>
          {images.map(({ id, src, alt, blurDataURL }, index) => (
            <CarouselItem className="relative h-96 w-full select-none" key={id}>
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
        <div className="absolute right-3 bottom-12 z-10 block rounded-sm bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
          {currentIndex} / {images.length}
        </div>
      </Carousel>
    </Link>
  )
}
