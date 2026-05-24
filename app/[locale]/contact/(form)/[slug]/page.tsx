import { ContactForm } from '@/components/forms/contact-form'
import { MoveInForm } from '@/components/forms/move-in-form'
import { TourForm } from '@/components/forms/tour-form'
import { PageEmptyState } from '@/components/page-empty-state'
import { routing } from '@/i18n/routing'
import { staticParamsForLocales } from '@/lib/static-params'
import { toContactFormConfig } from '@/lib/transforms/form'
import { ContactType, ContactTypeSchema } from '@/lib/types'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypeQuery, contactTypeSlugsQuery, housesTitlesQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

const FORM_BY_SLUG = {
  tour: TourForm,
  'move-in': MoveInForm,
  other: ContactForm
} as const satisfies Record<ContactType, typeof TourForm>

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

  return staticParamsForLocales(routing.locales, contactTypes, 'slug')
}

export default async function ContactTypePage({ params }: PageProps<'/[locale]/contact/[slug]'>) {
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

  if (!contactData || !houseTitles || houseTitles.length === 0) {
    return <PageEmptyState />
  }

  // Transform contact type data at page level
  const formConfig = toContactFormConfig(contactData)

  const Form = FORM_BY_SLUG[slug]
  return <Form {...formConfig} houseTitles={houseTitles} />
}
