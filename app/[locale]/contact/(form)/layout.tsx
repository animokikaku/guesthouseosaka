import { ContactNav } from '@/components/contact-nav'
import { PageNav } from '@/components/page-nav'
import { LegalNoticeProvider } from '@/hooks/use-legal-notice'
import { sanityFetch } from '@/sanity/lib/live'
import { contactPageQuery, legalNoticeQuery } from '@/sanity/lib/queries'

export default async function Layout({
  children,
  params
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params

  const [{ data: legalNotice }, { data: contactPage }] = await Promise.all([
    sanityFetch({
      query: legalNoticeQuery,
      params: { locale }
    }),
    sanityFetch({
      query: contactPageQuery,
      params: { locale }
    })
  ])

  if (!contactPage) {
    return null
  }

  const { contactTypes } = contactPage

  return (
    <>
      <PageNav id="tabs">
        <ContactNav contactTypes={contactTypes} />
      </PageNav>
      <LegalNoticeProvider data={legalNotice}>{children}</LegalNoticeProvider>
    </>
  )
}
