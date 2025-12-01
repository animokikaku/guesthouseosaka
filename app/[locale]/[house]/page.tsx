import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import {
  GOOGLE_MAPS_URLS,
  HOUSE_ADDRESS,
  HOUSE_CENTERS
} from '@/components/map/location-map-constants'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useHousePhones } from '@/hooks/use-house-phones'
import { assets } from '@/lib/assets'
import { HouseIdentifier } from '@/lib/types'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { env } from 'process'
import { use } from 'react'
import { Accommodation, WithContext } from 'schema-dts'

const NUMBER_OF_ROOMS: Record<HouseIdentifier, number> = {
  orange: 30,
  apple: 24,
  lemon: 20
}

export default function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)
  setRequestLocale(locale as Locale)

  if (!hasHouse(house)) {
    notFound()
  }

  const houses = useHouseLabels()
  const phones = useHousePhones()
  const { name: title, summary: description } = houses[house]

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
    numberOfRooms: NUMBER_OF_ROOMS[house],
    telephone: phones[house].international
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
