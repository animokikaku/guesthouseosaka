import { FAQAccordion } from '@/app/[locale]/faq/(components)/faq-accordion'
import FAQCard from '@/app/[locale]/faq/(components)/faq-card'
import { sanityFetch } from '@/sanity/lib/live'
import { faqPageQuery, housesBuildingQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

export default async function FAQPage({ params }: PageProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)

  const [{ data: housesBuilding }, { data: faqPage }] = await Promise.all([
    sanityFetch({
      query: housesBuildingQuery,
      params: { locale }
    }),
    sanityFetch({
      query: faqPageQuery,
      params: { locale }
    })
  ])

  if (!faqPage) return null

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      <FAQAccordion
        faqPage={{
          _id: faqPage._id,
          _type: faqPage._type,
          items: faqPage.items
        }}
        housesBuilding={housesBuilding}
      />
      <FAQCard
        contactSection={faqPage.contactSection}
        contactNote={faqPage.contactNote}
        houses={housesBuilding}
      />
    </section>
  )
}
