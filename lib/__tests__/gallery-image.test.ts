// @vitest-environment node

import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { cleanGalleryAlt, toGalleryImageProps, toGalleryLightboxItem } from '../gallery-image'

/** The resize parameters a Sanity CDN URL asks for. */
function resizeOf(url: unknown) {
  const { searchParams } = new URL(String(url))
  return {
    w: searchParams.get('w'),
    h: searchParams.get('h'),
    fit: searchParams.get('fit')
  }
}

describe('cleanGalleryAlt', () => {
  it.each([null, undefined])('turns a missing alt (%s) into an empty one', (alt) => {
    expect(cleanGalleryAlt(alt)).toBe('')
  })
})

describe('toGalleryImageProps', () => {
  it('returns null for an image without an asset', () => {
    expect(toGalleryImageProps(createSanityImage({ asset: null }), { width: 400 })).toBeNull()
  })

  it('crops to the requested size and keeps the dimensions for Image', () => {
    const image = createSanityImage({ alt: 'Kitchen' })

    const props = toGalleryImageProps(image, { width: 560, height: 400 })

    expect(resizeOf(props?.src)).toEqual({ w: '560', h: '400', fit: 'crop' })
    expect(props).toMatchObject({
      alt: 'Kitchen',
      width: 560,
      height: 400,
      blurHash: image.blurHash
    })
  })

  // `fill` images size from their container, so they must not pin dimensions.
  it('can leave the dimensions to the container', () => {
    const props = toGalleryImageProps(createSanityImage(), {
      width: 640,
      height: 384,
      includeDimensions: false
    })

    expect(resizeOf(props?.src)).toEqual({ w: '640', h: '384', fit: 'crop' })
    expect(props).toMatchObject({ width: undefined, height: undefined })
  })

  it('keeps the full aspect ratio when asked not to crop', () => {
    const props = toGalleryImageProps(createSanityImage(), { fit: 'max' })

    expect(resizeOf(props?.src)).toEqual({ w: null, h: null, fit: 'max' })
  })

  it('prefers an explicit alt over the image one', () => {
    const props = toGalleryImageProps(createSanityImage({ alt: 'Original' }), { alt: 'Override' })

    expect(props?.alt).toBe('Override')
  })

  it('skips the placeholder when the image has no blurhash', () => {
    const props = toGalleryImageProps(createSanityImage({ blurHash: null }), { width: 400 })

    expect(props?.blurHash).toBeUndefined()
  })
})

describe('toGalleryLightboxItem', () => {
  it('returns null for an image without an asset', () => {
    const item = createGalleryItem({ image: createSanityImage({ asset: null }) })

    expect(toGalleryLightboxItem(item)).toBeNull()
  })

  it('shows the uncropped photo at its intrinsic size with a square thumbnail', () => {
    const item = createGalleryItem({
      _key: 'img1',
      image: createSanityImage({ alt: 'Bedroom view' })
    })

    const lightboxItem = toGalleryLightboxItem(item)

    // The asset reference encodes 1920x1080, which the morph needs to size the frame.
    expect(lightboxItem).toMatchObject({
      id: 'img1',
      alt: 'Bedroom view',
      caption: 'Bedroom view',
      width: 1920,
      height: 1080
    })
    expect(resizeOf(lightboxItem?.src)).toEqual({ w: null, h: null, fit: 'max' })
    expect(resizeOf(lightboxItem?.thumb)).toEqual({ w: '56', h: '56', fit: 'crop' })
  })

  // The slide's placeholder is the trigger, not the lightbox image: `Image`
  // paints the blurhash as an inline background that would cover ramka's
  // thumbnail bridge. The strip thumbnail isn't bridged, so it gets one.
  it('gives the blurhash to the strip thumbnail only', () => {
    const image = createSanityImage()
    expect(image.blurHash).toBeTruthy()

    const item = toGalleryLightboxItem(createGalleryItem({ image }))
    expect(item).not.toHaveProperty('blurHash')
    expect(item?.thumbBlurHash).toBe(image.blurHash)
  })
})
