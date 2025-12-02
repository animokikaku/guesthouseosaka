import { HouseIdentifier } from '@/lib/types'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

export async function getHouseLabel(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'useHouseLabels' })

  function label(property: HouseIdentifier) {
    return {
      orange: {
        name: t('orange.name'),
        summary: t('orange.summary'),
        caption: t('orange.caption')
      },
      apple: {
        name: t('apple.name'),
        summary: t('apple.summary'),
        caption: t('apple.caption')
      },
      lemon: {
        name: t('lemon.name'),
        summary: t('lemon.summary'),
        caption: t('lemon.caption')
      }
    }[property]
  }
  return label
}
