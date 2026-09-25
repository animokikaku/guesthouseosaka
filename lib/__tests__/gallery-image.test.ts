// @vitest-environment node

vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string | null | undefined) => value ?? ''
}))

vi.mock('@sanity/asset-utils', () => ({
  getImageDimensions: () => ({ width: 1920, height: 1080 })
}))

import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { cleanGalleryAlt, toGalleryImageProps, toGalleryLightboxItem } from '../gallery-image'

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
      src: 'https://cdn.sanity.io/images/test/image.jpg?w=560&h=400&fit=crop',
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
      src: 'https://cdn.sanity.io/images/test/image.jpg?w=256&h=192&fit=crop',
      width: undefined,
      height: undefined
    })
  })

  it('builds a full-aspect URL without a baked-in crop', () => {
    const image = createSanityImage()

    const result = toGalleryImageProps(image, { fit: 'max' })

    expect(result?.src).toBe('https://cdn.sanity.io/images/test/image.jpg?fit=max')
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
      src: 'https://cdn.sanity.io/images/test/image.jpg',
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

describe('toGalleryLightboxItem', () => {
  it('returns null when image has no asset', () => {
    const item = createGalleryItem({ image: createSanityImage({ asset: undefined }) })

    expect(toGalleryLightboxItem(item)).toBeNull()
  })

  it('builds a LightboxItem from a gallery item', () => {
    const item = createGalleryItem({
      _key: 'img1',
      image: createSanityImage({ alt: 'Bedroom view' })
    })

    expect(toGalleryLightboxItem(item)).toEqual({
      id: 'img1',
      src: 'https://cdn.sanity.io/images/test/image.jpg?fit=max',
      thumb: 'https://cdn.sanity.io/images/test/image.jpg?w=56&h=56&fit=crop',
      alt: 'Bedroom view',
      caption: 'Bedroom view',
      width: 1920,
      height: 1080
    })
  })

  it('uses a full-aspect Sanity URL, not a cropped square', () => {
    const lightboxItem = toGalleryLightboxItem(createGalleryItem())

    expect(lightboxItem?.src).toContain('fit=max')
    expect(lightboxItem?.src).not.toMatch(/[?&]h=/)
    expect(lightboxItem?.src).not.toContain('fit=crop')
    expect(lightboxItem?.src).not.toMatch(/w=\d+&h=\d+/)
  })

  // The blur belongs on the trigger, not the lightbox image: next/image paints
  // the LQIP as an inline background that would cover ramka's thumbnail bridge.
  it('carries no LQIP, even when the image has a preview', () => {
    const image = createSanityImage({ alt: 'Bedroom view' })
    expect(image.preview).toBeTruthy()

    const lightboxItem = toGalleryLightboxItem(createGalleryItem({ image }))

    expect(lightboxItem).not.toBeNull()
    expect(lightboxItem).not.toHaveProperty('blurDataURL')
  })
})
