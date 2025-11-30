import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import {
  GOOGLE_MAPS_URLS,
  HOUSE_ADDRESS,
  HOUSE_CENTERS
} from '@/components/map/location-map-constants'
import { assets } from '@/lib/assets'
import { Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { env } from 'process'
import { use } from 'react'
import { Accommodation, WithContext } from 'schema-dts'

export default function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)
  setRequestLocale(locale as Locale)

  if (!hasHouse(house)) {
    notFound()
  }

  const t = useTranslations()

  const { title, description, telephone, numberOfRooms } = {
    orange: {
      title: t('houses.orange.name'),
      description: t('houses.orange.summary'),
      telephone: t(`faq.contact.phones.orange.international`),
      numberOfRooms: 30
    },
    apple: {
      title: t('houses.apple.name'),
      description: t('houses.apple.summary'),
      telephone: t(`faq.contact.phones.apple.international`),
      numberOfRooms: 24
    },
    lemon: {
      title: t('houses.lemon.name'),
      description: t('houses.lemon.summary'),
      telephone: t(`faq.contact.phones.lemon.international`),
      numberOfRooms: 12
    }
  }[house]

  const url = `${env.NEXT_PUBLIC_APP_URL}/${house}`

  const jsonLd: WithContext<Accommodation> = {
    '@context': 'https://schema.org',
    '@type': 'House',
    '@id': `${url}#house`,
    url,
    name: title,
    description,
    image: assets.openGraph[house].src,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: HOUSE_CENTERS[house].lat,
      longitude: HOUSE_CENTERS[house].lng
    },
    hasMap: GOOGLE_MAPS_URLS[house],
    logo: assets.logo[house].src,
    address: HOUSE_ADDRESS[house],
    numberOfRooms,
    telephone
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />
      <HousePageContent
        houseId={house}
        title={title}
        description={description}
      />
    </>
  )
}
