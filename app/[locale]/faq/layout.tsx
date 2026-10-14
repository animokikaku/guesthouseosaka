import { CmsPageLayout, getCmsPageMetadata } from '@/components/cms-page-layout'
import { assets } from '@/lib/assets'
import { sanityFetch } from '@/sanity/lib/live'
import { faqPageMetaQuery, faqPageQuery } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

// Public Sanity content: fail the build if anything here would render per request.
export const ensureStatic = 'navigation'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return getCmsPageMetadata({
    locale,
    meta: sanityFetch({ query: faqPageMetaQuery, params: { locale }, stega: false }).then(
      ({ data }) => data
    ),
    image: assets.openGraph.faq.src,
    fallbackTitle: 'faq_title'
  })
}

export default async function FAQLayout({ children }: LayoutProps<'/[locale]/faq'>) {
  const locale = await getLocale()

  const { data } = await sanityFetch({ query: faqPageQuery, params: { locale } })

  return <CmsPageLayout page={data}>{children}</CmsPageLayout>
}
