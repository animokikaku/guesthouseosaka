'use client'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useGallery } from '@/lib/images/sanity-client'
import { store } from '@/lib/store'
import { HouseIdentifier } from '@/lib/types'
import * as Dialog from '@radix-ui/react-dialog'
import { useStore } from '@tanstack/react-form'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function GalleryModal() {
  const { house } = useParams()
  const photoId = useStore(store, (state) => state.photoId)
  const t = useTranslations('GalleryModal')
  const houseLabel = useHouseLabels()
  const { name: title } = houseLabel(house as HouseIdentifier)

  return (
    <Dialog.Root
      open={photoId !== null}
      onOpenChange={(open) => {
        if (!open) {
          store.setState({ photoId: null })
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-30" />
        <Dialog.Content className="dark text-foreground bg-background sm:bg-background/50 fixed inset-0 z-40 max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-none backdrop-blur-2xl">
          <Dialog.Title className="sr-only">{t('title')}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('description', { title })}
          </Dialog.Description>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <GalleryModalCarousel />
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 left-0 m-4 rounded-full"
              >
                <ArrowLeftIcon className="size-6" />
                <span className="sr-only">{t('close')}</span>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function GalleryModalCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const photoId = useStore(store, (state) => state.photoId)
  const gallery = useGallery()

  const images = gallery.images()
  const startIndex = photoId ? gallery.indexOf(photoId) : undefined
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        api?.scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        api?.scrollNext()
      }
    },
    [api]
  )

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Close if:
      // 1. It's a downward swipe (deltaY > 0) or upward swipe (deltaY < 0)
      // 2. Vertical movement is greater than horizontal (to avoid interfering with carousel)
      // 3. The swipe is significant enough (at least 50px)
      if (absDeltaY > absDeltaX && absDeltaY > 50) {
        store.setState({ photoId: null })
      }

      setTouchStart(null)
    },
    [touchStart]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap())
    }

    onSelect()
    api.on('select', onSelect)

    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  return (
    <Carousel
      className="h-screen w-screen"
      opts={{ startIndex: startIndex }}
      setApi={setApi}
    >
      <CarouselContent
        className="h-screen items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image) => (
          <CarouselItem
            key={image.id}
            className="flex h-full items-center justify-center"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              placeholder="blur"
              blurDataURL={image.blurDataURL}
              className="max-h-screen max-w-screen object-contain select-none"
              sizes="100vw"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {selectedIndex !== null && images[selectedIndex]?.alt && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-50 w-full -translate-x-1/2 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] text-center sm:pb-4 lg:w-fit">
          <span className="bg-primary-foreground/90 pointer-events-auto inline-block max-w-[90vw] rounded-lg px-4 py-2 text-sm wrap-break-word backdrop-blur-sm sm:max-w-none sm:text-base">
            {images[selectedIndex].alt}
          </span>
        </div>
      )}
      <CarouselPrevious variant="ghost" className="left-4 hidden sm:flex" />
      <CarouselNext variant="ghost" className="right-4 hidden sm:flex" />
    </Carousel>
  )
}
