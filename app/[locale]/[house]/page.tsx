import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { Locale, useExtracted } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { use } from 'react'

export default function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)
  setRequestLocale(locale as Locale)

  if (!hasHouse(house)) {
    notFound()
  }

  const t = useExtracted()

  const { title, description } = {
    orange: {
      title: t('Orange House'),
      description: t('Relaxed spacious Japanese-style lounge')
    },
    apple: {
      title: t('Apple House'),
      description: t('Share house 8 minutes walk from Namba Station')
    },
    lemon: {
      title: t('Lemon House'),
      description: t('Well-equipped private rooms and a luxurious lounge')
    }
  }[house]

  return (
    <HousePageContent houseId={house} title={title} description={description} />
  )
}
