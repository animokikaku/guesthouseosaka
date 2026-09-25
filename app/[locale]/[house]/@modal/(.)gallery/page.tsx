import { GalleryModalCloseButton } from '@/components/gallery/gallery-modal-close-button'
import { GalleryModalWrapper } from '@/components/gallery/gallery-modal-wrapper'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyStateSection } from '@/components/page-empty-state'
import { getHouseAndLocale } from '@/lib/house-params'
import { sanityFetch } from '@/sanity/lib/live'
import { houseGalleryQuery } from '@/sanity/lib/queries'

export default async function GalleryModalPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { house, locale } = await getHouseAndLocale(params)

  const { data } = await sanityFetch({
    query: houseGalleryQuery,
    params: { locale, slug: house }
  })

  if (!data) {
    return <PageEmptyStateSection />
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
