import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { Locale } from 'next-intl'

const openGraphLocaleMap: Record<Locale, string> = {
  en: 'en_US',
  ja: 'ja_JP',
  fr: 'fr_FR'
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
