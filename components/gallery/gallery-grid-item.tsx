import { GalleryImageCaption } from '@/components/gallery/gallery-image-frame'
import { Lightbox } from '@/components/ui/lightbox'
import { SanityImage } from '@/components/sanity-image'
import type { GalleryItem } from '@/lib/gallery'
import { toGalleryImageProps } from '@/lib/gallery-image'
import { useTranslations } from 'use-intl'
import type { DataAttributeFn } from '@/lib/types/stega'

type GalleryGridItemProps = {
  item: GalleryItem
  categoryKey: string
  dataAttribute?: DataAttributeFn
  /** Index of this item in the flattened LightboxGallery items array */
  index: number | undefined
}

export function GalleryGridItem({ item, categoryKey, dataAttribute, index }: GalleryGridItemProps) {
  const t = useTranslations('GalleryGridItem')
  const { _key, image } = item
  if (!image || index === undefined) return null

  const imageProps = toGalleryImageProps(image, { fit: 'max' })
  if (!imageProps) return null

  const { alt, ...restImageProps } = imageProps

  return (
    <Lightbox.Trigger
      index={index}
      aria-label={alt || t('open_image')}
      data-testid="gallery-grid-image"
      // `scroll-my-*` pads the lightbox trigger scroll sync (see Lightbox.Root)
      className="group bg-muted/40 relative aspect-square scroll-my-6 overflow-hidden"
      // Tiles are square but their width tracks the column count, so no fixed
      // placeholder height is right at every breakpoint. `auto` reuses the real
      // size once a tile has rendered; 400px only covers the first pass.
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 400px'
      }}
      data-sanity={dataAttribute?.(
        `galleryCategories[_key=="${categoryKey}"].items[_key=="${_key}"]`
      )}
    >
      {({ imageRef }) => (
        <>
          <SanityImage
            ref={imageRef}
            fill
            alt={alt}
            // Mirrors the full-bleed column counts in `CategoryGrid`. Tailwind
            // breakpoints are min-width, so each stop sits 1px below them.
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1535px) 20vw, 17vw"
            className="object-cover transition-opacity duration-300 group-focus-visible:opacity-90 pointer-fine:group-hover:opacity-90"
            {...restImageProps}
          />
          <GalleryImageCaption alt={alt} />
          {/*
            `Lightbox.Trigger`'s own focus ring is a box-shadow on the button
            itself, which paints *behind* this full-bleed `<Image>` (a box's
            own box-shadow paints before its children) — so it's invisible
            here. This overlay renders last instead, on top of the image.
          */}
          <span
            aria-hidden="true"
            className="ring-ring/50 pointer-events-none absolute inset-0 ring-inset group-focus-visible:ring-2"
          />
        </>
      )}
    </Lightbox.Trigger>
  )
}
