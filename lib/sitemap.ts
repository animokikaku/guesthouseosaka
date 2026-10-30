import { routing } from '@/i18n/routing'
import { getCanonicalUrl, type Href } from '@/lib/metadata'
import { ContactTypeValues, HouseIdentifierValues } from '@/lib/types'
import type { Locale } from 'use-intl'

/** Every public page, once. */
const pages: Href[] = [
  { to: '/$locale' },
  { to: '/$locale/faq' },
  { to: '/$locale/contact' },
  ...ContactTypeValues.map((slug) => ({ to: '/$locale/contact/$slug', params: { slug } }) as const),
  ...HouseIdentifierValues.flatMap(
    (house) =>
      [
        { to: '/$locale/$house', params: { house } },
        { to: '/$locale/$house/gallery', params: { house } }
      ] as const
  )
]

type SitemapEntry = { url: string; alternates: Record<Locale, string> }

/** Each page under the default locale, with its URL in every locale for `hreflang`. */
export function sitemapEntries(): SitemapEntry[] {
  return pages.map((page) => ({
    url: getCanonicalUrl(page, routing.defaultLocale),
    // routing.locales is the complete source of supported locales for this record.
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    alternates: Object.fromEntries(
      routing.locales.map((locale) => [locale, getCanonicalUrl(page, locale)])
    ) as Record<Locale, string>
  }))
}

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`)

/** The sitemap, with each page's `hreflang` alternates. */
export function sitemapXml() {
  const urls = sitemapEntries().map(({ url, alternates }) => {
    const links = Object.entries(alternates).map(
      ([hreflang, href]) =>
        `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}" />`
    )
    return `<url>\n<loc>${escapeXml(url)}</loc>\n${links.join('\n')}\n</url>`
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>'
  ].join('\n')
}
