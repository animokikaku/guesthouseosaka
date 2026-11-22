import { ContactForm } from '@/components/forms/contact-form'
import { MoveInForm } from '@/components/forms/move-in-form'
import { TourForm } from '@/components/forms/tour-form'
import { PageEmptyState } from '@/components/page-empty-state'
import { canonicalLink } from '@/lib/metadata'
import { toContactFormConfig } from '@/lib/transforms/form'
import { isContactType } from '@/lib/types'
import { getContactType } from '@/sanity/lib/loaders.functions'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/contact/_form/$slug')({
  // An unknown contact type doesn't match, so the locale layout's 404 renders.
  params: {
    parse: ({ slug }) => (isContactType(slug) ? { slug } : false),
    stringify: ({ slug }) => ({ slug })
  },
  // `?room=orange-208` (see `roomKey`): the room a house page's link asks to
  // move into. The move-in form checks it against the rooms on offer.
  validateSearch: (search: Record<string, unknown>): { room?: string } =>
    typeof search.room === 'string' ? { room: search.room } : {},
  loader: ({ params: { locale, slug } }) => getContactType({ data: { locale, slug } }),
  head: ({ params: { locale, slug } }) => ({
    links: [canonicalLink({ to: '/$locale/contact/$slug', params: { slug } }, locale)]
  }),
  component: ContactTypePage
})

const localeRoute = getRouteApi('/$locale')

function ContactTypePage() {
  const { slug } = Route.useParams()
  const { room } = Route.useSearch()
  const { contactType, rooms } = Route.useLoaderData()
  const { houseTitles, settings } = localeRoute.useLoaderData()

  if (!contactType || houseTitles.length === 0) {
    return <PageEmptyState />
  }

  const config = toContactFormConfig(contactType)
  switch (slug) {
    case 'tour':
      return <TourForm {...config} houseTitles={houseTitles} />
    case 'move-in':
      return (
        <MoveInForm
          {...config}
          houseTitles={houseTitles}
          // Site Settings' Room Availability field, which draft mode previews.
          rooms={settings?.roomAvailability ? rooms : null}
          room={room}
        />
      )
    case 'other':
      return <ContactForm {...config} houseTitles={houseTitles} />
  }
}
