import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { assets } from '@/lib/assets'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery, housesNavQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { env } from 'process'
import { Accommodation, WithContext } from 'schema-dts'

export default async function HousePage({
  params
}: PageProps<'/[locale]/[house]'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const [{ data }, { data: houses }] = await Promise.all([
    sanityFetch({ query: houseQuery, params: { locale, slug: house } }),
    sanityFetch({ query: housesNavQuery, params: { locale } })
  ])

  if (!data) {
    notFound()
  }

  const url = `${env.NEXT_PUBLIC_APP_URL}/${house}`

  const jsonLd: WithContext<Accommodation> = {
    '@context': 'https://schema.org',
    '@type': 'House',
    '@id': `${url}#house`,
    url: `${url}/${locale}`,
    name: data.title ?? '',
    description: data.description ?? '',
    image: assets.openGraph[house].src,
    ...(data.map?.coordinates && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.map.coordinates.lat,
        longitude: data.map.coordinates.lng
      }
    }),
    hasMap: data.map?.googleMapsUrl ?? undefined,
    logo: assets.logo[house].src,
    ...(data.map?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.map.address.streetAddress,
        addressLocality: data.map.address.locality,
        postalCode: data.map.address.postalCode,
        addressCountry: data.map.address.country
      }
    }),
    numberOfRooms: data.building?.rooms,
    telephone: data.phone?.international
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
        }}
      />
      <HousePageContent {...data} houses={houses} />
    </>
  )
}
