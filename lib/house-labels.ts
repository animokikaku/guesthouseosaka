import { HouseIdentifier } from '@/lib/types'
import { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

type HouseLabels = Record<
  HouseIdentifier,
  { name: string; summary: string; caption: string }
>

export async function getHouseLabels(locale: Locale): Promise<HouseLabels> {
  const t = await getTranslations({ locale, namespace: 'useHouseLabels' })

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
  }
}
