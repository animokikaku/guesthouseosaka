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
import {
  flattenGalleryItems,
  type FeaturedImage,
  type GalleryCategories,
  type GalleryItem
} from '@/lib/gallery'
import { urlFor } from '@/sanity/lib/image'
import { ImageIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { ImageProps } from 'next/image'
import { ComponentProps } from 'react'

type ImageBlockGalleryProps = {
  href: ComponentProps<typeof Link>['href']
  galleryCategories: GalleryCategories
  featuredImage?: FeaturedImage
}

type SanityImage =
  | NonNullable<GalleryItem['image']>
  | NonNullable<FeaturedImage>

// Transform Sanity image to Next.js Image props
function toImageProps(
  image: SanityImage,
  width: number
): Omit<ImageProps, 'fill'> {
  return {
    src: urlFor(image).width(width).fit('crop').dpr(2).url(),
    alt: image.alt ?? '',
    width,
    blurDataURL: image.preview ?? undefined,
    placeholder: image.preview ? 'blur' : undefined
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
                imageProps={{ ...images[0], preload: true }}
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
  galleryCategories,
  featuredImage
}: ImageBlockGalleryProps) {
  const t = await getTranslations('ImageBlockGallery')

  // Flatten gallery items from categories
  const validGalleryImages = flattenGalleryItems(galleryCategories)

  // Count total available images (featured + gallery)
  // featuredImage is null from GROQ if no asset uploaded
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

  // Build display images: featured first (if available), then gallery images
  // Request width only, let CSS object-cover handle aspect ratio
  // Safety: We've already verified totalCount >= 5 above, so arrays are safe to access
  const firstGalleryImage = validGalleryImages[0]
  const images: Omit<ImageProps, 'fill'>[] = hasFeatured
    ? [
        toImageProps(featuredImage, 560),
        ...validGalleryImages
          .slice(0, 4)
          .map(({ image }) => toImageProps(image, 560))
      ]
    : firstGalleryImage
      ? [
          toImageProps(firstGalleryImage.image, 560),
          ...validGalleryImages
            .slice(1, 5)
            .map(({ image }) => toImageProps(image, 560))
        ]
      : []

  return (
    <GalleryGrid
      images={images}
      href={href}
      viewGalleryLabel={t('view_gallery')}
    />
  )
}
