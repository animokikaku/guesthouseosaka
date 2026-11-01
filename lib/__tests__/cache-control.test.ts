// @vitest-environment node

import { cacheHeaders, cacheTags, mergeCacheTags } from '../cache-control'

describe('cacheHeaders', () => {
  it('shares published responses for a day, tagged with every Sanity type they read', () => {
    expect(cacheHeaders(false, cacheTags(['faqPage', 'house'], ['rooms']))).toEqual({
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
      'Cache-Tag': 'sanity,sanity-faqPage,sanity-house,rooms'
    })
  })

  it('never shares a draft response, nor tags it', () => {
    expect(cacheHeaders(true, cacheTags(['house']))).toEqual({
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie'
    })
  })

  // Draft mode skips the cache in the gateway instead (see app/worker.ts).
  it('doesn’t vary published responses on cookies', () => {
    expect(cacheHeaders(false)).not.toHaveProperty('Vary')
  })

  // A page's tags come from its loaders (see `setCacheHeaders`).
  it('leaves the tags out when given none', () => {
    expect(cacheHeaders(false)).not.toHaveProperty('Cache-Tag')
  })
})

describe('mergeCacheTags', () => {
  // A page renders several loaders, each adding the types it reads.
  it('adds up the tags of a page’s loaders, once each', () => {
    expect(
      mergeCacheTags('sanity,sanity-settings,sanity-house', 'sanity, sanity-house,rooms')
    ).toBe('sanity,sanity-settings,sanity-house,rooms')
  })

  it('starts from nothing before the first loader', () => {
    expect(mergeCacheTags(undefined, 'sanity,sanity-faqPage')).toBe('sanity,sanity-faqPage')
  })
})
