import { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'

export function useHousePhones() {
  const t = useTranslations('useHousePhones')

  function label(house: HouseIdentifier) {
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
    }[house]
  }

  return label
}
