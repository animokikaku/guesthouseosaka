import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { routes, Routes } from '@/lib/types'
import type { MetadataRoute } from 'next'
import { Locale } from 'next-intl'

export default function sitemap(): MetadataRoute.Sitemap {
  const host = env.NEXT_PUBLIC_APP_URL
  const { defaultLocale, locales } = routing

  const url = (route: Routes, locale: Locale) => {
    return new URL(`${locale}${route}`, host).toString()
  }

  const alternate = (route: Routes) => ({
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
