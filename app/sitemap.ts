import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { HouseIdentifierValues } from '@/lib/types'
import type { MetadataRoute } from 'next'

type Locale = (typeof routing.locales)[number]
type Pathname = keyof typeof routing.pathnames

type Route =
  | '/'
  | { pathname: Exclude<Pathname, '/[house]' | '/[house]/gallery' | '/contact/[slug]'> }
  | { pathname: '/[house]'; params: { house: string } }
  | { pathname: '/[house]/gallery'; params: { house: string } }
  | { pathname: '/contact/[slug]'; params: { slug: string } }

const staticRoutes: Route[] = [
  { pathname: '/' },
  { pathname: '/faq' },
  { pathname: '/contact' }
]

const contactTypeRoutes: Route[] = ['tour', 'move-in', 'other'].map((slug) => ({
  pathname: '/contact/[slug]',
  params: { slug }
}))

const houseRoutes: Route[] = HouseIdentifierValues.map((house) => ({
  pathname: '/[house]',
  params: { house }
}))

export const routes: Route[] = [...staticRoutes, ...contactTypeRoutes, ...houseRoutes]

function buildUrl(href: Route, locale: Locale, host: string): string {
  return new URL(
    getPathname({
      href: href as Parameters<typeof getPathname>[0]['href'],
      locale
    }),
    host
  ).toString()
}

function buildAlternates(href: Route, host: string): Record<Locale, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, buildUrl(href, locale, host)])
  ) as Record<Locale, string>
}

function buildSitemapEntry(
  href: Route,
  host: string
): MetadataRoute.Sitemap[number] {
  return {
    url: buildUrl(href, routing.defaultLocale, host),
    alternates: {
      languages: buildAlternates(href, host)
    }
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const host = env.NEXT_PUBLIC_APP_URL
  return routes.map((route) => buildSitemapEntry(route, host))
}
