import { ContactForm } from '@/components/forms'
import { PageEmptyState } from '@/components/page-empty-state'
import { sanityFetch } from '@/sanity/lib/live'
import { contactTypeQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params
}: PageProps<'/[locale]/contact/other'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: contactTypeQuery,
    params: { locale, type: 'general' }
  })

  if (!data) {
    return <PageEmptyState />
  }

  const { title, description } = data

  return <ContactForm title={title} description={description} />
}
