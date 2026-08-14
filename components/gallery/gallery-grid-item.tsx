'use client'

import { Lightbox } from '@/components/lightbox'
import type { GalleryItem } from '@/lib/gallery'
import { toGalleryImageProps } from '@/lib/gallery-image'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type DataAttributeFn = (path: string) => string

type GalleryGridItemProps = {
  item: GalleryItem
  categoryKey: string
  dataAttribute?: DataAttributeFn
  /** Index of this item in the flattened Lightbox.Gallery items array */
  index: number | undefined
}

export function GalleryGridItem({ item, categoryKey, dataAttribute, index }: GalleryGridItemProps) {
  const t = useTranslations('GalleryGridItem')
  const { _key, image } = item
  if (!image || index === undefined) return null

  const imageProps = toGalleryImageProps(image, {
    width: 800,
    fit: 'max',
    responsive: true
  })
  if (!imageProps) return null

  const { alt, width: _width, height: _height, ...restImageProps } = imageProps

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
          <Image
            ref={imageRef}
            fill
            alt={alt}
            // Mirrors the full-bleed column counts in `CategoryGrid`. Tailwind
            // breakpoints are min-width, so each stop sits 1px below them.
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1535px) 20vw, 17vw"
            className="object-cover transition-opacity duration-300 group-focus-visible:opacity-90 pointer-fine:group-hover:opacity-90"
            {...restImageProps}
          />
          {alt && (
            <div
              data-slot="gallery-image-caption"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-end bg-linear-to-t from-black/70 to-transparent p-3 opacity-0 transition-[opacity,transform] duration-300 ease-out group-focus-visible:translate-y-0 group-focus-visible:opacity-100 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
              aria-hidden="true"
            >
              <span className="text-sm font-medium text-white">{alt}</span>
            </div>
          )}
        </>
      )}
    </Lightbox.Trigger>
  )
}
