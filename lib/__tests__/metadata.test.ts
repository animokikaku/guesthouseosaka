// @vitest-environment node

import { getCanonicalMetadata, getCanonicalUrl, getOpenGraphMetadata } from '../metadata'

describe('getCanonicalUrl', () => {
  // Locales keep their BCP 47 codes internally but are served under lowercase prefixes.
  it.each([
    ['en', '/', 'https://guesthouseosaka.test/en'],
    ['ja', '/faq', 'https://guesthouseosaka.test/ja/faq'],
    ['zh-CN', '/contact', 'https://guesthouseosaka.test/zh-cn/contact']
  ] as const)('points %s %s at its public URL', (locale, pathname, expected) => {
    expect(getCanonicalUrl(pathname, locale)).toBe(expected)
  })

  it('fills in dynamic segments', () => {
    expect(
      getCanonicalUrl({ pathname: '/[house]/gallery', params: { house: 'lemon' } }, 'zh-TW')
    ).toBe('https://guesthouseosaka.test/zh-tw/lemon/gallery')
  })

  it('wraps the URL as the page’s canonical link', () => {
    expect(getCanonicalMetadata('/faq', 'fr')).toEqual({
      canonical: 'https://guesthouseosaka.test/fr/faq'
    })
  })
})

describe('getOpenGraphMetadata', () => {
  it('tags the page’s locale and lists every other one as an alternate', () => {
    const { openGraph } = getOpenGraphMetadata({ locale: 'ja', siteName: 'Guest House Osaka' })

    expect(openGraph).toMatchObject({ locale: 'ja_JP', siteName: 'Guest House Osaka' })
    expect(openGraph.alternateLocale.toSorted()).toEqual(['en_US', 'fr_FR', 'zh_CN', 'zh_TW'])
  })

  it('leaves out a site name the settings do not have', () => {
    expect(
      getOpenGraphMetadata({ locale: 'en', siteName: null }).openGraph.siteName
    ).toBeUndefined()
  })
})
