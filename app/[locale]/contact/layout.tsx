import { CmsPageLayout, getCmsPageMetadata } from '@/components/cms-page-layout'
import { assets } from '@/lib/assets'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageMetaQuery, contactPageQuery } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'

// Public Sanity content: fail the build if anything here would render per request.
export const ensureStatic = 'navigation'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  return getCmsPageMetadata({
    locale,
    meta: sanityFetch({ query: contactPageMetaQuery, params: { locale }, stega: false }).then(
      ({ data }) => data
    ),
    image: assets.openGraph.contact.src,
    fallbackTitle: 'contact_title'
  })
}

export default async function ContactLayout({ children }: LayoutProps<'/[locale]/contact'>) {
  const locale = await getLocale()

  const { data } = await sanityFetch({ query: contactPageQuery, params: { locale } })

  return <CmsPageLayout page={data?.page ?? null}>{children}</CmsPageLayout>
}
