import { GalleryImageButton } from '@/components/gallery/gallery-image-button'
import type { GalleryItem } from '@/lib/gallery'
import { store } from '@/lib/store'
import { urlFor } from '@/sanity/lib/image'
import { stegaClean } from '@sanity/client/stega'

type DataAttributeFn = (path: string) => string

type GalleryGridItemProps = {
  item: GalleryItem
  categoryKey: string
  dataAttribute?: DataAttributeFn
}

export function GalleryGridItem({
  item,
  categoryKey,
  dataAttribute
}: GalleryGridItemProps) {
  const { _key, image } = item
  if (!image) return null

  const src = urlFor(image).width(400).height(400).dpr(2).fit('crop').url()

  return (
    <GalleryImageButton
      role="button"
      tabIndex={0}
      onClick={() => store.setState({ photoId: _key })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          store.setState({ photoId: _key })
        }
      }}
      imageProps={{
        src,
        alt: stegaClean(image.alt) ?? '',
        width: 400,
        height: 400,
        blurDataURL: image.preview ?? undefined,
        placeholder: image.preview ? 'blur' : undefined
      }}
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
