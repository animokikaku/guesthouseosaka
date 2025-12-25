'use client'

import type { HouseQueryResult } from '@/sanity.types'
import type { ImageProps } from 'next/image'
import { createContext, ReactNode, useContext, useMemo } from 'react'

// Gallery by category from Sanity (pre-grouped server-side)
type SanityGalleryByCategory = NonNullable<HouseQueryResult>['galleryByCategory']

// Featured image from Sanity (same structure as localizedImage in query)
type SanityFeaturedImage = NonNullable<HouseQueryResult>['featuredImage']

// Image with Next.js Image props for display
export type GalleryImageWithProps = Omit<ImageProps, 'fill'> & {
  id: string
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
  placeholder?: 'blur'
  category: {
    key: string
    label: string | null
    order: number
  }
}

type GalleryContextValue = {
  /**
   * Get the number of images in a category
   */
  count: (options?: { category?: string }) => number
  /**
   * Get all images with optional category filter and limit
   */
  images: (options?: { category?: string; limit?: number }) => GalleryImageWithProps[]
  /**
   * Get the index of an image by its ID
   */
  indexOf: (photoId: string) => number
  /**
   * Get unique category keys in display order
   */
  categories: () => string[]
  /**
   * Get category label by key
   */
  categoryLabel: (key: string) => string | null
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

type SanityGalleryProviderProps = {
  galleryByCategory: SanityGalleryByCategory
  featuredImage?: SanityFeaturedImage
  children: ReactNode
}

type CategoryGroup = SanityGalleryByCategory[number]
type CategoryImage = NonNullable<CategoryGroup['images']>[number]

function toImageProps(
  image: CategoryImage,
  category: CategoryGroup['category']
): GalleryImageWithProps {
  return {
    id: image._key,
    src: image.image.asset?.url ?? '',
    alt: image.image.alt ?? '',
    width: image.image.asset?.dimensions?.width ?? 800,
    height: image.image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.image.asset?.lqip ?? undefined,
    placeholder: image.image.asset?.lqip ? 'blur' : undefined,
    category
  }
}

function featuredToImageProps(
  image: NonNullable<SanityFeaturedImage>
): GalleryImageWithProps {
  return {
    id: 'featured',
    src: image.asset?.url ?? '',
    alt: image.alt ?? '',
    width: image.asset?.dimensions?.width ?? 800,
    height: image.asset?.dimensions?.height ?? 600,
    blurDataURL: image.asset?.lqip ?? undefined,
    placeholder: image.asset?.lqip ? 'blur' : undefined,
    category: { key: 'featured', label: null, order: -1 }
  }
}

/**
 * Provider component that enables useGallery() hook with Sanity gallery data
 * Accepts pre-grouped gallery data from server-side GROQ query
 */
export function SanityGalleryProvider({
  galleryByCategory,
  featuredImage,
  children
}: SanityGalleryProviderProps) {
  const value = useMemo<GalleryContextValue>(() => {
    // Build category map and flatten images (data already grouped server-side)
    const categoryMap = new Map<string, GalleryImageWithProps[]>()
    const categoryLabelMap = new Map<string, string | null>()
    const allImages: GalleryImageWithProps[] = []

    // Prepend featured image if available
    if (featuredImage?.asset?.url) {
      const featured = featuredToImageProps(featuredImage)
      allImages.push(featured)
      categoryMap.set('featured', [featured])
      categoryLabelMap.set('featured', null)
    }

    // Process pre-grouped categories (already sorted by order from GROQ)
    for (const group of galleryByCategory) {
      const { category, images } = group
      if (!images) continue

      const categoryImages = images.map((img) => toImageProps(img, category))
      categoryMap.set(category.key, categoryImages)
      categoryLabelMap.set(category.key, category.label)
      allImages.push(...categoryImages)
    }

    const indexMap = new Map(allImages.map((img, idx) => [img.id, idx]))
    const categoryKeys = Array.from(categoryMap.keys())

    return {
      images: (options) => {
        const { category, limit } = options ?? {}

        if (category) {
          const images = categoryMap.get(category) ?? []
          return limit ? images.slice(0, limit) : images
        }

        return limit ? allImages.slice(0, limit) : allImages
      },
      count: (options) => {
        const { category } = options ?? {}
        if (category) {
          return categoryMap.get(category)?.length ?? 0
        }
        return allImages.length
      },
      indexOf: (photoId) => indexMap.get(photoId) ?? 0,
      categories: () => categoryKeys,
      categoryLabel: (key) => categoryLabelMap.get(key) ?? null
    }
  }, [galleryByCategory, featuredImage])

  return (
    <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
  )
}

/**
 * Hook to access Sanity gallery images in client components
 *
 * @example
 * ```tsx
 * 'use client'
 *
 * function MyComponent() {
 *   const gallery = useGallery()
 *   const roomImages = gallery.images({ category: 'room', limit: 5 })
 *   return <div>{roomImages.map(img => <Image key={img.id} {...img} />)}</div>
 * }
 * ```
 */
export function useGallery(): GalleryContextValue {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error(
      'useGallery() was called outside of a SanityGalleryProvider. ' +
        'Make sure to wrap your component tree with <SanityGalleryProvider>.'
    )
  }
  return context
}
