import { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'

type HousePhones = Record<
  HouseIdentifier,
  { domestic: string; international: string }
>

export function useHousePhones(): HousePhones {
  const t = useTranslations('useHousePhones')

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
