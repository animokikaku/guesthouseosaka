// @vitest-environment node

import { canonicalLink, getCanonicalUrl, openGraphMeta, pageMeta } from '../metadata'

describe('getCanonicalUrl', () => {
  // Locales keep their BCP 47 codes internally but are served under lowercase prefixes.
  it.each([
    ['en', '/$locale', 'https://guesthouseosaka.test/en'],
    ['ja', '/$locale/faq', 'https://guesthouseosaka.test/ja/faq'],
    ['zh-CN', '/$locale/contact', 'https://guesthouseosaka.test/zh-cn/contact']
  ] as const)('points %s %s at its public URL', (locale, to, expected) => {
    expect(getCanonicalUrl({ to }, locale)).toBe(expected)
  })

  it('fills in dynamic segments', () => {
    expect(
      getCanonicalUrl({ to: '/$locale/$house/gallery', params: { house: 'lemon' } }, 'zh-TW')
    ).toBe('https://guesthouseosaka.test/zh-tw/lemon/gallery')
  })
})

describe('canonicalLink', () => {
  it('renders the canonical URL as a head link', () => {
    expect(canonicalLink({ to: '/$locale/$house', params: { house: 'orange' } }, 'zh-CN')).toEqual({
      rel: 'canonical',
      href: 'https://guesthouseosaka.test/zh-cn/orange'
    })
  })
})

describe('openGraphMeta', () => {
  it('describes the page for social cards, with its image on both networks', () => {
    const meta = openGraphMeta({
      locale: 'fr',
      siteName: 'Guest House Osaka',
      image: 'https://cdn.test/og.jpg'
    })

    expect(meta).toEqual(
      expect.arrayContaining([
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Guest House Osaka' },
        { property: 'og:image', content: 'https://cdn.test/og.jpg' },
        { name: 'twitter:image', content: 'https://cdn.test/og.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ])
    )
  })

  // `head()` dedupes by property, so the repeated alternates are rendered by the layout.
  it('leaves out what it has no value for, and the alternate locales', () => {
    const properties = openGraphMeta({ locale: 'en', siteName: null }).map((tag) =>
      'property' in tag ? tag.property : tag.name
    )

    expect(properties).not.toContain('og:site_name')
    expect(properties).not.toContain('og:image')
    expect(properties).not.toContain('og:locale:alternate')
  })
})

describe('pageMeta', () => {
  it('follows the site title template on every copy of the title', () => {
    const meta = pageMeta({ title: 'FAQ', description: 'Answers', siteName: 'Guest House Osaka' })

    expect(meta).toEqual([
      { title: 'FAQ - Guest House Osaka' },
      { property: 'og:title', content: 'FAQ - Guest House Osaka' },
      { name: 'twitter:title', content: 'FAQ - Guest House Osaka' },
      { name: 'description', content: 'Answers' },
      { property: 'og:description', content: 'Answers' },
      { name: 'twitter:description', content: 'Answers' }
    ])
  })

  it('falls back to the site name alone, and to nothing', () => {
    expect(pageMeta({ siteName: 'Guest House Osaka' })[0]).toEqual({ title: 'Guest House Osaka' })
    expect(pageMeta({})).toEqual([])
  })
})
