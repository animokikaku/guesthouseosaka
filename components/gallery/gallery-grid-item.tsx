'use client'

import { GalleryImageButton } from '@/components/gallery/gallery-image-button'
import { toGalleryImageProps, type GalleryItem } from '@/lib/gallery'
import { store } from '@/lib/store'

type DataAttributeFn = (path: string) => string

type GalleryGridItemProps = {
  item: GalleryItem
  categoryKey: string
  dataAttribute?: DataAttributeFn
}

export function GalleryGridItem({ item, categoryKey, dataAttribute }: GalleryGridItemProps) {
  const { _key, image } = item
  if (!image) return null

  return (
    <GalleryImageButton
      type="button"
      data-testid="gallery-grid-image"
      onClick={() => store.setState((prev) => ({ ...prev, photoId: _key }))}
      imageProps={toGalleryImageProps(image, { width: 400, height: 400 })}
      className="aspect-square rounded-lg"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 400px'
      }}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      data-sanity={dataAttribute?.(
        `galleryCategories[_key=="${categoryKey}"].items[_key=="${_key}"]`
      )}
    />
  )
}
