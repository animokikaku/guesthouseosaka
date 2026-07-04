import { Formats, hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import * as rootParams from 'next/root-params'
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

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale()

    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue
    } else {
      notFound()
    }
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Tokyo',
    formats
  }
})
