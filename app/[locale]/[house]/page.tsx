import { validateParams } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { getExtracted, setRequestLocale } from 'next-intl/server'

export default async function HousePage({
  params
}: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = await validateParams(params)
  setRequestLocale(locale)

  const t = await getExtracted()

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
