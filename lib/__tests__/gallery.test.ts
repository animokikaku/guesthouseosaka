import { describe, it, expect } from 'vitest'
import {
  featuredToGalleryImage,
  flattenGalleryItems,
  getImageIndex,
  toGalleryCategories
} from '../gallery'
import {
  createGalleryItem,
  createGalleryCategory,
  createSanityImage
} from '@/lib/transforms/__tests__/mocks'

describe('featuredToGalleryImage', () => {
  it('converts featured image with _key: "featured"', () => {
    const image = createSanityImage()
    const result = featuredToGalleryImage(image)

    expect(result._key).toBe('featured')
    expect(result.image).toBe(image)
  })
})

describe('flattenGalleryItems', () => {
  it('returns empty array for null categories', () => {
    expect(flattenGalleryItems(null)).toEqual([])
  })

  it('returns empty array for empty categories', () => {
    expect(flattenGalleryItems([])).toEqual([])
  })

  it('flattens items from multiple categories', () => {
    const categories = [
      createGalleryCategory({
        _key: 'cat1',
        items: [
          createGalleryItem({ _key: 'img1' }),
          createGalleryItem({ _key: 'img2' })
        ]
      }),
      createGalleryCategory({
        _key: 'cat2',
        items: [createGalleryItem({ _key: 'img3' })]
      })
    ]

    const result = flattenGalleryItems(categories)

    expect(result).toHaveLength(3)
    expect(result.map((i) => i._key)).toEqual(['img1', 'img2', 'img3'])
  })

  it('handles categories with empty items', () => {
    const categories = [
      createGalleryCategory({ _key: 'cat1', items: [] }),
      createGalleryCategory({
        _key: 'cat2',
        items: [createGalleryItem({ _key: 'img1' })]
      })
    ]

    const result = flattenGalleryItems(categories)

    expect(result).toHaveLength(1)
    expect(result[0]._key).toBe('img1')
  })
})

describe('getImageIndex', () => {
  it('returns correct index for existing photoKey', () => {
    const categories = [
      createGalleryCategory({
        items: [
          createGalleryItem({ _key: 'img1' }),
          createGalleryItem({ _key: 'img2' }),
          createGalleryItem({ _key: 'img3' })
        ]
      })
    ]

    expect(getImageIndex(categories, 'img2')).toBe(1)
  })

  it('returns 0 for non-existent photoKey', () => {
    const categories = [
      createGalleryCategory({
        items: [
          createGalleryItem({ _key: 'img1' }),
          createGalleryItem({ _key: 'img2' })
        ]
      })
    ]

    expect(getImageIndex(categories, 'nonexistent')).toBe(0)
  })

  it('handles null categories', () => {
    expect(getImageIndex(null, 'any')).toBe(0)
  })

  it('returns 0 for first item', () => {
    const categories = [
      createGalleryCategory({
        items: [
          createGalleryItem({ _key: 'first' }),
          createGalleryItem({ _key: 'second' })
        ]
      })
    ]

    expect(getImageIndex(categories, 'first')).toBe(0)
  })

  it('finds items across multiple categories', () => {
    const categories = [
      createGalleryCategory({
        items: [
          createGalleryItem({ _key: 'img1' }),
          createGalleryItem({ _key: 'img2' })
        ]
      }),
      createGalleryCategory({
        items: [createGalleryItem({ _key: 'img3' })]
      })
    ]

    expect(getImageIndex(categories, 'img3')).toBe(2)
  })
})

describe('toGalleryCategories', () => {
  it('returns empty array for null data', () => {
    expect(toGalleryCategories(null)).toEqual([])
  })

  it('returns empty array for empty data', () => {
    expect(toGalleryCategories([])).toEqual([])
  })

  it('computes count field correctly', () => {
    const categories = [
      createGalleryCategory({
        _key: 'cat1',
        category: { _id: 'id1', slug: 'bedroom', label: 'Bedroom', orderRank: '0|a:' },
        items: [
          createGalleryItem(),
          createGalleryItem(),
          createGalleryItem()
        ]
      })
    ]

    const result = toGalleryCategories(categories)

    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(3)
    expect(result[0].slug).toBe('bedroom')
  })

  it('sets thumbnail to first image of category', () => {
    const firstImage = createSanityImage({ alt: 'First kitchen image' })
    const categories = [
      createGalleryCategory({
        items: [
          createGalleryItem({ image: firstImage }),
          createGalleryItem(),
          createGalleryItem()
        ]
      })
    ]

    const result = toGalleryCategories(categories)

    expect(result[0].thumbnail).toBe(firstImage)
  })

  it('handles categories with empty items (filtering is done at GROQ level)', () => {
    // Empty categories are filtered by GROQ query, but transform still handles them gracefully
    const categories = [
      createGalleryCategory({ _key: 'empty', items: [] }),
      createGalleryCategory({
        _key: 'hasItems',
        items: [createGalleryItem()]
      })
    ]

    const result = toGalleryCategories(categories)

    // Both categories are transformed (GROQ filters before this)
    expect(result).toHaveLength(2)
    expect(result[0].count).toBe(0)
    expect(result[1].count).toBe(1)
  })

  it('preserves category order', () => {
    const categories = [
      createGalleryCategory({
        _key: 'first',
        category: { _id: '1', slug: 'a', label: 'A', orderRank: '0|a:' },
        items: [createGalleryItem()]
      }),
      createGalleryCategory({
        _key: 'second',
        category: { _id: '2', slug: 'b', label: 'B', orderRank: '0|b:' },
        items: [createGalleryItem()]
      })
    ]

    const result = toGalleryCategories(categories)

    expect(result.map((c) => c._key)).toEqual(['first', 'second'])
  })

  it('includes _key from original category container', () => {
    const categories = [
      createGalleryCategory({
        _key: 'my-key',
        items: [createGalleryItem()]
      })
    ]

    const result = toGalleryCategories(categories)

    expect(result[0]._key).toBe('my-key')
  })
})
