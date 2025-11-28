import { HousePageContent } from '@/components/house'
import { HouseIdentifier } from '@/lib/types'
import { Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)
  setRequestLocale(locale as Locale)

  const houseId = house as HouseIdentifier

  const t = useTranslations('houses')

  const { title, description } = {
    orange: {
      title: t('orange.name'),
      description: t('orange.summary')
    },
    apple: {
      title: t('apple.name'),
      description: t('apple.summary')
    },
    lemon: {
      title: t('lemon.name'),
      description: t('lemon.summary')
    }
  }[houseId]

  return (
    <HousePageContent
      houseId={houseId}
      title={title}
      description={description}
    />
  )
}
