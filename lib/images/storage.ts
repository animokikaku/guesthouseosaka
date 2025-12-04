import { url } from '@/lib/utils/blob-storage'
import { ImageProps } from 'next/image'
import { z } from 'zod'

export const CategoriesValues = [
  'room',
  'common-spaces',
  'facilities',
  'building-features',
  'neighborhood',
  'floor-plan',
  'maps'
] as const

const CategoriesSchema = z.enum(CategoriesValues)

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
  private readonly _images: ImageWithProps[]
  private readonly _indexMap: Map<string, number>

  constructor(data: RawImageData[]) {
    this.categoryMap = new Map<ImageCategory, ImageWithProps[]>(
      CategoriesValues.map((category) => [category, []])
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

    // Build flattened images array and index map
    this._images = Array.from(this.categoryMap.values()).flat()
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
   * Get the number of images in a category
   * @param options - Optional filters
   * @param options.category - Filter by specific category. If omitted, returns the total number of images.
   */
  count(options?: { category?: ImageCategory }): number {
    const { category } = options ?? {}
    if (category) {
      return this.categoryMap.get(category)?.length ?? 0
    }
    return this._images.length
  }

  /**
   * Get the index of an image by its ID
   */
  indexOf(photoId: string): number {
    return this._indexMap.get(photoId) ?? 0
  }
}
