// @vitest-environment node

import { negotiateLocale, resolveLegacyRedirect } from '../redirects'

describe('resolveLegacyRedirect', () => {
  it.each([
    ['/jp', '/ja'],
    ['/jp/faq', '/ja/faq'],
    ['/zh', '/zh-cn'],
    ['/zh-sg/orange', '/zh-cn/orange'],
    ['/zh-hk', '/zh-tw'],
    ['/zh-hant/contact', '/zh-tw/contact'],
    ['/kr/faq', '/en/faq'],
    ['/en/orange-house', '/en/orange'],
    ['/zh-tw/oranged', '/zh-tw/orange'],
    ['/fr/apple/access', '/fr/apple'],
    ['/en/banana', '/en'],
    ['/ja/melon/gallery', '/ja'],
    ['/en/blog', '/en'],
    ['/en/reservation', '/en/contact'],
    ['/zh-cn/contact-us', '/zh-cn/contact']
  ])('sends %s to %s', (from, to) => {
    expect(resolveLegacyRedirect(from)).toBe(to)
  })

  // Only whole segments match, and current pages are left alone.
  it.each([
    '/en',
    '/en/orange',
    '/en/orange/gallery',
    '/en/contact',
    '/japan',
    '/en/blogger',
    '/en/column/old-post'
  ])('leaves %s alone', (pathname) => {
    expect(resolveLegacyRedirect(pathname)).toBeUndefined()
  })
})

describe('negotiateLocale', () => {
  it('prefers the remembered locale', () => {
    expect(negotiateLocale('ja', 'fr')).toBe('fr')
  })

  it('ignores a remembered value that is not a locale', () => {
    expect(negotiateLocale('ja', 'ko')).toBe('ja')
  })

  it.each([
    ['fr-FR,fr;q=0.9,en;q=0.8', 'fr'],
    ['zh-TW,zh;q=0.9', 'zh-TW'],
    // A region without its own locale goes to the closest one: Hong Kong writes Traditional Chinese.
    ['zh-HK', 'zh-TW'],
    ['zh-Hant', 'zh-TW'],
    ['zh-SG', 'zh-CN'],
    ['fr-CA,en', 'fr'],
    ['de,ja;q=0.5', 'ja'],
    ['en;q=0.2,ja;q=0.8', 'ja']
  ] as const)('matches %s to %s', (header, expected) => {
    expect(negotiateLocale(header, undefined)).toBe(expected)
  })

  it.each([null, '', 'de-DE,ko', '*', 'not a tag!'])('falls back to English for %j', (header) => {
    expect(negotiateLocale(header, undefined)).toBe('en')
  })
})
