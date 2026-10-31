import { GalleryModalCloseButton } from '@/components/gallery/gallery-back-button'
import { GalleryModal } from '@/components/gallery/gallery-modal'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { validateGallerySearch } from '@/lib/gallery-search'
import { getHouseGallery } from '@/sanity/lib/loaders.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * The gallery as a modal over the house page. Links open it masked as
 * `/gallery` (see `galleryLink`), and a reload or a shared link unmasks to the
 * full page, so this path is never visited on its own.
 */
export const Route = createFileRoute('/$locale/$house/_house/photos')({
  validateSearch: validateGallerySearch,
  beforeLoad: ({ location, params }) => {
    if (!location.maskedLocation) {
      throw redirect({
        to: '/$locale/$house/gallery',
        params,
        search: validateGallerySearch(location.search),
        statusCode: 308
      })
    }
  },
  loader: ({ params: { locale, house } }) => getHouseGallery({ data: { locale, house } }),
  component: GalleryModalRoute
})

function GalleryModalRoute() {
  const { locale, house } = Route.useParams()
  const { photo } = Route.useSearch()
  const data = Route.useLoaderData()
  const navigate = Route.useNavigate()

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
        photo={photo}
        onPhotoNavigate={(nextPhoto, { replace, state }) =>
          void navigate({
            to: '/$locale/$house/photos',
            params: { locale, house },
            search: { photo: nextPhoto },
            // Without its mask, the route would redirect to the full page.
            mask: {
              to: '/$locale/$house/gallery',
              params: { locale, house },
              search: { photo: nextPhoto }
            },
            replace,
            state,
            resetScroll: false,
            // The lightbox runs its own transitions.
            viewTransition: false
          })
        }
      />
    </GalleryModal>
  )
}
