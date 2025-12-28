import { TourForm } from '@/components/forms'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypeQuery, housesTitlesQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact/tour'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const [{ data: contactData }, { data: houseTitles }] = await Promise.all([
    sanityFetch({
      query: contactTypeQuery,
      params: { locale, type: 'tour' }
    }),
    sanityFetch({
      query: housesTitlesQuery,
      params: { locale }
    })
  ])

  return (
    <TourForm content={contactData?.content} houseTitles={houseTitles ?? []} />
  )
}
