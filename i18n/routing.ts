export const routing = {
  locales: ['en', 'ja', 'fr', 'zh-CN', 'zh-TW'],
  defaultLocale: 'en'
} as const

type Locale = (typeof routing.locales)[number]

/**
 * Keep canonical BCP 47 codes internally (Sanity, hreflang, Intl) but lowercase
 * URLs: the `$locale` route parses a prefix into its locale and stringifies it
 * back, so code only ever handles `zh-CN` while links point at `/zh-cn`.
 */
export function localeToPrefix(locale: Locale): string {
  return locale.toLowerCase()
}

/** The locale a URL prefix stands for, or `undefined` for an unsupported one. */
export function prefixToLocale(prefix: string): Locale | undefined {
  return routing.locales.find((locale) => localeToPrefix(locale) === prefix)
}

/**
 * Remembers the visitor's last language, so `/` sends them back to it. Named by
 * next-intl, which the site used before; kept so saved choices still work.
 */
export const LOCALE_COOKIE = 'NEXT_LOCALE'
