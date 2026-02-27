import { describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'

vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        dpr: () => ({
          fit: () => ({
            url: () => 'https://cdn.sanity.io/images/test/gallery.jpg'
          })
        })
      })
    })
  })
}))

import { toGalleryImages } from '../gallery'

function createGalleryWallImage(overrides: Record<string, unknown> = {}) {
  return {
    _key: faker.string.nanoid(),
    alt: faker.lorem.words(3),
    preview: `data:image/jpeg;base64,${faker.string.alphanumeric(20)}`,
    asset: { _ref: `image-${faker.string.nanoid()}`, _type: 'reference' as const },
    hotspot: null,
    crop: null,
    ...overrides
  }
}

describe('toGalleryImages', () => {
  it('transforms images with layout dimensions', () => {
    const images = Array.from({ length: 6 }, () => createGalleryWallImage())

    const result = toGalleryImages(images)

    expect(result).toHaveLength(6)
    expect(result[0].width).toBe(142)
    expect(result[0].height).toBe(142)
    expect(result[1].width).toBe(272)
    expect(result[1].height).toBe(272)
  })

  it('preserves _key from source images', () => {
    const images = [createGalleryWallImage({ _key: 'my-key' })]

    const result = toGalleryImages(images)

    expect(result[0]._key).toBe('my-key')
  })

  it('preserves alt text from source images', () => {
    const images = [createGalleryWallImage({ alt: 'Living room' })]

    const result = toGalleryImages(images)

    expect(result[0].alt).toBe('Living room')
  })

  it('preserves blurDataURL from preview field', () => {
    const preview = 'data:image/jpeg;base64,abc123'
    const images = [createGalleryWallImage({ preview })]

    const result = toGalleryImages(images)

    expect(result[0].blurDataURL).toBe(preview)
  })

  it('builds image URL via urlFor chain', () => {
    const images = [createGalleryWallImage()]

    const result = toGalleryImages(images)

    expect(result[0].src).toBe('https://cdn.sanity.io/images/test/gallery.jpg')
  })

  it('returns empty array for empty input', () => {
    const result = toGalleryImages([])

    expect(result).toEqual([])
  })

  it('assigns correct layout for all 6 positions', () => {
    const images = Array.from({ length: 6 }, () => createGalleryWallImage())

    const result = toGalleryImages(images)

    const expectedSizes = [
      { width: 142, height: 142 },
      { width: 272, height: 272 },
      { width: 123, height: 123 },
      { width: 168, height: 168 },
      { width: 129, height: 129 },
      { width: 194, height: 194 }
    ]

    expectedSizes.forEach((size, i) => {
      expect(result[i].width).toBe(size.width)
      expect(result[i].height).toBe(size.height)
    })
  })
})
