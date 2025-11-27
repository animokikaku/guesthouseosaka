import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

const openGraphLocaleMap = {
  en: 'en_US',
  ja: 'ja_JP',
  fr: 'fr_FR'
} as const

export async function getOpenGraphMetadata({
  image,
  locale
}: {
  image?: string
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: 'meta' })

  const openGraph = {
    type: 'website',
    images: image,
    siteName: t('siteName'),
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
