import { localeConfig } from '@/i18n/locales'
import { localeToPrefix } from '@/i18n/routing'
import { env } from '@/lib/env'
import type { HouseIdentifier, ContactType } from '@/lib/types'
import type { Locale } from 'use-intl'

/** A public page, independent of the locale it is served in. */
export type Href =
  | '/'
  | '/faq'
  | '/contact'
  | { pathname: '/' | '/faq' | '/contact'; params?: undefined }
  | { pathname: '/contact/[slug]'; params: { slug: ContactType } }
  | { pathname: '/[house]' | '/[house]/gallery'; params: { house: HouseIdentifier } }

/** The path of a page in a locale, under its public prefix (e.g. /zh-cn). */
function getPathname(href: Href, locale: Locale) {
  const { pathname, params } = typeof href === 'string' ? { pathname: href, params: {} } : href
  const values: Record<string, string> = { ...params }
  const path = pathname.replace(/\[(\w+)\]/g, (_, name: string) => values[name] ?? '')
  return `/${localeToPrefix(locale)}${path === '/' ? '' : path}`
}

/** Absolute URL on the production origin, using the public locale prefix (e.g. /zh-cn). */
export function getCanonicalUrl(href: Href, locale: Locale) {
  return new URL(getPathname(href, locale), env.VITE_APP_URL).toString()
}

/**
 * Self-referencing canonical on the production origin, so copies served
 * elsewhere defer to it, as a `head()` link.
 */
export function canonicalLink(href: Href, locale: Locale) {
  return { rel: 'canonical', href: getCanonicalUrl(href, locale) }
}

/**
 * Open Graph and Twitter card `head()` meta tags. Nested routes override
 * these by property, so a page only needs to pass what differs (its image).
 * `og:locale:alternate` repeats, which `head()` would dedupe to one tag, so
 * the locale layout renders those itself.
 */
export function openGraphMeta({
  image,
  locale,
  siteName
}: {
  image?: string
  siteName?: string | null
  locale: Locale
}) {
  return [
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: localeConfig[locale].openGraph },
    ...(siteName ? [{ property: 'og:site_name', content: siteName }] : []),
    ...(image
      ? [
          { property: 'og:image', content: image },
          { name: 'twitter:image', content: image }
        ]
      : []),
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: '@melkir_thib' }
  ]
}

/**
 * Title, description and their social-card copies. The title follows the
 * site-wide `%s - Site name` template the root layout set under Next.
 */
export function pageMeta({
  title,
  description,
  siteName
}: {
  title?: string | null
  description?: string | null
  siteName?: string | null
}) {
  const fullTitle = title && siteName ? `${title} - ${siteName}` : (title ?? siteName)
  return [
    ...(fullTitle
      ? [
          { title: fullTitle },
          { property: 'og:title', content: fullTitle },
          { name: 'twitter:title', content: fullTitle }
        ]
      : []),
    ...(description
      ? [
          { name: 'description', content: description },
          { property: 'og:description', content: description },
          { name: 'twitter:description', content: description }
        ]
      : [])
  ]
}
