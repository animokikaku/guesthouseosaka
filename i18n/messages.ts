import type { Locale, Messages } from 'use-intl'
import { formats, timeZone } from './formats'

/** The catalog for a locale, precompiled at build time by `vite.config.ts`. */
export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await import(`../messages/${locale}.json`)).default
}

/** Everything `IntlProvider` and `createTranslator` need besides the catalog. */
export const intlConfig = { timeZone, formats } as const
