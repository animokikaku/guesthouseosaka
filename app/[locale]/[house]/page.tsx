import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { BUILDING_DATA } from '@/components/house/house-building'
import {
  GOOGLE_MAPS_URLS,
  HOUSE_ADDRESS,
  HOUSE_CENTERS
} from '@/components/map/location-map-constants'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useHousePhones } from '@/hooks/use-house-phones'
import { assets } from '@/lib/assets'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { env } from 'process'
import { use } from 'react'
import { Accommodation, WithContext } from 'schema-dts'

export default function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = use(params)
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const houseLabel = useHouseLabels()
  const housePhonesLabel = useHousePhones()
  const { name: title, summary: description } = houseLabel(house)

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
    numberOfRooms: BUILDING_DATA[house].rooms,
    telephone: housePhonesLabel(house).international
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
