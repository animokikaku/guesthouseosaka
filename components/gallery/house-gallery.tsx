import { GalleryModal } from '@/components/gallery/gallery-modal'
import { HouseGalleryClient } from './house-gallery-client'
/**
 * Server component that fetches gallery data at build time
 * The data is statically generated since getHouseImageStorage reads from JSON files
 */
export function HouseGallery() {
  return (
    <>
      <HouseGalleryClient />
      <GalleryModal />
    </>
  )
}
