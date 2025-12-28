import { MoveInForm } from '@/components/forms'
import { PageEmptyState } from '@/components/page-empty-state'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypeQuery, housesTitlesQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact/move-in'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const [{ data: contactData }, { data: houseTitles }] = await Promise.all([
    sanityFetch({
      query: contactTypeQuery,
      params: { locale, type: 'move-in' }
    }),
    sanityFetch({
      query: housesTitlesQuery,
      params: { locale }
    })
  ])

  if (!contactData || !houseTitles || houseTitles.length === 0) {
    return <PageEmptyState />
  }

  const { title, description } = contactData

  return (
    <MoveInForm
      title={title}
      description={description}
      houseTitles={houseTitles}
    />
  )
}
