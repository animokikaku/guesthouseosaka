import { GalleryImageFrame } from '@/components/gallery/gallery-image-button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Link } from '@/i18n/navigation'
import { buildGallerySlides, type FeaturedImage, type GalleryItem } from '@/lib/gallery'
import { toGalleryImageProps, type GalleryImageProps } from '@/lib/gallery-image'
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
  viewGalleryLabel,
  extraCount,
  overflowLabel
}: {
  images: GalleryImageProps[]
  href: ComponentProps<typeof Link>['href']
  viewGalleryLabel: string
  /** Images beyond the 5 shown in the grid, surfaced as a `+N` overlay on the last tile */
  extraCount: number
  overflowLabel: string
}) {
  if (images.length < 5) return null

  return (
    <div className="hidden justify-center sm:flex">
      <div className="w-full">
        <div className="relative aspect-2/1 min-h-75 overflow-hidden rounded-xl lg:aspect-7/3">
          {/* Sole affordance now that the button is gone, so it must stay focusable + labelled.
              `group/gallery` lets the `+N` badge below react to this link's own focus state,
              since it's a plain, unfocusable span. `peer` feeds the sibling ring overlay below —
              a ring on the link itself would paint *behind* the tiles filling it edge-to-edge
              (a box's own box-shadow paints before its children). */}
          <Link
            href={href}
            aria-label={viewGalleryLabel}
            className="group/gallery peer block h-full w-full outline-none"
          >
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
              >
                {extraCount > 0 && (
                  <span
                    data-slot="gallery-image-overflow"
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50"
                    aria-hidden="true"
                  >
                    <span className="text-2xl font-bold text-white transition-colors group-focus-visible/gallery:text-primary">
                      {overflowLabel}
                    </span>
                  </span>
                )}
              </GalleryImageFrame>
            </div>
          </Link>
          {/* Single ring around the whole block on focus, rather than one per tile —
              rendered after the link so it paints on top instead of behind the tiles. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl ring-primary/50 ring-inset peer-focus-visible:ring-2"
          />
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

  const validGalleryImages = galleryImages ?? []

  const slides = buildGallerySlides({
    featuredImage,
    galleryImages: validGalleryImages
  })

  // Slides without an image asset drop out here, so convert everything before
  // picking the 5 grid tiles and the `+N` count.
  const validImages = slides.flatMap(({ image }) => {
    const imageProps = toGalleryImageProps(image, { width: 560 })
    return imageProps ? [imageProps] : []
  })

  const images = validImages.slice(0, 5)

  if (images.length < 5) {
    return (
      <div className="hidden sm:block">
        <Empty className="min-h-75 rounded-xl border border-dashed">
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

  const extraCount = validImages.length - images.length

  return (
    <GalleryGrid
      images={images}
      href={href}
      // The link's label replaces the tiles' alt text for screen readers, and the
      // `+N` overlay is decorative, so the total has to ride along in the label.
      viewGalleryLabel={
        extraCount > 0 ? t('view_gallery_count', { count: validImages.length }) : t('view_gallery')
      }
      extraCount={extraCount}
      overflowLabel={t('overflow_count', { count: extraCount })}
    />
  )
}
