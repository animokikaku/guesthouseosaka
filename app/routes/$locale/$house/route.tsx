import { LocaleNotFound } from '@/components/locale-not-found'
import { isHouseIdentifier } from '@/lib/types'
import { createFileRoute, notFound } from '@tanstack/react-router'

/**
 * A house's section. It loads nothing itself: the house page and the gallery
 * set their own title and description, from the house their loaders fetch.
 */
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
  notFoundComponent: LocaleNotFound
})
