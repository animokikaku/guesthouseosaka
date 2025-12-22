import { FAQAccordion } from '@/app/[locale]/faq/(components)/faq-accordion'
import FAQCard from '@/app/[locale]/faq/(components)/faq-card'
import { sanityFetch } from '@/sanity/lib/live'
import { housesBuildingQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function FAQPage({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const { data: housesBuilding } = await sanityFetch({
    query: housesBuildingQuery,
    params: { locale }
  })

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      <FAQAccordion housesBuilding={housesBuilding} />
      <FAQCard />
    </section>
  )
}
