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
import { HouseIdentifier } from '@/lib/types'
import type { HouseQueryResult } from '@/sanity.types'
import { ImageIcon } from 'lucide-react'
import type { ImageProps } from 'next/image'
import { getTranslations } from 'next-intl/server'

type SanityGalleryImage = NonNullable<
  NonNullable<HouseQueryResult>['gallery']
>[number]

type SanityFeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

type ImageBlockGalleryProps = {
  id: HouseIdentifier
  gallery: NonNullable<HouseQueryResult>['gallery']
  featuredImage?: SanityFeaturedImage
}

type GalleryHref = {
  pathname: '/[house]/gallery'
  params: { house: HouseIdentifier }
}

// Transform Sanity gallery image to Next.js Image props
function toImageProps(image: SanityGalleryImage): Omit<ImageProps, 'fill'> {
  return {
    src: image.image.asset?.url ?? '',
    alt: image.image.alt ?? '',
    width: image.image.asset?.dimensions?.width ?? 800,
    height: image.image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.image.asset?.lqip ?? undefined,
    placeholder: image.image.asset?.lqip ? 'blur' : undefined
  }
}

// Transform featured image to Next.js Image props
function featuredToImageProps(
  image: NonNullable<SanityFeaturedImage>
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
  galleryHref,
  viewGalleryLabel
}: {
  images: Omit<ImageProps, 'fill'>[]
  galleryHref: GalleryHref
  viewGalleryLabel: string
}) {
  if (images.length < 5) return null

  return (
    <div className="hidden justify-center sm:flex">
      <div className="w-full">
        <div className="relative aspect-2/1 min-h-[300px] overflow-hidden rounded-xl lg:aspect-7/3">
          <Link href={galleryHref} className="block h-full w-full">
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
            <Link href={galleryHref}>
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
  id,
  gallery,
  featuredImage
}: ImageBlockGalleryProps) {
  const t = await getTranslations('ImageBlockGallery')
  const galleryHref: GalleryHref = {
    pathname: '/[house]/gallery',
    params: { house: id }
  }

  // Count total available images (featured + gallery)
  const hasFeatured = !!featuredImage?.asset?.url
  const galleryCount = gallery?.length ?? 0
  const totalCount = (hasFeatured ? 1 : 0) + galleryCount

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
  const galleryImages = (gallery ?? []).map(toImageProps)
  const images = hasFeatured
    ? [featuredToImageProps(featuredImage), ...galleryImages.slice(0, 4)]
    : galleryImages.slice(0, 5)

  return (
    <GalleryGrid
      images={images}
      galleryHref={galleryHref}
      viewGalleryLabel={t('view_gallery')}
    />
  )
}
