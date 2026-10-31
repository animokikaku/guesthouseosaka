import { ContactNav } from '@/components/contact/contact-nav'
import { LegalNoticeProvider } from '@/components/legal-notice-context'
import { PageNav } from '@/components/page-nav'
import { toContactNavItems } from '@/lib/transforms/nav'
import { getLegalNotice } from '@/sanity/lib/loaders.functions'
import { createFileRoute, getRouteApi, Outlet } from '@tanstack/react-router'

const contactLayout = getRouteApi('/$locale/contact')

/** The contact forms' tabs and the legal notice their consent checkbox opens. */
export const Route = createFileRoute('/$locale/contact/_form')({
  loader: ({ params: { locale } }) => getLegalNotice({ data: { locale } }),
  component: ContactFormLayout
})

function ContactFormLayout() {
  const legalNotice = Route.useLoaderData()
  // The tabs list the contact types the section layout already loaded.
  const contactTypes = contactLayout.useLoaderData({ select: (data) => data.contactTypes })

  return (
    <>
      <PageNav id="tabs">
        <ContactNav items={toContactNavItems(contactTypes)} />
      </PageNav>
      <LegalNoticeProvider data={legalNotice}>
        <Outlet />
      </LegalNoticeProvider>
    </>
  )
}
