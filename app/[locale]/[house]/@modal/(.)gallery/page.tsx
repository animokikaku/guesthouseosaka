import { hasHouse } from '@/app/[locale]/[house]/layout'
import {
  GalleryModalCloseButton,
  GalleryModalWrapper
} from '@/components/gallery/gallery-modal-wrapper'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyState } from '@/components/page-empty-state'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function GalleryModalPage({
  params
}: PageProps<'/[locale]/[house]/gallery'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const { data } = await sanityFetch({
    query: houseQuery,
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
    <GalleryModalWrapper title={data.title ?? ''}>
      <GalleryPageContent
        documentId={data._id}
        documentType={data._type}
        gallery={data.gallery}
        title={data.title ?? ''}
        backButton={<GalleryModalCloseButton />}
      />
    </GalleryModalWrapper>
  )
}
