import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { Metadata } from 'next'
import { Locale } from 'next-intl'

const openGraphLocaleMap: Record<Locale, string> = {
  en: 'en_US',
  ja: 'ja_JP',
  fr: 'fr_FR',
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW'
}

export function getOpenGraphMetadata({
  image,
  locale,
  siteName
}: {
  image?: string
  siteName?: string | null
  locale: Locale
}) {
  const openGraph = {
    type: 'website',
    images: image,
    siteName: siteName ?? undefined,
    locale: openGraphLocaleMap[locale],
    alternateLocale: routing.locales
      .filter((currentLocale) => currentLocale !== locale)
      .map((otherLocale) => openGraphLocaleMap[otherLocale])
  } satisfies Metadata['openGraph']

  const twitter = {
    card: 'summary_large_image',
    creator: '@melkir_thib' as const
  } satisfies Metadata['twitter']

  return { openGraph, twitter }
}

type Href = Parameters<typeof getPathname>[0]['href']

/** Absolute URL on the production origin, using the public locale prefix (e.g. /zh-cn). */
export function getCanonicalUrl(href: Href, locale: Locale) {
  return new URL(getPathname({ href, locale }), env.NEXT_PUBLIC_APP_URL).toString()
}

/** Self-referencing canonical on the production origin, so copies served elsewhere defer to it. */
export function getCanonicalMetadata(href: Href, locale: Locale) {
  return { canonical: getCanonicalUrl(href, locale) } satisfies Metadata['alternates']
}
