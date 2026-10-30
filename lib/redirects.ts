import { localeToPrefix, prefixToLocale, routing } from '@/i18n/routing'
import { HouseIdentifierValues } from '@/lib/types'
import type { Locale } from 'use-intl'

const LOCALES = routing.locales.map(localeToPrefix).join('|')
const HOUSES = HouseIdentifierValues.join('|')

/**
 * Permanent redirects for legacy URLs, which still carry links and search
 * ranking. Each pattern matches a whole pathname; `$<name>` in the
 * destination is replaced by the matching group.
 */
const LEGACY_REDIRECTS: Array<[source: RegExp, destination: string]> = [
  // Locale corrections: jp → ja
  [/^\/jp(?<path>\/.*)?$/, '/ja$<path>'],

  // Chinese locale aliases → region-based locales
  [/^\/(?:zh|zh-hans|zh-sg)(?<path>\/.*)?$/, '/zh-cn$<path>'],
  [/^\/(?:zh-hant|zh-hk|zh-mo)(?<path>\/.*)?$/, '/zh-tw$<path>'],

  // Unsupported locales → default (en)
  [/^\/(?:ko|kr)(?<path>\/.*)?$/, '/en$<path>'],

  // Renamed pages
  [new RegExp(`^/(?<locale>${LOCALES})/(?:orange-house|oranged)$`), '/$<locale>/orange'],
  [new RegExp(`^/(?<locale>${LOCALES})/(?<house>${HOUSES})/access$`), '/$<locale>/$<house>'],

  // Removed houses
  [new RegExp(`^/(?<locale>${LOCALES})/(?:banana|melon)(?:/.*)?$`), '/$<locale>'],

  // Removed pages. The old WordPress blog (column, seo-blog, category, date
  // archives, wp-content) is blocked by a Cloudflare WAF rule instead, so
  // crawlers see it gone rather than redirected.
  [
    new RegExp(
      `^/(?<locale>${LOCALES})/(?:location|review|feed|rss|blog|news|about|gallery|rooms|price|prices|access|privacy|terms|link)$`
    ),
    '/$<locale>'
  ],
  [new RegExp(`^/(?<locale>${LOCALES})/(?:reservation|booking|contact-us)$`), '/$<locale>/contact']
]

/** Where a legacy pathname now lives, or `undefined` if it isn't one. */
export function resolveLegacyRedirect(pathname: string): string | undefined {
  for (const [source, destination] of LEGACY_REDIRECTS) {
    const match = source.exec(pathname)
    if (match) {
      return destination.replace(/\$<(\w+)>/g, (_, name: string) => match.groups?.[name] ?? '')
    }
  }
  return undefined
}

/**
 * The supported locale a visitor prefers: their remembered choice first, then
 * the first `Accept-Language` entry that matches a locale exactly or by
 * language (`zh-HK` falls back to the first Chinese locale), else the default.
 */
export function negotiateLocale(
  acceptLanguage: string | null,
  cookieLocale: string | undefined
): Locale {
  const remembered = routing.locales.find((locale) => locale === cookieLocale)
  if (remembered) return remembered

  const requested = (acceptLanguage ?? '')
    .split(',')
    .map((entry) => {
      const [tag = '', ...params] = entry.trim().split(';')
      const quality = params.find((param) => param.trim().startsWith('q='))
      return { tag: tag.toLowerCase(), q: quality ? Number(quality.trim().slice(2)) : 1 }
    })
    .filter(({ tag, q }) => tag && tag !== '*' && q > 0)
    .toSorted((a, b) => b.q - a.q)

  for (const { tag } of requested) {
    const exact = prefixToLocale(tag)
    if (exact) return exact
    const language = tag.split('-')[0]
    const sameLanguage = routing.locales.find((locale) => locale.split('-')[0] === language)
    if (sameLanguage) return sameLanguage
  }
  return routing.defaultLocale
}
