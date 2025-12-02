import 'server-only'

import type { HouseIdentifier } from '@/lib/types'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'
import { getHouseStorage } from './index'
import { IMAGE_LABEL_KEYS, type ImageWithAlt } from './labels'
import type { HouseImageStorage, ImageWithProps } from './storage'

type ImagesAPI = {
  /**
   * The house identifier
   */
  house: HouseIdentifier
  /**
   * The raw storage instance (for advanced use cases)
   */
  storage: HouseImageStorage
  /**
   * Get the alt text for an image by its ID
   */
  getAlt: (id: string | number) => string
  /**
   * Get all images with alt text included
   */
  images: (
    options?: Parameters<HouseImageStorage['images']>[0]
  ) => ImageWithAlt[]
  /**
   * Get categories with alt text included in images
   */
  categories: () => { category: string; images: ImageWithAlt[] }[]
  /**
   * Get the index of an image by its ID
   */
  indexOf: HouseImageStorage['indexOf']
  /**
   * Get a specific image by category and index with alt text included
   */
  image: {
    (
      options: Parameters<HouseImageStorage['image']>[0] & { index: number }
    ): ImageWithAlt
    (
      options: Parameters<HouseImageStorage['image']>[0] & { index: number[] }
    ): ImageWithAlt[]
  }
}

// Cache the request house identifier
const getRequestHouse = cache((): { house: HouseIdentifier | null } => ({
  house: null
}))

/**
 * Set the house identifier for the current request (call this in layout)
 * @param house - The house identifier
 */
export function setRequestHouse(house: HouseIdentifier): void {
  getRequestHouse().house = house
}

/**
 * Get the images API for server components
 * Similar to getTranslations() from next-intl
 *
 * @example
 * ```tsx
 * // In a server component
 * const images = await getImages()
 * const roomImages = images.images({ category: 'room', limit: 5 })
 * ```
 */
export async function getImages(): Promise<ImagesAPI> {
  const { house } = getRequestHouse()

  if (!house) {
    throw new Error(
      'getImages() was called without setting a house. ' +
        'Make sure to call setRequestHouse() in your layout before using getImages().'
    )
  }

  const storage = getHouseStorage(house)
  const t = await getTranslations('useImageLabels')

  const getAlt = (id: string | number): string => {
    const key = IMAGE_LABEL_KEYS[id]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return key ? t(key as any) : ''
  }

  const withAlt = (image: ImageWithProps): ImageWithAlt => ({
    ...image,
    alt: getAlt(image.id)
  })

  return {
    house,
    storage,
    getAlt,
    images: (options) => storage.images(options).map(withAlt),
    categories: () =>
      storage.categories().map(({ category, images }) => ({
        category,
        images: images.map(withAlt)
      })),
    indexOf: storage.indexOf.bind(storage),
    image: ((options: { category: string; index: number | number[] }) => {
      const result = storage.image(
        options as Parameters<HouseImageStorage['image']>[0]
      )
      if (Array.isArray(result)) {
        return result.map(withAlt)
      }
      return withAlt(result)
    }) as ImagesAPI['image']
  }
}
