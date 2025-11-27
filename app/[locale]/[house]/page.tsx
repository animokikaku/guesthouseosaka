import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { use } from 'react'

export default function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)
  setRequestLocale(locale as Locale)

  if (!hasHouse(house)) {
    notFound()
  }

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
  }[house]

  return (
    <HousePageContent houseId={house} title={title} description={description} />
  )
}
