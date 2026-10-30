import { CmsPageLayout, cmsPageHead } from '@/components/cms-page-layout'
import { PageEmptyState } from '@/components/page-empty-state'
import { FAQAccordion } from '@/components/faq/faq-accordion'
import FAQCard from '@/components/faq/faq-card'
import { assets } from '@/lib/assets'
import { canonicalLink } from '@/lib/metadata'
import { getFaqPage } from '@/sanity/lib/loaders.functions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/faq')({
  loader: ({ params: { locale } }) => getFaqPage({ data: { locale } }),
  head: ({ loaderData, matches, params: { locale } }) => ({
    meta: cmsPageHead({
      locale,
      meta: loaderData?.page,
      image: assets.openGraph.faq.src,
      fallbackTitle: 'faq_title',
      matches
    }),
    links: [canonicalLink({ to: '/$locale/faq' }, locale)]
  }),
  component: FAQPage
})

function FAQPage() {
  const { page, housesBuilding, pricingCategories, faqQuestions } = Route.useLoaderData()

  return (
    <CmsPageLayout page={page}>
      {faqQuestions?.length ? (
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-12">
          <FAQAccordion
            faqQuestions={faqQuestions}
            pricingCategories={pricingCategories}
            housesBuilding={housesBuilding}
          />
          <FAQCard
            contactSection={page?.contactSection}
            contactNote={page?.contactNote}
            houses={housesBuilding}
          />
        </section>
      ) : (
        <PageEmptyState />
      )}
    </CmsPageLayout>
  )
}
