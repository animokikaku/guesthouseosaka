import { ContactNav } from '@/components/contact-nav'
import { PageNav } from '@/components/page-nav'
import { LegalNoticeProvider } from '@/hooks/use-legal-notice'
import { toContactNavItems } from '@/lib/transforms/nav'
import { getContactPage } from '@/sanity/lib/cached-queries'
import { sanityFetch } from '@/sanity/lib/live'
import { legalNoticeQuery } from '@/sanity/lib/queries'
import { getLocale } from 'next-intl/server'

export default async function Layout({ children }: LayoutProps<'/[locale]/contact'>) {
  const locale = await getLocale()

  const [{ data: legalNotice }, { data: contactPage }] = await Promise.all([
    sanityFetch({
      query: legalNoticeQuery,
      params: { locale }
    }),
    getContactPage(locale)
  ])

  const navItems = toContactNavItems(contactPage.contactTypes)

  return (
    <>
      <PageNav id="tabs">
        <ContactNav items={navItems} />
      </PageNav>
      <LegalNoticeProvider data={legalNotice}>{children}</LegalNoticeProvider>
    </>
  )
}
