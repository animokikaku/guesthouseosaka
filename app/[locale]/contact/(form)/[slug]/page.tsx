import { ContactForm, MoveInForm, TourForm } from '@/components/forms'
import { PageEmptyState } from '@/components/page-empty-state'
import { routing } from '@/i18n/routing'
import { ContactType, ContactTypeSchema } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/live'
import {
  contactTypeQuery,
  contactTypeSlugsQuery,
  housesTitlesQuery
} from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function hasContactType(slug: string): slug is ContactType {
  return ContactTypeSchema.safeParse(slug).success
}

export async function generateStaticParams() {
  const { data: contactTypes } = await sanityFetch({
    query: contactTypeSlugsQuery,
    perspective: 'published',
    stega: false
  })

  if (contactTypes.length === 0) {
    return []
  }

  return routing.locales.flatMap((locale) =>
    contactTypes.map(({ slug }) => ({ locale, slug }))
  )
}

export default async function ContactTypePage({
  params
}: PageProps<'/[locale]/contact/[slug]'>) {
  const { locale, slug } = await params
  setRequestLocale(locale as Locale)

  if (!hasContactType(slug)) {
    notFound()
  }

  // Fetch contact type data and house titles in parallel
  const [{ data: contactData }, { data: houseTitles }] = await Promise.all([
    sanityFetch({
      query: contactTypeQuery,
      params: { locale, slug }
    }),
    sanityFetch({
      query: housesTitlesQuery,
      params: { locale }
    })
  ])

  if (!contactData) {
    return <PageEmptyState />
  }

  const { title, description } = contactData

  // Render the appropriate form based on slug
  switch (slug) {
    case 'tour':
      if (!houseTitles || houseTitles.length === 0) {
        return <PageEmptyState />
      }
      return (
        <TourForm
          title={title}
          description={description}
          houseTitles={houseTitles}
        />
      )

    case 'move-in':
      if (!houseTitles || houseTitles.length === 0) {
        return <PageEmptyState />
      }
      return (
        <MoveInForm
          title={title}
          description={description}
          houseTitles={houseTitles}
        />
      )

    case 'other':
      return <ContactForm title={title} description={description} />

    default:
      notFound()
  }
}
