import { localeToPrefix, routing } from '@/i18n/routing'
import { HouseIdentifierValues } from '@/lib/types'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { Locale } from 'use-intl'

const LOCALES = routing.locales.map(localeToPrefix).join('|')
const HOUSES = HouseIdentifierValues.join('|')

type Groups = Record<string, string | undefined>

/** Keeps the rest of the path after a renamed locale prefix: `/jp/faq` → `/ja/faq`. */
const withRest =
  (prefix: string) =>
  ({ rest }: Groups) =>
    rest ? `${prefix}/${rest}` : prefix

/**
 * Permanent redirects for legacy URLs, which still carry links and search
 * ranking. Each pattern matches a whole pathname, and its destination is built
 * from the named groups it captured.
 */
const LEGACY_REDIRECTS: Array<[pattern: URLPattern, destination: (groups: Groups) => string]> = (
  [
    // Locale corrections: jp → ja
    ['/jp/:rest*', withRest('/ja')],

    // Chinese locale aliases → region-based locales
    ['/(zh|zh-hans|zh-sg)/:rest*', withRest('/zh-cn')],
    ['/(zh-hant|zh-hk|zh-mo)/:rest*', withRest('/zh-tw')],

    // Unsupported locales → default (en)
    ['/(ko|kr)/:rest*', withRest('/en')],

    // Renamed pages
    [`/:locale(${LOCALES})/(orange-house|oranged)`, ({ locale }) => `/${locale}/orange`],
    [`/:locale(${LOCALES})/:house(${HOUSES})/access`, ({ locale, house }) => `/${locale}/${house}`],

    // Removed houses
    [`/:locale(${LOCALES})/(banana|melon)/:rest*`, ({ locale }) => `/${locale}`],

    // Removed pages. The old WordPress blog (column, seo-blog, category, date
    // archives, wp-content) is blocked by a Cloudflare WAF rule instead, so
    // crawlers see it gone rather than redirected.
    [
      `/:locale(${LOCALES})/(location|review|feed|rss|blog|news|about|gallery|rooms|price|prices|access|privacy|terms|link)`,
      ({ locale }) => `/${locale}`
    ],
    [`/:locale(${LOCALES})/(reservation|booking|contact-us)`, ({ locale }) => `/${locale}/contact`]
  ] satisfies Array<[pathname: string, destination: (groups: Groups) => string]>
).map(([pathname, destination]) => [new URLPattern({ pathname }), destination])

/** Where a legacy pathname now lives, or `undefined` if it isn't one. */
export function resolveLegacyRedirect(pathname: string): string | undefined {
  for (const [pattern, destination] of LEGACY_REDIRECTS) {
    const result = pattern.exec({ pathname })
    if (result) return destination(result.pathname.groups)
  }
  return undefined
}

/**
 * The supported locale a visitor prefers: their remembered choice first, then
 * the best match for their `Accept-Language` by BCP 47 distance (`zh-HK`, which
 * writes Traditional Chinese, matches `zh-TW`), else the default.
 */
export function negotiateLocale(
  acceptLanguage: string | null,
  cookieLocale: string | undefined
): Locale {
  const remembered = routing.locales.find((locale) => locale === cookieLocale)
  if (remembered) return remembered

  // A tag the header got wrong would make the matcher throw, so only valid ones go in.
  const requested = new Negotiator({ headers: { 'accept-language': acceptLanguage ?? '' } })
    .languages()
    .filter((tag) => {
      try {
        return Intl.getCanonicalLocales(tag).length > 0
      } catch {
        return false
      }
    })
  const best = match(requested, routing.locales, routing.defaultLocale)
  return routing.locales.find((locale) => locale === best) ?? routing.defaultLocale
}
