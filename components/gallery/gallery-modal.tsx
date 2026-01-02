import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { useSwipeToClose } from '@/hooks/use-swipe-to-close'
import {
  flattenGalleryItems,
  getImageIndex,
  type GalleryCategories
} from '@/lib/gallery'
import { store } from '@/lib/store'
import { urlFor } from '@/sanity/lib/image'
import * as Dialog from '@radix-ui/react-dialog'
import { getImageDimensions } from '@sanity/asset-utils'
import { useStore } from '@tanstack/react-form'
import { ArrowLeftIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { stegaClean } from 'next-sanity'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'

type DataAttributeFn = (path: string) => string

type GalleryModalProps = {
  galleryCategories: GalleryCategories
  title: string
  dataAttribute?: DataAttributeFn
}

export function GalleryModal({
  galleryCategories,
  title,
  dataAttribute
}: GalleryModalProps) {
  const photoId = useStore(store, (state) => state.photoId)
  const t = useTranslations('GalleryModal')

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
        <Dialog.Content className="bg-background text-foreground sm:bg-background/50 fixed inset-0 z-40 flex items-center justify-center border-0 p-0 sm:backdrop-blur-2xl">
          <Dialog.Title className="sr-only">{t('title')}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t('description', { title })}
          </Dialog.Description>
          <GalleryModalCarousel
            galleryCategories={galleryCategories}
            dataAttribute={dataAttribute}
          />
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 rounded-full"
            >
              <ArrowLeftIcon className="size-6" />
              <span className="sr-only">{t('close')}</span>
            </Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type GalleryModalCarouselProps = {
  galleryCategories: GalleryCategories
  dataAttribute?: DataAttributeFn
}

function GalleryModalCarousel({
  galleryCategories,
  dataAttribute
}: GalleryModalCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const photoId = useStore(store, (state) => state.photoId)

  // Flatten all gallery items for carousel navigation
  const imageList = useMemo(
    () => flattenGalleryItems(galleryCategories),
    [galleryCategories]
  )

  const currentAlt = useMemo(() => {
    return selectedIndex !== null && selectedIndex < imageList.length
      ? stegaClean(imageList[selectedIndex].image.alt)
      : null
  }, [selectedIndex, imageList])

  const startIndex = photoId
    ? getImageIndex(galleryCategories, photoId)
    : undefined

  const { onTouchStart, onTouchEnd } = useSwipeToClose({
    onClose: () => store.setState({ photoId: null })
  })

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
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {imageList.map(({ _key, image }) => {
          if (!image.asset) return null
          const dimensions = getImageDimensions(image.asset)
          const src = urlFor(image).url()
          const alt = image.alt ? stegaClean(image.alt) : ''

          return (
            <CarouselItem
              key={_key}
              className="flex h-full items-center justify-center"
              data-sanity={dataAttribute?.(
                `galleryCategories[].items[_key=="${_key}"]`
              )}
            >
              <Image
                src={src}
                alt={alt}
                width={dimensions.width}
                height={dimensions.height}
                placeholder={image.preview ? 'blur' : undefined}
                blurDataURL={image.preview ?? undefined}
                className="max-h-screen object-contain select-none"
                sizes="100vw"
              />
            </CarouselItem>
          )
        })}
      </CarouselContent>
      {currentAlt && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-50 w-full -translate-x-1/2 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] text-center sm:pb-4 lg:w-fit">
          <span className="bg-primary-foreground/90 pointer-events-auto inline-block max-w-[90vw] rounded-lg px-4 py-2 text-sm wrap-break-word backdrop-blur-sm sm:max-w-none sm:text-base">
            {currentAlt}
          </span>
        </div>
      )}
      <CarouselPrevious variant="ghost" className="left-4 hidden sm:flex" />
      <CarouselNext variant="ghost" className="right-4 hidden sm:flex" />
    </Carousel>
  )
}
