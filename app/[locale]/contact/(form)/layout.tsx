import { ContactNav } from '@/components/contact-nav'
import { PageNav } from '@/components/page-nav'
import { LegalNoticeProvider } from '@/hooks/use-legal-notice'
import { sanityFetch } from '@/sanity/lib/live'
import { legalNoticeQuery } from '@/sanity/lib/queries'

export default async function Layout({
  children,
  params
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params

  const { data } = await sanityFetch({
    query: legalNoticeQuery,
    params: { locale }
  })

  return (
    <>
      <PageNav id="tabs">
        <ContactNav />
      </PageNav>
      <LegalNoticeProvider data={data}>{children}</LegalNoticeProvider>
    </>
  )
}
