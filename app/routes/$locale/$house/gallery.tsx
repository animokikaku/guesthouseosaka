import { GalleryPageBackLink } from '@/components/gallery/gallery-back-button'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { GalleryShell } from '@/components/gallery/gallery-shell'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { houseHeadMeta } from '@/lib/house-head'
import { canonicalLink } from '@/lib/metadata'
import { getHouseGallery } from '@/sanity/lib/loaders.functions'
import { createFileRoute } from '@tanstack/react-router'

/** The gallery as its own page, for direct visits; the house page opens it as a modal. */
export const Route = createFileRoute('/$locale/$house/gallery')({
  loader: ({ params: { locale, house } }) => getHouseGallery({ data: { locale, house } }),
  head: ({ loaderData, matches, params: { locale, house } }) => ({
    meta: houseHeadMeta({ locale, house, data: loaderData, matches }),
    links: [canonicalLink({ to: '/$locale/$house/gallery', params: { house } }, locale)]
  }),
  component: GalleryPage
})

function GalleryPage() {
  const { house } = Route.useParams()
  const data = Route.useLoaderData()

  if (!data) {
    return <PageEmptyStateSection />
  }

  return (
    <GalleryShell className="fixed inset-0 z-60">
      <GalleryPageContent
        documentId={data._id}
        documentType={data._type}
        galleryCategories={data.galleryCategories}
        title={data.title ?? ''}
        backButton={<GalleryPageBackLink house={house} />}
      />
    </GalleryShell>
  )
}
