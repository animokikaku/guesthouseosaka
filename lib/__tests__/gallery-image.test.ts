vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        dpr: () => ({
          fit: () => ({
            url: () => 'https://cdn.sanity.io/images/test/sized.jpg'
          })
        })
      })
    }),
    url: () => 'https://cdn.sanity.io/images/test/full.jpg'
  })
}))

vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string | null | undefined) => value ?? ''
}))

vi.mock('@sanity/asset-utils', () => ({
  getImageDimensions: () => ({ width: 1920, height: 1080 })
}))

import { createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { cleanGalleryAlt, toGalleryImageProps } from '../gallery-image'

describe('cleanGalleryAlt', () => {
  it('returns empty string for null or undefined', () => {
    expect(cleanGalleryAlt(null)).toBe('')
    expect(cleanGalleryAlt(undefined)).toBe('')
  })

  it('returns cleaned alt text', () => {
    expect(cleanGalleryAlt('Bedroom view')).toBe('Bedroom view')
  })
})

describe('toGalleryImageProps', () => {
  it('returns null when image has no asset', () => {
    const image = createSanityImage({ asset: undefined })

    expect(toGalleryImageProps(image, { width: 400, height: 400 })).toBeNull()
    expect(toGalleryImageProps(image, { size: 'full' })).toBeNull()
  })

  it('builds sized image props with dimensions by default', () => {
    const image = createSanityImage({ alt: 'Kitchen' })

    expect(toGalleryImageProps(image, { width: 560, height: 400 })).toEqual({
      src: 'https://cdn.sanity.io/images/test/sized.jpg',
      alt: 'Kitchen',
      width: 560,
      height: 400,
      blurDataURL: image.preview,
      placeholder: 'blur'
    })
  })

  it('omits dimensions when includeDimensions is false', () => {
    const image = createSanityImage()

    const result = toGalleryImageProps(image, {
      width: 256,
      height: 192,
      includeDimensions: false
    })

    expect(result).toMatchObject({
      src: 'https://cdn.sanity.io/images/test/sized.jpg',
      width: undefined,
      height: undefined
    })
  })

  it('uses custom alt when provided', () => {
    const image = createSanityImage({ alt: 'Original alt' })

    const result = toGalleryImageProps(image, {
      width: 400,
      height: 400,
      alt: 'Category label'
    })

    expect(result?.alt).toBe('Category label')
  })

  it('omits blur placeholder when preview is missing', () => {
    const image = createSanityImage({ preview: null })

    const result = toGalleryImageProps(image, { width: 400, height: 400 })

    expect(result).toMatchObject({
      blurDataURL: undefined,
      placeholder: undefined
    })
  })

  it('builds full-size image props', () => {
    const image = createSanityImage({ alt: 'Full view' })

    expect(toGalleryImageProps(image, { size: 'full' })).toEqual({
      src: 'https://cdn.sanity.io/images/test/full.jpg',
      alt: 'Full view',
      width: 1920,
      height: 1080,
      blurDataURL: image.preview,
      placeholder: 'blur'
    })
  })

  it('uses custom alt for full-size images', () => {
    const image = createSanityImage({ alt: 'Original alt' })

    const result = toGalleryImageProps(image, { size: 'full', alt: 'Override alt' })

    expect(result?.alt).toBe('Override alt')
  })
})
