import type { HouseQueryResult } from '@/sanity.types'

// Types from Sanity query result - flat gallery array with category info
export type Gallery = NonNullable<HouseQueryResult>['gallery']
export type GalleryItem = NonNullable<Gallery>[number]
export type FeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Minimal type for components that only need _key and image (e.g., MobileHeroImage carousel)
export type GalleryImage = Pick<GalleryItem, '_key' | 'image'>

// Grouped category type for frontend display
export interface GalleryCategory {
  _id: string
  key: string
  label: string | null
  order: number | null
  count: number
  thumbnail: GalleryItem['image'] | null
  items: GalleryItem[]
}

// Transform featured image to match GalleryImage shape (for MobileHeroImage)
export function featuredToGalleryImage(
  image: NonNullable<FeaturedImage>
): GalleryImage {
  return {
    _key: 'featured',
    image
  }
}

// Get index of image by key
export function getImageIndex(
  images: GalleryItem[],
  photoKey: string
): number {
  const index = images.findIndex((img) => img._key === photoKey)
  return index >= 0 ? index : 0
}

// Group gallery items by category (for frontend display)
export function groupByCategory(gallery: Gallery | null): GalleryCategory[] {
  if (!gallery) return []

  const categoryMap = new Map<string, GalleryCategory>()

  for (const item of gallery) {
    if (!item.category) continue
    const key = item.category.key

    if (!categoryMap.has(key)) {
      categoryMap.set(key, {
        _id: item.category._id ?? '',
        key,
        label: item.category.label,
        order: item.category.order,
        count: 0,
        thumbnail: null,
        items: []
      })
    }

    const category = categoryMap.get(key)!
    category.items.push(item)
    category.count++

    // First item becomes thumbnail
    if (!category.thumbnail) {
      category.thumbnail = item.image
    }
  }

  return [...categoryMap.values()].sort(
    (a, b) => (a.order ?? 999) - (b.order ?? 999)
  )
}
