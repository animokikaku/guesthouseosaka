import { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'

type HouseLabels = Record<
  HouseIdentifier,
  {
    name: string
    summary: string
    caption: string
  }
>

export function useHouseLabels(): HouseLabels {
  const t = useTranslations('useHouseLabels')

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
