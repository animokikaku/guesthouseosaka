// @vitest-environment node

import { sanityImageLoader, sanitySourceWidth } from '../sanity-image-loader'

const SRC = 'https://cdn.sanity.io/images/test/image.jpg?w=400&h=400&fit=crop'

describe('sanityImageLoader', () => {
  it('rewrites the width to the requested candidate', () => {
    expect(sanityImageLoader({ src: SRC, width: 384 })).toBe(
      'https://cdn.sanity.io/images/test/image.jpg?w=384&h=384&fit=crop&auto=format&q=75'
    )
  })

  it('keeps the source crop aspect ratio', () => {
    const src = 'https://cdn.sanity.io/images/test/image.jpg?w=560&h=280&fit=crop'

    expect(sanityImageLoader({ src, width: 256 })).toContain('w=256&h=128')
  })

  it('drops a baked-in dpr so candidate widths are not doubled', () => {
    const src = 'https://cdn.sanity.io/images/test/image.jpg?w=400&h=400&dpr=2&fit=crop'

    expect(sanityImageLoader({ src, width: 384 })).not.toContain('dpr')
  })

  it('honours the requested quality', () => {
    expect(sanityImageLoader({ src: SRC, width: 384, quality: 90 })).toContain('q=90')
  })

  it('leaves dimensions alone when the source has no crop hints', () => {
    const result = sanityImageLoader({
      src: 'https://cdn.sanity.io/images/test/image.jpg',
      width: 640
    })

    expect(result).toBe('https://cdn.sanity.io/images/test/image.jpg?w=640&auto=format&q=75')
  })
})

describe('sanitySourceWidth', () => {
  const asset = 'https://cdn.sanity.io/images/test/production/abc-663x1000.jpg'

  it('reads the width from the asset file name', () => {
    expect(sanitySourceWidth(`${asset}?fit=max`)).toBe(663)
  })

  it('narrows to the rect the hotspot or crop selects', () => {
    expect(sanitySourceWidth(`${asset}?rect=20,301,600,360&w=640&h=384&fit=crop`)).toBe(600)
  })

  it('counts only the part of the source a crop to another aspect ratio fills', () => {
    // A 2:1 crop of a 663x1000 portrait fills its width; a square one of a
    // 1000x657 landscape only its height.
    expect(sanitySourceWidth(`${asset}?w=800&h=400&fit=crop`)).toBe(663)
    expect(
      sanitySourceWidth(
        'https://cdn.sanity.io/images/test/production/abc-1000x657.jpg?w=800&h=800&fit=crop'
      )
    ).toBe(657)
  })

  it('is unknown for a source without a size', () => {
    expect(sanitySourceWidth('https://cdn.sanity.io/images/test/image.jpg?w=400')).toBeUndefined()
    expect(sanitySourceWidth('data:image/svg+xml,%3Csvg/%3E')).toBeUndefined()
    expect(sanitySourceWidth('/local.png')).toBeUndefined()
  })
})
