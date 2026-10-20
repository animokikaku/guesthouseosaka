import { HousePageContent } from '@/components/house/house-page-content'
import { JsonLd } from '@/components/json-ld'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { tokyoToday } from '@/lib/availability'
import { getHouseAndLocale } from '@/lib/house-params'
import { getCanonicalMetadata, getCanonicalUrl } from '@/lib/metadata'
import { houseJsonLd } from '@/lib/structured-data'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery, housesTitlesQuery } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { cacheLife } from 'next/cache'

// instant = false: kept on purpose, the whole page depends on the house, so there is
// no shared App Shell worth prefetching. Links here use `prefetch` to load the
// full static page.
export const instant = false

// Room statuses roll over at midnight in Osaka without anyone editing them, so the
// page refreshes hourly on top of the content-driven revalidation.
async function getToday() {
  'use cache'
  cacheLife('hours')
  return tokyoToday()
}

export async function generateMetadata({
  params
}: PageProps<'/[locale]/[house]'>): Promise<Metadata> {
  const { house, locale } = await getHouseAndLocale(params)
  return {
    alternates: getCanonicalMetadata({ pathname: '/[house]', params: { house } }, locale)
  }
}

export default async function HousePage({ params }: PageProps<'/[locale]/[house]'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const [{ data }, { data: houses }, today] = await Promise.all([
    sanityFetch({ query: houseQuery, params: { locale, slug: house } }),
    sanityFetch({ query: housesTitlesQuery, params: { locale } }),
    getToday()
  ])

  if (!data) {
    return <PageEmptyStateSection />
  }

  const url = getCanonicalUrl({ pathname: '/[house]', params: { house } }, locale)

  return (
    <>
      <JsonLd data={houseJsonLd(data, house, url)} />
      <HousePageContent {...data} houses={houses} today={today} />
    </>
  )
}
