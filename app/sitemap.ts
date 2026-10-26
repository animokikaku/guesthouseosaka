import { routing } from '@/i18n/routing'
import { getCanonicalUrl, type Href } from '@/lib/metadata'
import { ContactTypeValues, HouseIdentifierValues } from '@/lib/types'
import type { Locale } from 'use-intl'

const staticRoutes: Href[] = [{ pathname: '/' }, { pathname: '/faq' }, { pathname: '/contact' }]

const contactTypeRoutes: Href[] = ContactTypeValues.map((slug) => ({
  pathname: '/contact/[slug]',
  params: { slug }
}))

const houseRoutes: Href[] = HouseIdentifierValues.map((house) => ({
  pathname: '/[house]',
  params: { house }
}))

const galleryRoutes: Href[] = HouseIdentifierValues.map((house) => ({
  pathname: '/[house]/gallery',
  params: { house }
}))

const routes: Href[] = [...staticRoutes, ...contactTypeRoutes, ...houseRoutes, ...galleryRoutes]

function buildAlternates(href: Href): Record<Locale, string> {
  // routing.locales is the complete source of supported locales for this record.
  // oxlint-disable typescript/no-unsafe-type-assertion
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, getCanonicalUrl(href, locale)])
  ) as Record<Locale, string>
}
// oxlint-enable typescript/no-unsafe-type-assertion

type SitemapEntry = { url: string; alternates: { languages: Record<Locale, string> } }

function buildSitemapEntry(href: Href): SitemapEntry {
  return {
    url: getCanonicalUrl(href, routing.defaultLocale),
    alternates: {
      languages: buildAlternates(href)
    }
  }
}

export default function sitemap(): SitemapEntry[] {
  return routes.map(buildSitemapEntry)
}

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`)

/** The entries as a sitemap with `hreflang` alternates, as Next rendered them. */
export function toSitemapXml(entries: SitemapEntry[]) {
  const urls = entries.map(({ url, alternates }) => {
    const links = Object.entries(alternates.languages).map(
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
