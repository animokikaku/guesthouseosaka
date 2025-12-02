import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { HouseIdentifier } from '@/lib/types'

export async function getHousePhoneLabel(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'useHousePhones' })

  function label(property: HouseIdentifier) {
    return {
      orange: {
        domestic: t('orange.domestic'),
        international: t('orange.international')
      },
      apple: {
        domestic: t('apple.domestic'),
        international: t('apple.international')
      },
      lemon: {
        domestic: t('lemon.domestic'),
        international: t('lemon.international')
      }
    }[property]
  }

  return label
}
