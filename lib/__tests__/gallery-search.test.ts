// @vitest-environment node

import { validateGallerySearch } from '../gallery-search'

describe('validateGallerySearch', () => {
  it('keeps a photo key', () => {
    expect(validateGallerySearch({ photo: 'a1b2c3' })).toEqual({ photo: 'a1b2c3' })
  })

  // The router parses `?photo=123` as a number.
  it('reads a numeric-looking key back as a string', () => {
    expect(validateGallerySearch({ photo: 123 })).toEqual({ photo: '123' })
  })

  it.each([{}, { photo: '' }, { photo: ['a'] }, { photo: null }])(
    'drops a missing or malformed photo (%j)',
    (search) => {
      expect(validateGallerySearch(search)).toEqual({})
    }
  )
})
