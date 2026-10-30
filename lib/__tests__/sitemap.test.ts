// @vitest-environment node

import { ContactTypeValues, HouseIdentifierValues } from '@/lib/types'
import { sitemapEntries, sitemapXml } from '../sitemap'

const ORIGIN = 'https://guesthouseosaka.test'

describe('sitemap', () => {
  const entries = sitemapEntries()
  const urls = entries.map((entry) => entry.url.replace(ORIGIN, ''))

  it('lists every public page once, under the default locale', () => {
    expect(urls).toEqual(
      expect.arrayContaining([
        '/en',
        '/en/faq',
        '/en/contact',
        ...ContactTypeValues.map((slug) => `/en/contact/${slug}`),
        ...HouseIdentifierValues.flatMap((house) => [`/en/${house}`, `/en/${house}/gallery`])
      ])
    )
    expect(new Set(urls).size).toBe(urls.length)
  })

  // hreflang alternates use the BCP 47 codes but the public, lowercase prefixes.
  it('points each page at its translation in every locale', () => {
    const house = entries.find((entry) => entry.url === `${ORIGIN}/en/orange`)

    expect(house?.alternates).toEqual({
      en: `${ORIGIN}/en/orange`,
      ja: `${ORIGIN}/ja/orange`,
      fr: `${ORIGIN}/fr/orange`,
      'zh-CN': `${ORIGIN}/zh-cn/orange`,
      'zh-TW': `${ORIGIN}/zh-tw/orange`
    })
  })

  it('renders each page with its alternates, escaped', () => {
    expect(sitemapXml()).toContain(
      `<url>\n<loc>${ORIGIN}/en/faq</loc>\n<xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en/faq" />`
    )
  })
})
