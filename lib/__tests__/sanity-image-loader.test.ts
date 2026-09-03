// @vitest-environment node

import { sanityImageLoader } from '../sanity-image-loader'

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
