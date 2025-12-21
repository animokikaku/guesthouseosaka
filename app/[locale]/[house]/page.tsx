import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HousePageContent } from '@/components/house'
import { assets } from '@/lib/assets'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery } from '@/sanity/lib/queries'
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

  const { data } = await sanityFetch({
    query: houseQuery,
    params: { locale, slug: house }
  })

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
    geo: data.location?.coordinates
      ? {
          '@type': 'GeoCoordinates',
          latitude: data.location.coordinates.lat,
          longitude: data.location.coordinates.lng
        }
      : undefined,
    hasMap: data.location?.googleMapsUrl ?? undefined,
    logo: assets.logo[house].src,
    address: data.location?.address ?? undefined,
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
      <HousePageContent data={data} />
    </>
  )
}
