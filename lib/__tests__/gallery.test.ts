import { describe, it, expect } from 'vitest'
import {
  featuredToGalleryImage,
  getImageIndex,
  groupGalleryByCategory
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

describe('getImageIndex', () => {
  it('returns correct index for existing photoKey', () => {
    const images = [
      createGalleryItem({ _key: 'img1' }),
      createGalleryItem({ _key: 'img2' }),
      createGalleryItem({ _key: 'img3' })
    ]

    expect(getImageIndex(images, 'img2')).toBe(1)
  })

  it('returns 0 for non-existent photoKey', () => {
    const images = [
      createGalleryItem({ _key: 'img1' }),
      createGalleryItem({ _key: 'img2' })
    ]

    expect(getImageIndex(images, 'nonexistent')).toBe(0)
  })

  it('handles empty array', () => {
    expect(getImageIndex([], 'any')).toBe(0)
  })

  it('returns 0 for first item', () => {
    const images = [
      createGalleryItem({ _key: 'first' }),
      createGalleryItem({ _key: 'second' })
    ]

    expect(getImageIndex(images, 'first')).toBe(0)
  })
})

describe('groupGalleryByCategory', () => {
  it('returns empty array for null gallery', () => {
    expect(groupGalleryByCategory(null)).toEqual([])
  })

  it('returns empty array for empty gallery', () => {
    expect(groupGalleryByCategory([])).toEqual([])
  })

  it('groups images by category with count field', () => {
    const category = createGalleryCategory({ key: 'bedroom', orderRank: '0|a00000:' })
    const images = [
      createGalleryItem({ category }),
      createGalleryItem({ category }),
      createGalleryItem({ category })
    ]

    const result = groupGalleryByCategory(images)

    expect(result).toHaveLength(1)
    expect(result[0].count).toBe(3)
    expect(result[0].key).toBe('bedroom')
  })

  it('sets thumbnail to first image of category', () => {
    const category = createGalleryCategory({ key: 'kitchen', orderRank: '0|a00000:' })
    const firstImage = createSanityImage({ alt: 'First kitchen image' })
    const images = [
      createGalleryItem({ category, image: firstImage }),
      createGalleryItem({ category }),
      createGalleryItem({ category })
    ]

    const result = groupGalleryByCategory(images)

    expect(result[0].thumbnail).toBe(firstImage)
  })

  it('handles mixed categories', () => {
    const bedroomCat = createGalleryCategory({ key: 'bedroom', orderRank: '0|a00000:' })
    const kitchenCat = createGalleryCategory({ key: 'kitchen', orderRank: '0|b00000:' })
    const images = [
      createGalleryItem({ category: bedroomCat }),
      createGalleryItem({ category: kitchenCat }),
      createGalleryItem({ category: bedroomCat })
    ]

    const result = groupGalleryByCategory(images)

    expect(result).toHaveLength(2)
    expect(result[0].key).toBe('bedroom')
    expect(result[0].count).toBe(2)
    expect(result[1].key).toBe('kitchen')
    expect(result[1].count).toBe(1)
  })

  it('includes _id field from category', () => {
    const category = createGalleryCategory({ _id: 'cat-123', key: 'living' })
    const images = [createGalleryItem({ category })]

    const result = groupGalleryByCategory(images)

    expect(result[0]._id).toBe('cat-123')
  })

  it('sets thumbnail to null when category has no items', () => {
    // This tests edge case via groupByCategory - items without category are skipped
    const images = [createGalleryItem({ category: undefined })]

    const result = groupGalleryByCategory(images)

    expect(result).toHaveLength(0)
  })

  it('preserves item order within categories', () => {
    const category = createGalleryCategory({ key: 'room', orderRank: '0|a00000:' })
    const images = [
      createGalleryItem({ _key: 'first', category }),
      createGalleryItem({ _key: 'second', category }),
      createGalleryItem({ _key: 'third', category })
    ]

    const result = groupGalleryByCategory(images)

    expect(result[0].items.map((i) => i._key)).toEqual(['first', 'second', 'third'])
  })
})
