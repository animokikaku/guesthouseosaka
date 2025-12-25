import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HouseGallery } from '@/components/gallery/house-gallery'
import { GalleryModalWrapper } from '@/components/gallery/gallery-modal-wrapper'
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
    notFound()
  }

  return (
    <GalleryModalWrapper>
      <HouseGallery categories={data.galleryCategories} images={data.galleryImages} />
    </GalleryModalWrapper>
  )
}
