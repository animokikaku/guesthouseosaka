import {
  GalleryDialog,
  GalleryDialogContent,
  GalleryDialogDescription,
  GalleryDialogTitle
} from '@/components/gallery/gallery-dialog'
import { GalleryModalCloseButton } from '@/components/gallery/gallery-modal-close-button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { useSwipeToClose } from '@/hooks/use-swipe-to-close'
import { flattenGalleryItems, type GalleryCategories } from '@/lib/gallery'
import { toGalleryImageProps, type GalleryImageProps } from '@/lib/gallery-image'
import { store } from '@/lib/store'
import { getGalleryImageLayoutId } from '@/lib/gallery-transition'
import { useStore } from '@tanstack/react-store'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { type CSSProperties, useEffect, useMemo, useState } from 'react'

type DataAttributeFn = (path: string) => string

type GalleryModalProps = {
  galleryCategories: GalleryCategories
  title: string
  dataAttribute?: DataAttributeFn
}

export function GalleryModal({ galleryCategories, title, dataAttribute }: GalleryModalProps) {
  const photoId = useStore(store, (state) => state.photoId)
  const [transitionPhotoId, setTransitionPhotoId] = useState<string | null>(null)
  const t = useTranslations('GalleryModal')

  useEffect(() => {
    if (photoId) {
      setTransitionPhotoId(photoId)
    }
  }, [photoId])

  return (
    <GalleryDialog
      open={photoId !== null}
      onOpenChange={(open) => {
        if (!open) {
          store.setState((prev) => ({ ...prev, photoId: null }))
        }
      }}
      onOpenChangeComplete={(open) => {
        if (!open) {
          setTransitionPhotoId(null)
        }
      }}
    >
      <GalleryDialogContent
        overlayClassName="bg-transparent"
        className="bg-background text-foreground sm:bg-background/50 fixed inset-0 z-60 flex max-w-none translate-none items-center justify-center rounded-none border-0 p-0 ring-0 duration-200 sm:backdrop-blur-2xl"
      >
        <GalleryDialogTitle className="sr-only">{t('title')}</GalleryDialogTitle>
        <GalleryDialogDescription className="sr-only">
          {t('description', { title })}
        </GalleryDialogDescription>
        <GalleryModalCarousel
          galleryCategories={galleryCategories}
          activePhotoId={photoId ?? transitionPhotoId}
          dataAttribute={dataAttribute}
        />
        <GalleryModalCloseButton className="absolute top-4 left-4" />
      </GalleryDialogContent>
    </GalleryDialog>
  )
}

type GalleryModalCarouselProps = {
  galleryCategories: GalleryCategories
  activePhotoId: string | null
  dataAttribute?: DataAttributeFn
}

function GalleryModalCarousel({
  galleryCategories,
  activePhotoId,
  dataAttribute
}: GalleryModalCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const photoId = useStore(store, (state) => state.photoId)

  const slides = useMemo(
    () =>
      flattenGalleryItems(galleryCategories).flatMap(({ _key, image }) => {
        const imageProps = toGalleryImageProps(image, { size: 'full' })
        return imageProps ? [{ _key, imageProps }] : []
      }),
    [galleryCategories]
  )

  const currentAlt =
    selectedIndex != null && selectedIndex < slides.length
      ? (slides[selectedIndex]?.imageProps.alt ?? null)
      : null
  const activeLayoutPhotoId =
    selectedIndex != null ? (slides[selectedIndex]?._key ?? activePhotoId) : activePhotoId

  // Use selectedIndex as fallback to preserve position during close animation
  const startIndex = photoId
    ? Math.max(
        0,
        slides.findIndex((slide) => slide._key === photoId)
      )
    : (selectedIndex ?? 0)

  const { onTouchStart, onTouchEnd } = useSwipeToClose({
    onClose: () => store.setState((prev) => ({ ...prev, photoId: null }))
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        api?.scrollPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        api?.scrollNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [api])

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
    <Carousel className="h-screen w-screen" opts={{ startIndex: startIndex }} setApi={setApi}>
      <CarouselContent
        className="h-screen items-center"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map(({ _key, imageProps }) => (
          <CarouselItem
            key={_key}
            className="flex h-full items-center justify-center"
            data-sanity={dataAttribute?.(`galleryCategories[].items[_key=="${_key}"]`)}
          >
            <GalleryModalImageFrame
              imageKey={_key}
              imageProps={imageProps}
              isActive={activeLayoutPhotoId === _key}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {currentAlt && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-50 w-full -translate-x-1/2 pb-[calc(5rem+env(safe-area-inset-bottom,0))] text-center sm:pb-4 lg:w-fit">
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

type GalleryModalImageFrameProps = {
  imageKey: string
  imageProps: GalleryImageProps
  isActive: boolean
}

function GalleryModalImageFrame({ imageKey, imageProps, isActive }: GalleryModalImageFrameProps) {
  const { alt, height, width, ...restImageProps } = imageProps
  const ratio = Number(width) / Number(height)

  return (
    <motion.div
      layoutId={isActive ? getGalleryImageLayoutId(imageKey) : `gallery-modal-${imageKey}`}
      data-slot="gallery-modal-image-frame"
      className="relative max-h-screen max-w-screen overflow-hidden"
      style={
        {
          '--gallery-image-ratio': `${ratio}`,
          aspectRatio: 'var(--gallery-image-ratio)',
          width: 'min(100vw, calc(100vh * var(--gallery-image-ratio)))'
        } as CSSProperties
      }
      transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
    >
      <Image
        {...restImageProps}
        alt={alt}
        fill
        className="object-contain select-none"
        sizes="100vw"
      />
    </motion.div>
  )
}
