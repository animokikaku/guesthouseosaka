// @vitest-environment node

import {
  createFeaturedImage,
  createGalleryCategory,
  createGalleryItem
} from '@/lib/transforms/__tests__/mocks'
import { buildGallerySlides, flattenGalleryItems } from '../gallery'
import { toGalleryCategories } from '../transforms/gallery'

describe('buildGallerySlides', () => {
  const gallery = [createGalleryItem({ _key: 'a' }), createGalleryItem({ _key: 'b' })]

  it('leads with the featured image, then the gallery', () => {
    const featuredImage = createFeaturedImage()

    expect(buildGallerySlides({ featuredImage, galleryImages: gallery })).toEqual([
      { _key: 'featured', image: featuredImage },
      ...gallery
    ])
  })

  it('has only the gallery without a featured image', () => {
    expect(buildGallerySlides({ featuredImage: null, galleryImages: gallery })).toEqual(gallery)
  })

  it('handles a house with no gallery', () => {
    expect(buildGallerySlides({ featuredImage: null, galleryImages: null })).toEqual([])
  })
})

describe('flattenGalleryItems', () => {
  it('keeps the category order, then each category’s item order', () => {
    const categories = [
      createGalleryCategory({
        items: [createGalleryItem({ _key: '1' }), createGalleryItem({ _key: '2' })]
      }),
      createGalleryCategory({ items: [] }),
      createGalleryCategory({ items: [createGalleryItem({ _key: '3' })] })
    ]

    expect(flattenGalleryItems(categories).map((item) => item._key)).toEqual(['1', '2', '3'])
  })

  it('handles a missing gallery', () => {
    expect(flattenGalleryItems(null)).toEqual([])
  })
})

describe('toGalleryCategories', () => {
  it('flattens each category reference and uses its first photo as the thumbnail', () => {
    const first = createGalleryItem()
    const category = createGalleryCategory({
      _key: 'bedroom',
      category: { _id: 'cat-bedroom', label: 'Bedroom', orderRank: '0|a:' },
      items: [first, createGalleryItem()]
    })

    expect(toGalleryCategories([category])).toEqual([
      {
        _key: 'bedroom',
        _id: 'cat-bedroom',
        label: 'Bedroom',
        thumbnail: first.image,
        items: category.items
      }
    ])
  })

  it('handles a missing gallery', () => {
    expect(toGalleryCategories(null)).toEqual([])
  })
})
