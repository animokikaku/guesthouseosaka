import { GalleryModal } from '@/components/gallery/gallery-modal'
import {
  flattenGalleryImages,
  GalleryByCategory,
  GalleryImage,
  processGalleryByCategory
} from '@/lib/gallery'
import { HouseGalleryClient } from './house-gallery-client'

type HouseGalleryProps = {
  galleryByCategory: GalleryByCategory
}

/**
 * Server component that processes gallery data at build time
 */
export function HouseGallery({ galleryByCategory }: HouseGalleryProps) {
  const categories = processGalleryByCategory(galleryByCategory)
  const allImages: GalleryImage[] = flattenGalleryImages(galleryByCategory)

  return (
    <>
      <HouseGalleryClient categories={categories} />
      <GalleryModal images={allImages} />
    </>
  )
}
