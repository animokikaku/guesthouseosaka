import { getHouseAndLocale } from '@/app/[locale]/[house]/layout'
import { GalleryModalCloseButton } from '@/components/gallery/gallery-modal-close-button'
import { GalleryModalWrapper } from '@/components/gallery/gallery-modal-wrapper'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyState } from '@/components/page-empty-state'
import { sanityFetch } from '@/sanity/lib/live'
import { houseGalleryQuery } from '@/sanity/lib/queries'

export default async function GalleryModalPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const { data } = await sanityFetch({
    query: houseGalleryQuery,
    params: { locale, slug: house }
  })

  if (!data) {
    return (
      <div className="container-wrapper section-soft flex-1 pb-12">
        <div className="mx-auto w-full max-w-2xl">
          <PageEmptyState />
        </div>
      </div>
    )
  }

  return (
    <GalleryModalWrapper house={house} title={data.title ?? ''}>
      <GalleryPageContent
        documentId={data._id}
        documentType={data._type}
        galleryCategories={data.galleryCategories}
        title={data.title ?? ''}
        backButton={<GalleryModalCloseButton />}
      />
    </GalleryModalWrapper>
  )
}
