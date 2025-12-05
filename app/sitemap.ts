import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { Link } from 'lucide-react'
import type { MetadataRoute } from 'next'
import { Locale } from 'next-intl'
import { ComponentProps } from 'react'

type Route = ComponentProps<typeof Link>['href']

export const routes = [
  '/',
  '/orange',
  '/apple',
  '/lemon',
  '/faq',
  '/contact',
  '/contact/tour',
  '/contact/move-in',
  '/contact/other'
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const host = env.NEXT_PUBLIC_APP_URL
  const { defaultLocale, locales } = routing

  const url = (route: Route, locale: Locale) => {
    return new URL(`${locale}${route}`, host).toString()
  }

  const alternate = (route: Route) => ({
    languages: locales.reduce(
      (acc, locale) => {
        acc[locale] = url(route, locale)
        return acc
      },
      {} as Record<Locale, string>
    )
  })

  return routes.map((route) => ({
    url: url(route, defaultLocale),
    alternates: alternate(route)
  }))
}
