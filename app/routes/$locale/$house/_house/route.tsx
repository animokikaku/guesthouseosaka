import { HousePageContent } from '@/components/house/house-page-content'
import { jsonLdScript } from '@/components/json-ld'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { canonicalLink, getCanonicalUrl } from '@/lib/metadata'
import { houseJsonLd } from '@/lib/structured-data'
import { getHousePage } from '@/sanity/lib/loaders.functions'
import { stegaClean } from '@sanity/client/stega'
import { createFileRoute, Outlet } from '@tanstack/react-router'

/**
 * The house page. Its `photos` child opens the gallery as a modal over it, so
 * the page stays mounted and loaded while the gallery is open.
 */
export const Route = createFileRoute('/$locale/$house/_house')({
  loader: ({ params: { locale, house } }) => getHousePage({ data: { locale, house } }),
  head: ({ loaderData, params: { locale, house } }) => {
    const href = { pathname: '/[house]', params: { house } } as const
    const data = stegaClean(loaderData?.house)
    return {
      scripts: data ? [jsonLdScript(houseJsonLd(data, house, getCanonicalUrl(href, locale)))] : [],
      links: [canonicalLink(href, locale)]
    }
  },
  component: HouseLayout
})

function HouseLayout() {
  const { house, houses } = Route.useLoaderData()

  return (
    <>
      {house ? <HousePageContent {...house} houses={houses} /> : <PageEmptyStateSection />}
      <Outlet />
    </>
  )
}
