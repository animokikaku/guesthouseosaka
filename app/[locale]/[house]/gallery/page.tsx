import { hasHouse } from '@/app/[locale]/[house]/layout'
import { HouseGallery } from '@/components/gallery/house-gallery'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery } from '@/sanity/lib/queries'
import { ArrowLeftIcon } from 'lucide-react'
import { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function GalleryPage({
  params
}: PageProps<'/[locale]/[house]/gallery'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)
  const t = await getTranslations('GalleryPage')

  const { data } = await sanityFetch({
    query: houseQuery,
    params: { locale, slug: house }
  })

  if (!data) {
    notFound()
  }

  return (
    <div className="bg-background text-foreground fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <div className="shrink-0 p-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={{ pathname: '/[house]', params: { house } }}>
              <ArrowLeftIcon className="size-6" />
              <span className="sr-only">{t('close')}</span>
            </Link>
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="container-wrapper">
            <div className="container py-8 md:py-12">
              <HouseGallery galleryByCategory={data.galleryByCategory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
