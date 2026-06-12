import { GalleryImageFrame } from '@/components/gallery/gallery-image-button'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import {
  buildGallerySlides,
  toGalleryImageProps,
  type FeaturedImage,
  type GalleryImageProps,
  type GalleryItem
} from '@/lib/gallery'
import { ImageIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { ComponentProps } from 'react'

type GalleryImages = GalleryItem[] | null

type ImageBlockGalleryProps = {
  href: ComponentProps<typeof Link>['href']
  galleryImages: GalleryImages
  featuredImage?: FeaturedImage
}

function GalleryGrid({
  images,
  href,
  viewGalleryLabel
}: {
  images: GalleryImageProps[]
  href: ComponentProps<typeof Link>['href']
  viewGalleryLabel: string
}) {
  if (images.length < 5) return null

  return (
    <div className="hidden justify-center sm:flex">
      <div className="w-full">
        <div className="relative aspect-2/1 min-h-[300px] overflow-hidden rounded-xl lg:aspect-7/3">
          <Link href={href} tabIndex={-1} className="block h-full w-full">
            <div className="grid h-full w-full grid-cols-4 grid-rows-2 gap-0.5">
              <GalleryImageFrame
                className="col-span-2 row-span-2"
                sizes="(min-width: 1120px) 560px, 50vw"
                imageProps={{ ...images[0], priority: true }}
              />
              <GalleryImageFrame
                className="col-span-1 col-start-3 row-start-1"
                imageProps={images[1]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageFrame
                className="col-span-1 col-start-4 row-start-1"
                imageProps={images[2]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageFrame
                className="col-span-1 col-start-3 row-start-2"
                imageProps={images[3]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageFrame
                className="col-span-1 col-start-4 row-start-2"
                imageProps={images[4]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
            </div>
          </Link>
          <Button
            variant="secondary"
            render={<Link href={href} />}
            nativeButton={false}
            className="absolute right-4 bottom-4"
          >
            <Icons.gallery className="size-4" />
            <span>{viewGalleryLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export async function ImageBlockGallery({
  href,
  galleryImages,
  featuredImage
}: ImageBlockGalleryProps) {
  const t = await getTranslations('ImageBlockGallery')

  // Use pre-flattened gallery images from GROQ query
  const validGalleryImages = galleryImages ?? []

  // Count total available images (featured + gallery)
  const hasFeatured = !!featuredImage
  const totalCount = (hasFeatured ? 1 : 0) + validGalleryImages.length

  if (totalCount < 5) {
    return (
      <div className="hidden sm:block">
        <Empty className="min-h-[300px] rounded-xl border border-dashed">
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

  const images = buildGallerySlides({
    featuredImage,
    galleryImages: validGalleryImages,
    limit: 5
  }).map(({ image }) => toGalleryImageProps(image, { width: 560 }))

  return <GalleryGrid images={images} href={href} viewGalleryLabel={t('view_gallery')} />
}
