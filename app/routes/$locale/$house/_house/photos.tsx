import { GalleryModalCloseButton } from '@/components/gallery/gallery-back-button'
import { GalleryModal } from '@/components/gallery/gallery-modal'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { getHouseGallery } from '@/sanity/lib/loaders.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * The gallery as a modal over the house page. Links open it masked as
 * `/gallery` (see `galleryLink`), and a reload or a shared link unmasks to the
 * full page, so this path is never visited on its own.
 */
export const Route = createFileRoute('/$locale/$house/_house/photos')({
  beforeLoad: ({ location, params }) => {
    if (!location.maskedLocation) {
      throw redirect({ to: '/$locale/$house/gallery', params, statusCode: 308 })
    }
  },
  loader: ({ params: { locale, house } }) => getHouseGallery({ data: { locale, house } }),
  component: GalleryModalRoute
})

function GalleryModalRoute() {
  const { house } = Route.useParams()
  const data = Route.useLoaderData()

  if (!data) {
    return <PageEmptyStateSection />
  }

  return (
    <GalleryModal house={house} title={data.title ?? ''}>
      <GalleryPageContent
        documentId={data._id}
        documentType={data._type}
        galleryCategories={data.galleryCategories}
        title={data.title ?? ''}
        backButton={<GalleryModalCloseButton />}
      />
    </GalleryModal>
  )
}
