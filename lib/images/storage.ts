import { url } from '@/lib/utils/blob-storage'
import { ImageProps } from 'next/image'
import { z } from 'zod'

const CategoriesSchema = z.enum([
  'room',
  'common-spaces',
  'facilities',
  'building-features',
  'neighborhood',
  'floor-plan',
  'maps'
])

export type ImageCategory = z.infer<typeof CategoriesSchema>

/**
 * Image with Next.js Image props
 */
export type ImageWithProps = Omit<ImageProps, 'alt'> & {
  id: string
  src: string
  width: number
  height: number
  blurDataURL: string
  placeholder: 'blur'
}

/**
 * Image category with its associated images
 */
export type ImageCategoryGroup = {
  category: ImageCategory
  images: ImageWithProps[]
}

/**
 * Raw image data from JSON files
 */
export type RawImageData = {
  id: number
  src: string
  width: number
  height: number
  blurDataURL: string
  category: string
}

/**
 * HouseImageStorage provides organized access to images
 * Accepts raw data directly - no more filtering by house at runtime
 */
export class HouseImageStorage {
  private readonly categoryMap: Map<ImageCategory, ImageWithProps[]>
  private readonly _categories: ImageCategoryGroup[]
  private readonly _images: ImageWithProps[]
  private readonly _indexMap: Map<string, number>

  constructor(data: RawImageData[]) {
    this.categoryMap = new Map<ImageCategory, ImageWithProps[]>(
      CategoriesSchema.options.map((category) => [category, []])
    )

    for (const image of data) {
      const category = CategoriesSchema.parse(image.category)
      this.categoryMap.get(category)!.push({
        id: `${image.id}`,
        src: url(image.src),
        width: image.width,
        height: image.height,
        blurDataURL: image.blurDataURL,
        placeholder: 'blur'
      })
    }

    this._categories = []
    // Build ordered categories
    for (const category of CategoriesSchema.options) {
      const images = this.categoryMap.get(category)
      if (images && images.length > 0) {
        this._categories.push({ category, images })
      }
    }

    // Build flattened images array and index map
    this._images = this._categories.flatMap(({ images }) => images)
    this._indexMap = new Map(this._images.map((img, index) => [img.id, index]))
  }

  /**
   * Get images for this house
   *
   * @param options - Optional filters and limits
   * @param options.category - Filter by specific category. If omitted, returns all images in display order.
   * @param options.limit - Limit the number of images returned
   */
  images(options?: {
    category?: ImageCategory
    limit?: number
  }): ImageWithProps[] {
    const { category, limit } = options ?? {}

    if (category) {
      const images = this.categoryMap.get(category) ?? []
      return limit ? images.slice(0, limit) : images
    }

    return limit ? this._images.slice(0, limit) : this._images
  }

  /**
   * Get ordered categories for this house
   */
  categories(): ImageCategoryGroup[] {
    return this._categories
  }

  /**
   * Get the index of an image by its ID
   */
  indexOf(photoId: string): number {
    return this._indexMap.get(photoId) ?? 0
  }
}
