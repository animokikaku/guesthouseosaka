import { GalleryImageButton } from '@/components/gallery/gallery-image-button'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import type { FeaturedImage, GalleryImage, GalleryImages } from '@/lib/gallery'
import { ImageIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ImageProps } from 'next/image'
import { ComponentProps } from 'react'

type ImageBlockGalleryProps = {
  href: ComponentProps<typeof Link>['href']
  galleryImages: GalleryImages
  featuredImage?: FeaturedImage
}

// Transform gallery image to Next.js Image props
function toImageProps(image: GalleryImage): Omit<ImageProps, 'fill'> {
  return {
    src: image.src ?? '',
    alt: image.alt ?? '',
    width: image.width ?? 800,
    height: image.height ?? 600,
    blurDataURL: image.blurDataURL ?? undefined,
    placeholder: image.blurDataURL ? 'blur' : undefined
  }
}

// Transform featured image to Next.js Image props
function featuredToImageProps(
  image: NonNullable<FeaturedImage>
): Omit<ImageProps, 'fill'> {
  return {
    src: image.asset?.url ?? '',
    alt: image.alt ?? '',
    width: image.asset?.dimensions?.width ?? 800,
    height: image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.asset?.lqip ?? undefined,
    placeholder: image.asset?.lqip ? 'blur' : undefined
  }
}

function GalleryGrid({
  images,
  href,
  viewGalleryLabel
}: {
  images: Omit<ImageProps, 'fill'>[]
  href: ComponentProps<typeof Link>['href']
  viewGalleryLabel: string
}) {
  if (images.length < 5) return null

  return (
    <div className="hidden justify-center sm:flex">
      <div className="w-full">
        <div className="relative aspect-2/1 min-h-[300px] overflow-hidden rounded-xl lg:aspect-7/3">
          <Link href={href} className="block h-full w-full">
            <div className="grid h-full w-full grid-cols-4 grid-rows-2 gap-0.5">
              <GalleryImageButton
                className="col-span-2 row-span-2"
                sizes="(min-width: 1120px) 560px, 50vw"
                imageProps={{ ...images[0], priority: true }}
              />
              <GalleryImageButton
                className="col-span-1 col-start-3 row-start-1"
                imageProps={images[1]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageButton
                className="col-span-1 col-start-4 row-start-1"
                imageProps={images[2]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageButton
                className="col-span-1 col-start-3 row-start-2"
                imageProps={images[3]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
              <GalleryImageButton
                className="col-span-1 col-start-4 row-start-2"
                imageProps={images[4]}
                sizes="(min-width: 1120px) 280px, 25vw"
              />
            </div>
          </Link>
          <Button
            variant="secondary"
            asChild
            className="absolute right-4 bottom-4"
          >
            <Link href={href}>
              <Icons.gallery className="h-4 w-4" />
              <span>{viewGalleryLabel}</span>
            </Link>
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

  // Count total available images (featured + gallery)
  const hasFeatured = !!featuredImage?.asset?.url
  const totalCount = (hasFeatured ? 1 : 0) + (galleryImages?.length ?? 0)

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

  // Build display images: featured first (if available), then gallery images
  const processedImages = (galleryImages ?? []).map(toImageProps)
  const images = hasFeatured
    ? [featuredToImageProps(featuredImage), ...processedImages.slice(0, 4)]
    : processedImages.slice(0, 5)

  return (
    <GalleryGrid
      images={images}
      href={href}
      viewGalleryLabel={t('view_gallery')}
    />
  )
}
