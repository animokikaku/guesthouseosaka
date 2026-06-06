import { hasHouse } from '@/app/[locale]/[house]/layout'
import { GalleryPageContent } from '@/components/gallery/gallery-page-content'
import { PageEmptyState } from '@/components/page-empty-state'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { houseQuery } from '@/sanity/lib/queries'
import { ArrowLeftIcon } from 'lucide-react'
import { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export default async function GalleryPage({ params }: PageProps<'/[locale]/[house]/gallery'>) {
  const { locale, house } = await params
  if (!hasHouse(house)) {
    notFound()
  }

  setRequestLocale(locale as Locale)

  const [t, { data }] = await Promise.all([
    getTranslations('GalleryPage'),
    sanityFetch({ query: houseQuery, params: { locale, slug: house } })
  ])

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
    <div className="bg-background text-foreground fixed inset-0 z-50 flex h-full w-full flex-col overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <GalleryPageContent
          documentId={data._id}
          documentType={data._type}
          galleryCategories={data.galleryCategories}
          title={data.title ?? ''}
          backButton={
            <Button
              variant="ghost"
              size="icon"
              render={<Link href={{ pathname: '/[house]', params: { house } }} />}
              nativeButton={false}
              className="shrink-0 rounded-full"
            >
              <ArrowLeftIcon className="size-6" />
              <span className="sr-only">{t('close')}</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}
