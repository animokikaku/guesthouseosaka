'use client'

import { GalleryImageButton } from '@/components/gallery/gallery-image-button'
import type { GalleryItem } from '@/lib/gallery'
import { toGalleryImageProps } from '@/lib/gallery-image'
import { store } from '@/lib/store'
import { useTranslations } from 'next-intl'

type DataAttributeFn = (path: string) => string

type GalleryGridItemProps = {
  item: GalleryItem
  categoryKey: string
  dataAttribute?: DataAttributeFn
}

export function GalleryGridItem({ item, categoryKey, dataAttribute }: GalleryGridItemProps) {
  const t = useTranslations('GalleryImageButton')
  const { _key, image } = item
  if (!image) return null

  const imageProps = toGalleryImageProps(image, { width: 400, height: 400, responsive: true })
  if (!imageProps) return null

  return (
    <GalleryImageButton
      type="button"
      aria-label={imageProps.alt || t('open_image')}
      data-testid="gallery-grid-image"
      onClick={() => store.setState((prev) => ({ ...prev, photoId: _key }))}
      imageProps={imageProps}
      className="bg-muted/40 relative aspect-square overflow-hidden"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 400px'
      }}
      // Mirrors the full-bleed column counts in `CategoryGrid`. Tailwind
      // breakpoints are min-width, so each stop sits 1px below them.
      sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1535px) 20vw, 17vw"
      data-sanity={dataAttribute?.(
        `galleryCategories[_key=="${categoryKey}"].items[_key=="${_key}"]`
      )}
    />
  )
}
