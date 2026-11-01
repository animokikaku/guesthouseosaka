// @vitest-environment node

import { hasCookie, withoutTrackingParams, withTrackingParams } from '../cache-key'

describe('withoutTrackingParams', () => {
  it('drops campaign parameters and keeps the ones pages read', () => {
    const { url, tracking } = withoutTrackingParams(
      new URL('https://guesthouseosaka.com/en/orange/gallery?utm_source=ig&photo=3&fbclid=abc')
    )
    expect(url.pathname + url.search).toBe('/en/orange/gallery?photo=3')
    expect(tracking).toEqual([
      ['utm_source', 'ig'],
      ['fbclid', 'abc']
    ])
  })

  it('leaves the query string empty when it only tracked', () => {
    const { url } = withoutTrackingParams(
      new URL('https://guesthouseosaka.com/en?gclid=1&utm_medium=cpc&srsltid=x')
    )
    expect(url.href).toBe('https://guesthouseosaka.com/en')
  })

  // Server function GETs carry their input in the query string.
  it('returns the same URL when nothing tracks', () => {
    const original = new URL('https://guesthouseosaka.com/_serverFn/abc?payload=%7B%7D')
    const { url, tracking } = withoutTrackingParams(original)
    expect(url).toBe(original)
    expect(tracking).toEqual([])
  })
})

describe('withTrackingParams', () => {
  const tracking: [string, string][] = [['utm_source', 'newsletter']]

  it('adds the parameters back to a redirect within the site', () => {
    expect(withTrackingParams('/en/orange?photo=2', tracking)).toBe(
      '/en/orange?photo=2&utm_source=newsletter'
    )
  })

  it('leaves redirects to other hosts alone', () => {
    expect(withTrackingParams('https://example.sanity.studio/', tracking)).toBe(
      'https://example.sanity.studio/'
    )
    expect(withTrackingParams('//example.com/', tracking)).toBe('//example.com/')
  })
})

describe('hasCookie', () => {
  it('finds a cookie by name, wherever it is in the header', () => {
    expect(hasCookie('NEXT_LOCALE=ja; __sanity_draft_mode=1.sig', '__sanity_draft_mode')).toBe(true)
    expect(hasCookie('__sanity_draft_mode=1.sig', '__sanity_draft_mode')).toBe(true)
  })

  it('ignores other cookies whose name merely contains it', () => {
    expect(hasCookie('x__sanity_draft_mode=1', '__sanity_draft_mode')).toBe(false)
    expect(hasCookie(null, '__sanity_draft_mode')).toBe(false)
  })
})
