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
          gallery={data.gallery}
          title={data.title ?? ''}
          backButton={
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="shrink-0 rounded-full"
            >
              <Link href={{ pathname: '/[house]', params: { house } }}>
                <ArrowLeftIcon className="size-6" />
                <span className="sr-only">{t('close')}</span>
              </Link>
            </Button>
          }
        />
      </div>
    </div>
  )
}
