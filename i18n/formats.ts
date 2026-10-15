import type { Formats } from 'next-intl'

/** Named formats shared by the request config and the unit tests' translator. */
export const formats = {
  number: {
    currency: {
      style: 'currency',
      currency: 'JPY'
    }
  }
} satisfies Formats

/** Every page talks about Osaka, so dates and "today" are always Tokyo time. */
export const timeZone = 'Asia/Tokyo'
