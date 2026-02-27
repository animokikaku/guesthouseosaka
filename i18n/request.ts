import { Formats, hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export const formats = {
  number: {
    currency: {
      style: 'currency',
      currency: 'JPY'
    },
    minute: {
      style: 'unit',
      unit: 'minute'
    }
  }
} satisfies Formats

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Tokyo',
    formats
  }
})
