import type { GalleryCategories, GalleryCategory } from '@/lib/gallery'
import { GALLERY_WALL_SLOTS, slotPixelSize } from '@/lib/gallery-wall'
import type { GalleryImage } from '@/lib/types/components'
import type { HomePageQueryResult } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'

// ============================================
// Input Types (from Sanity query results)
// ============================================

type GalleryWallImages = NonNullable<NonNullable<HomePageQueryResult>['page']>['galleryWall']

// ============================================
// Gallery Transformer
// ============================================

/**
 * Transforms Sanity gallery wall images to GalleryImage array
 * Pre-builds all image URLs using urlFor() to decouple components from Sanity helpers
 *
 * Crop sizes come from GALLERY_WALL_SLOTS, the same config GalleryWall lays the
 * collage out from, so a tile can't be cropped to one size and rendered at
 * another.
 *
 * @param images - Raw gallery wall images from Sanity query
 * @returns Array of GalleryImage with pre-built URLs
 */
export function toGalleryImages(images: GalleryWallImages): GalleryImage[] {
  // Query already limits to 6 images via galleryWall[0...6]
  return images.flatMap((img, index) => {
    const slot = GALLERY_WALL_SLOTS[index]
    if (!slot) return []

    // Tiles are square, and dpr(2) covers retina at the collage's display size.
    const size = slotPixelSize(slot)

    return [
      {
        _key: img._key,
        src: urlFor(img).width(size).height(size).dpr(2).fit('crop').url(),
        alt: img.alt,
        blurDataURL: img.preview,
        width: size,
        height: size,
        priority: slot.priority ?? false
      }
    ]
  })
}

// Transform pre-grouped data to frontend display format with computed fields
// Note: Data is pre-sorted and filtered (empty categories excluded) in GROQ query
export function toGalleryCategories(data: GalleryCategories | null): GalleryCategory[] {
  if (!data) return []
  return data.map((cat) => ({
    _key: cat._key,
    _id: cat.category._id,
    label: cat.category.label,
    thumbnail: cat.items?.[0]?.image ?? null,
    items: cat.items ?? []
  }))
}
