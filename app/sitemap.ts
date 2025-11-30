import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import type { MetadataRoute } from 'next'
import { Locale } from 'next-intl'

const pages = [
  '',
  'orange',
  'apple',
  'lemon',
  'faq',
  'contact',
  'contact/tour',
  'contact/move-in',
  'contact/other'
] as const

type Page = (typeof pages)[number]

export default function sitemap(): MetadataRoute.Sitemap {
  const host = env.NEXT_PUBLIC_APP_URL
  const { defaultLocale, locales } = routing

  const url = (page: Page, locale: Locale) => `${host}/${locale}/${page}`

  const alternate = (page: Page) => ({
    languages: locales.reduce(
      (acc, locale) => {
        acc[locale] = url(page, locale)
        return acc
      },
      {} as Record<Locale, string>
    )
  })

  return pages.map((page) => ({
    url: url(page, defaultLocale),
    alternates: alternate(page)
  }))
}
