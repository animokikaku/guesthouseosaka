import { FAQAccordion } from '@/app/[locale]/faq/(components)/faq-accordion'
import FAQCard from '@/app/[locale]/faq/(components)/faq-card'
import { PageEmptyState } from '@/components/page-empty-state'
import { sanityFetch } from '@/sanity/lib/live'
import {
  faqPageQuery,
  faqQuestionsQuery,
  housesBuildingQuery,
  pricingCategoriesQuery
} from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function FAQPage({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const [
    { data: housesBuilding },
    { data: faqPage },
    { data: pricingCategories },
    { data: faqQuestions }
  ] = await Promise.all([
    sanityFetch({
      query: housesBuildingQuery,
      params: { locale }
    }),
    sanityFetch({
      query: faqPageQuery,
      params: { locale }
    }),
    sanityFetch({
      query: pricingCategoriesQuery,
      params: { locale }
    }),
    sanityFetch({
      query: faqQuestionsQuery,
      params: { locale }
    })
  ])

  if (!faqQuestions?.length) {
    return <PageEmptyState />
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      <FAQAccordion
        faqQuestions={faqQuestions}
        pricingCategories={pricingCategories}
        housesBuilding={housesBuilding}
      />
      <FAQCard
        contactSection={faqPage?.contactSection}
        contactNote={faqPage?.contactNote}
        houses={housesBuilding}
      />
    </section>
  )
}
