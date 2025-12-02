'use client'

import type { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { getHouseStorage } from './index'
import { IMAGE_LABEL_KEYS, ImageLabelKeys, type ImageWithAlt } from './labels'
import type {
  HouseImageStorage,
  ImageCategory,
  ImageWithProps
} from './storage'

type ImagesContextValue = {
  /**
   * Get all images with alt text included
   */
  images: (
    options?: Parameters<HouseImageStorage['images']>[0]
  ) => ImageWithAlt[]
  /**
   * Get categories with alt text included in images
   */
  categories: () => { category: ImageCategory; images: ImageWithAlt[] }[]
  /**
   * Get the index of an image by its ID
   */
  indexOf: HouseImageStorage['indexOf']
}

const ImagesContext = createContext<ImagesContextValue | null>(null)

type ImagesProviderProps = {
  house: HouseIdentifier
  children: ReactNode
}

/**
 * Provider component that enables useImages() hook in client components
 */
export function ImagesProvider({ house, children }: ImagesProviderProps) {
  const t = useTranslations('images')

  const value = useMemo<ImagesContextValue>(() => {
    const storage = getHouseStorage(house)

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
  }, [house, t])

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  )
}

/**
 * Hook to access house images with alt text in client components
 * Similar to useTranslations() from next-intl
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * function MyComponent() {
 *   const images = useImages()
 *   const roomImages = images.images({ category: 'room', limit: 5 })
 *   return <div>{roomImages.map(img => <Image key={img.id} {...img} />)}</div>
 * }
 * ```
 */
export function useImages(): ImagesContextValue {
  const context = useContext(ImagesContext)
  if (!context) {
    throw new Error(
      'useImages() was called outside of an ImagesProvider. ' +
        'Make sure to wrap your component tree with <ImagesProvider>.'
    )
  }
  return context
}
