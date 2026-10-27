import { CmsPageLayout, cmsPageHead } from '@/components/cms-page-layout'
import { assets } from '@/lib/assets'
import { getContactLayout } from '@/sanity/lib/loaders.functions'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/$locale/contact')({
  loader: ({ params: { locale } }) => getContactLayout({ data: { locale } }),
  head: ({ loaderData, matches, params: { locale } }) => ({
    meta: cmsPageHead({
      locale,
      meta: loaderData?.page,
      image: assets.openGraph.contact.src,
      fallbackTitle: 'contact_title',
      matches
    })
  }),
  component: ContactLayout
})

function ContactLayout() {
  const { page } = Route.useLoaderData()

  return (
    <CmsPageLayout page={page}>
      <Outlet />
    </CmsPageLayout>
  )
}
