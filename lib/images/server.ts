import 'server-only'

import type { HouseIdentifier } from '@/lib/types'
import { getTranslations } from 'next-intl/server'
import { cache } from 'react'
import { getHouseStorage } from './index'
import { IMAGE_LABEL_KEYS, ImageLabelKeys, type ImageWithAlt } from './labels'
import type { HouseImageStorage, ImageWithProps } from './storage'

type ImagesAPI = {
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
 * Get the image label/alt text for a specific image ID (server-side)
 * Can be used outside of house context (e.g., homepage gallery wall)
 *
 * @example
 * ```tsx
 * // In a server component
 * const getLabel = await getImageLabel()
 * const alt = getLabel(imageId)
 * ```
 */
export async function getImageLabel(): Promise<
  (id: string | number) => string
> {
  const t = await getTranslations('images')

  return (id: string | number): string => {
    const key = IMAGE_LABEL_KEYS[id as ImageLabelKeys]
    return key ? t(key) : ''
  }
}

/**
 * Get the images API for a specific house
 *
 * @param house - The house identifier
 * @example
 * ```tsx
 * // In a server component
 * const images = await getImages(house)
 * const roomImages = images.images({ category: 'room', limit: 5 })
 * ```
 */
export async function getImages(house: HouseIdentifier): Promise<ImagesAPI> {
  const storage = getHouseStorage(house)
  const t = await getTranslations('images')

  const getAlt = (id: string | number): string => {
    const key = IMAGE_LABEL_KEYS[id as ImageLabelKeys]
    return key ? t(key) : ''
  }

  const withAlt = (image: ImageWithProps): ImageWithAlt => ({
    ...image,
    alt: getAlt(image.id)
  })

  return {
    images: (options) => storage.images(options).map(withAlt),
    categories: () =>
      storage.categories().map(({ category, images }) => ({
        category,
        images: images.map(withAlt)
      })),
    indexOf: storage.indexOf.bind(storage)
  }
}
