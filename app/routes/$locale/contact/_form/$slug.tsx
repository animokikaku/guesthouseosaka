import { ContactForm } from '@/components/forms/contact-form'
import { MoveInForm } from '@/components/forms/move-in-form'
import { TourForm } from '@/components/forms/tour-form'
import { PageEmptyState } from '@/components/page-empty-state'
import { canonicalLink } from '@/lib/metadata'
import { toContactFormConfig } from '@/lib/transforms/form'
import { isContactType, type ContactType } from '@/lib/types'
import { getContactType } from '@/sanity/lib/loaders.functions'
import { createFileRoute } from '@tanstack/react-router'

const FORM_BY_SLUG = {
  tour: TourForm,
  'move-in': MoveInForm,
  other: ContactForm
} as const satisfies Record<ContactType, typeof TourForm>

export const Route = createFileRoute('/$locale/contact/_form/$slug')({
  // An unknown contact type doesn't match, so the locale layout's 404 renders.
  params: {
    parse: ({ slug }) => (isContactType(slug) ? { slug } : false),
    stringify: ({ slug }) => ({ slug })
  },
  loader: ({ params: { locale, slug } }) => getContactType({ data: { locale, slug } }),
  head: ({ params: { locale, slug } }) => ({
    links: [canonicalLink({ pathname: '/contact/[slug]', params: { slug } }, locale)]
  }),
  component: ContactTypePage
})

function ContactTypePage() {
  const { slug } = Route.useParams()
  const { contactType, houseTitles } = Route.useLoaderData()

  if (!contactType || !houseTitles || houseTitles.length === 0) {
    return <PageEmptyState />
  }

  const Form = FORM_BY_SLUG[slug]
  return <Form {...toContactFormConfig(contactType)} houseTitles={houseTitles} />
}
