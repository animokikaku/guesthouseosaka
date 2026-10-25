import { LocaleNotFound } from '@/components/locale-not-found'
import { assets } from '@/lib/assets'
import { getLocaleHeadData } from '@/lib/locale-head'
import { openGraphMeta, pageMeta } from '@/lib/metadata'
import { isHouseIdentifier } from '@/lib/types'
import { getHouseMeta } from '@/sanity/lib/loaders.functions'
import { stegaClean } from '@sanity/client/stega'
import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/$house')({
  params: {
    parse: ({ house }) => (isHouseIdentifier(house) ? { house } : false),
    stringify: ({ house }) => ({ house })
  },
  // A layout still matches when `parse` rejects its param (only leaf routes
  // fall through), so an unknown house throws its own 404. It renders here,
  // inside the locale layout; left to the locale route, it would replace it.
  beforeLoad: ({ params }) => {
    if (!isHouseIdentifier(params.house)) throw notFound()
  },
  notFoundComponent: LocaleNotFound,
  loader: ({ params: { locale, house } }) => getHouseMeta({ data: { locale, house } }),
  head: ({ loaderData, matches, params: { locale, house } }) => {
    const { siteName } = getLocaleHeadData(matches)
    const meta = stegaClean(loaderData)
    return {
      meta: meta
        ? [
            ...openGraphMeta({ locale, image: assets.openGraph[house].src, siteName }),
            ...pageMeta({ title: meta.title, description: meta.description, siteName })
          ]
        : []
    }
  }
})
