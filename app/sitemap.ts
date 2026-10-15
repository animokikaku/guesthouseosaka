import { routing } from '@/i18n/routing'
import { getCanonicalUrl, type Href } from '@/lib/metadata'
import { ContactTypeValues, HouseIdentifierValues } from '@/lib/types'
import type { MetadataRoute } from 'next'
import type { Locale } from 'next-intl'

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

export const routes: Href[] = [
  ...staticRoutes,
  ...contactTypeRoutes,
  ...houseRoutes,
  ...galleryRoutes
]

function buildAlternates(href: Href): Record<Locale, string> {
  // routing.locales is the complete source of supported locales for this record.
  // oxlint-disable typescript/no-unsafe-type-assertion
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, getCanonicalUrl(href, locale)])
  ) as Record<Locale, string>
}
// oxlint-enable typescript/no-unsafe-type-assertion

function buildSitemapEntry(href: Href): MetadataRoute.Sitemap[number] {
  return {
    url: getCanonicalUrl(href, routing.defaultLocale),
    alternates: {
      languages: buildAlternates(href)
    }
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(buildSitemapEntry)
}
