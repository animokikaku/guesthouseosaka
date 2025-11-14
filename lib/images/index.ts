import { routing } from '@/i18n/routing'
import { HouseIdentifier } from '@/lib/types'
import { Locale } from 'next-intl'
import { ImageProps } from 'next/image'
import { imageData } from './data'

/**
 * Fixed order of image categories as they should appear in the gallery
 * These are normalized names matching folder structure (kebab-case/lowercase)
 * Display formatting will be handled by localization
 */
const IMAGE_CATEGORY_ORDER = [
  'room',
  'common-spaces',
  'facilities',
  'building-features',
  'neighborhood',
  'floor-plan',
  'maps'
] as const

type ImageCategory = (typeof IMAGE_CATEGORY_ORDER)[number]

/**
 * Unified image data structure
 */
export interface ImageData {
  id: string
  src: string
  width: number
  height: number
  blurDataURL: string
  house: HouseIdentifier
  category: ImageCategory
  alt?: string | { en: string; ja: string; fr: string } | null
}

/**
 * Image with Next.js Image props
 */
export type ImageWithProps = ImageProps & {
  id: string
  src: string
  width: number
  height: number
  blurDataURL: string
  placeholder: 'blur'
  alt: string
}

/**
 * Image category with its associated images
 */
export type ImageCategoryGroup = {
  category: ImageCategory
  images: ImageWithProps[]
}

/**
 * All images in a single array
 */
const images = imageData.map((img) => ({
  ...img,
  id: String(img.id),
  house: img.house as HouseIdentifier,
  category: img.category as ImageCategory
}))

/**
 * Convert ImageData to ImageWithProps
 */
function toImageProps(image: ImageData, locale: Locale = 'en'): ImageWithProps {
  let altText = ''

  if (typeof image.alt === 'string') {
    altText = image.alt
  } else if (image.alt && typeof image.alt === 'object') {
    altText = image.alt[locale as keyof typeof image.alt] || image.alt.en || ''
  }

  return {
    id: image.id,
    src: image.src,
    width: image.width,
    height: image.height,
    blurDataURL: image.blurDataURL,
    placeholder: 'blur',
    alt: altText
  }
}

/**
 * HouseImageStorage provides organized access to images for a specific house
 */
export class HouseImageStorage {
  private readonly categoryMap: Map<ImageCategory, ImageWithProps[]>
  private readonly _categories: ImageCategoryGroup[]
  private readonly _images: ImageWithProps[]
  private readonly _indexMap: Map<string, number>

  constructor(house: HouseIdentifier, locale: Locale = routing.defaultLocale) {
    this.categoryMap = new Map()

    // Build category map
    images
      .filter((img) => img.house === house)
      .forEach((image) => {
        const category = image.category
        if (!this.categoryMap.has(category)) {
          this.categoryMap.set(category, [])
        }
        this.categoryMap.get(category)!.push(toImageProps(image, locale))
      })

    // Build ordered categories
    this._categories = IMAGE_CATEGORY_ORDER.map((category) => {
      const images = this.categoryMap.get(category) ?? []
      return { category, images }
    }).filter(({ images }) => images.length > 0)

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

  /**
   * Get a specific image by category and index
   * @param options - Category and index
   * @param options.category - The image category
   * @param options.index - The index within the category (0-based)
   * @throws Error if the image is not found
   */
  image(options: { category: ImageCategory; index: number }): ImageWithProps
  /**
   * Get multiple images by category and indexes
   * @param options - Category and indexes
   * @param options.category - The image category
   * @param options.index - Array of indexes within the category (0-based)
   * @throws Error if any image is not found
   */
  image(options: { category: ImageCategory; index: number[] }): ImageWithProps[]
  image(options: {
    category: ImageCategory
    index: number | number[]
  }): ImageWithProps | ImageWithProps[] {
    const { category, index } = options
    const categoryImages = this.categoryMap.get(category) ?? []

    if (Array.isArray(index)) {
      const images = index.map((idx) => {
        const image = categoryImages[idx]
        if (!image) {
          throw new Error(
            `Image at index ${idx} in category "${category}" not found in house storage`
          )
        }
        return image
      })
      return images
    }

    const image = categoryImages[index]
    if (!image) {
      throw new Error(
        `Image at index ${index} in category "${category}" not found in house storage`
      )
    }
    return image
  }
}

/**
 * Registry to cache house storage instances
 */
const houseStorageRegistry = new Map<
  HouseIdentifier,
  Map<Locale, HouseImageStorage>
>()

/**
 * Get or create a HouseImageStorage instance for a specific house
 *
 * SSR-compatible: The image data is imported statically at build time,
 * and filtering happens synchronously in the constructor.
 */
export function storage({
  house,
  locale = routing.defaultLocale
}: {
  house: HouseIdentifier
  locale?: Locale
}): HouseImageStorage {
  let localeMap = houseStorageRegistry.get(house)
  if (!localeMap) {
    localeMap = new Map()
    houseStorageRegistry.set(house, localeMap)
  }

  let storage = localeMap.get(locale)
  if (!storage) {
    storage = new HouseImageStorage(house, locale)
    localeMap.set(locale, storage)
  }

  return storage
}

export type { ImageCategory }
