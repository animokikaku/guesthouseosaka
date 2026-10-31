import { assets } from '@/lib/assets'
import { getLocaleHeadData } from '@/lib/locale-head'
import { openGraphMeta, pageMeta } from '@/lib/metadata'
import type { HouseIdentifier } from '@/lib/types'
import { stegaClean } from '@sanity/client/stega'
import type { Locale } from 'use-intl'

/**
 * Title, description and social cards for the `head()` of a house's page or
 * gallery, from the house its own loader fetched; none when the house is missing.
 */
export function houseHeadMeta({
  locale,
  house,
  data,
  matches,
  image = assets.openGraph[house].src
}: {
  locale: Locale
  house: HouseIdentifier
  data: { title: string | null; description: string | null } | null | undefined
  matches: ReadonlyArray<{ routeId: string }>
  /** The social-card image; the house's own card by default. */
  image?: string
}) {
  if (!data) return []

  const { siteName } = getLocaleHeadData(matches)
  const { title, description } = stegaClean({ title: data.title, description: data.description })
  return [
    ...openGraphMeta({ locale, image, siteName }),
    ...pageMeta({ title, description, siteName })
  ]
}
