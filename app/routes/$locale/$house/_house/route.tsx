import { HousePageContent } from '@/components/house/house-page-content'
import { jsonLdScript } from '@/components/json-ld'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { houseHeadMeta } from '@/lib/house-head'
import { canonicalLink, getCanonicalUrl } from '@/lib/metadata'
import { houseJsonLd } from '@/lib/structured-data'
import { getHousePage } from '@/sanity/lib/loaders.functions'
import { stegaClean } from '@sanity/client/stega'
import { createFileRoute, getRouteApi, Outlet } from '@tanstack/react-router'

/**
 * The house page. Its `photos` child opens the gallery as a modal over it, so
 * the page stays mounted and loaded while the gallery is open.
 */
export const Route = createFileRoute('/$locale/$house/_house')({
  loader: ({ params: { locale, house } }) => getHousePage({ data: { locale, house } }),
  head: ({ loaderData, matches, params: { locale, house } }) => {
    const href = { to: '/$locale/$house', params: { house } } as const
    const data = stegaClean(loaderData?.house)
    return {
      meta: houseHeadMeta({ locale, house, data, matches }),
      scripts: data ? [jsonLdScript(houseJsonLd(data, house, getCanonicalUrl(href, locale)))] : [],
      links: [canonicalLink(href, locale)]
    }
  },
  component: HouseLayout
})

const localeRoute = getRouteApi('/$locale')

function HouseLayout() {
  const { house, roomCounts } = Route.useLoaderData()
  const { houseTitles } = localeRoute.useLoaderData()

  return (
    <>
      {house ? (
        <HousePageContent {...house} houses={houseTitles} roomCounts={roomCounts} />
      ) : (
        <PageEmptyStateSection />
      )}
      <Outlet />
    </>
  )
}
