import { routing } from '@/i18n/routing'
import { getCanonicalUrl } from '@/lib/metadata'
import { ContactTypeValues, HouseIdentifierValues } from '@/lib/types'
import type { MetadataRoute } from 'next'

type Locale = (typeof routing.locales)[number]
type Pathname = keyof typeof routing.pathnames

type Route =
  | '/'
  | {
      pathname: Exclude<Pathname, '/[house]' | '/[house]/gallery' | '/contact/[slug]'>
    }
  | { pathname: '/[house]'; params: { house: string } }
  | { pathname: '/[house]/gallery'; params: { house: string } }
  | { pathname: '/contact/[slug]'; params: { slug: string } }

const staticRoutes: Route[] = [{ pathname: '/' }, { pathname: '/faq' }, { pathname: '/contact' }]

const contactTypeRoutes: Route[] = ContactTypeValues.map((slug) => ({
  pathname: '/contact/[slug]',
  params: { slug }
}))

const houseRoutes: Route[] = HouseIdentifierValues.map((house) => ({
  pathname: '/[house]',
  params: { house }
}))

const galleryRoutes: Route[] = HouseIdentifierValues.map((house) => ({
  pathname: '/[house]/gallery',
  params: { house }
}))

export const routes: Route[] = [
  ...staticRoutes,
  ...contactTypeRoutes,
  ...houseRoutes,
  ...galleryRoutes
]

function buildAlternates(href: Route): Record<Locale, string> {
  // routing.locales is the complete source of supported locales for this record.
  // oxlint-disable typescript/no-unsafe-type-assertion
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, getCanonicalUrl(href, locale)])
  ) as Record<Locale, string>
}
// oxlint-enable typescript/no-unsafe-type-assertion

function buildSitemapEntry(href: Route): MetadataRoute.Sitemap[number] {
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
