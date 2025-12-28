import { GalleryModal } from '@/components/gallery/gallery-modal'
import type { Gallery } from '@/lib/gallery'
import type { HouseQueryResult } from '@/sanity.types'
import { HouseGalleryClient } from './house-gallery-client'

type HouseGalleryProps = {
  _id: NonNullable<HouseQueryResult>['_id']
  _type: NonNullable<HouseQueryResult>['_type']
  gallery: Gallery
  title: string
}

/**
 * Server component that renders gallery with pre-processed data from GROQ
 */
export function HouseGallery({ _id, _type, gallery, title }: HouseGalleryProps) {
  return (
    <>
      <HouseGalleryClient _id={_id} _type={_type} gallery={gallery} />
      <GalleryModal gallery={gallery} title={title} />
    </>
  )
}
