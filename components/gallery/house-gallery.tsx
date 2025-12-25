import { GalleryModal } from '@/components/gallery/gallery-modal'
import type { GalleryCategories, GalleryImages } from '@/lib/gallery'
import { HouseGalleryClient } from './house-gallery-client'

type HouseGalleryProps = {
  categories: GalleryCategories
  images: GalleryImages
}

/**
 * Server component that renders gallery with pre-processed data from GROQ
 */
export function HouseGallery({ categories, images }: HouseGalleryProps) {
  return (
    <>
      <HouseGalleryClient categories={categories} />
      <GalleryModal images={images} />
    </>
  )
}
