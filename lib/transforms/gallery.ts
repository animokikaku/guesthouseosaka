import type { GalleryImage } from '@/lib/types/components'
import type { HomePageQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type GalleryWallImages = NonNullable<NonNullable<HomePageQueryResult>['page']>['galleryWall']

// ============================================
// Gallery Layout Configuration
// ============================================

/**
 * Fixed layout positions for the 6 gallery images
 * Each layout defines the size and position for responsive percentage-based rendering
 */
const GALLERY_LAYOUTS = [
  { width: 142, height: 142 },
  { width: 272, height: 272 },
  { width: 123, height: 123 },
  { width: 168, height: 168 },
  { width: 129, height: 129 },
  { width: 194, height: 194 }
] as const

// ============================================
// Gallery Transformer
// ============================================

/**
 * Transforms Sanity gallery wall images to GalleryImage array
 * Pre-builds all image URLs using urlFor() to decouple components from Sanity helpers
 *
 * @param images - Raw gallery wall images from Sanity query
 * @returns Array of GalleryImage with pre-built URLs
 */
export function toGalleryImages(images: GalleryWallImages): GalleryImage[] {
  return images.slice(0, GALLERY_LAYOUTS.length).map((img, index) => {
    const layout = GALLERY_LAYOUTS[index]

    return {
      _key: img._key,
      src: urlFor(img)
        .width(layout.width)
        .height(layout.height)
        .dpr(2)
        .fit('crop')
        .url(),
      alt: img.alt,
      blurDataURL: img.preview,
      width: layout.width,
      height: layout.height
    }
  })
}
