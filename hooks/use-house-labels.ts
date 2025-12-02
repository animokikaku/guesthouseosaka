import { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'

export function useHouseLabels() {
  const t = useTranslations('useHouseLabels')

  function label(house: HouseIdentifier) {
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
    }[house]
  }

  return label
}
