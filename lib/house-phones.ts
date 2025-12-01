import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { HouseIdentifier } from '@/lib/types'

type HousePhones = Record<
  HouseIdentifier,
  { domestic: string; international: string }
>

export async function getHousePhones(locale: Locale): Promise<HousePhones> {
  const t = await getTranslations({ locale, namespace: 'useHousePhones' })

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
  }
}
