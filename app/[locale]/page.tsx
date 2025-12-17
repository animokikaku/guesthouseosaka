import { Collection } from '@/components/collection'
import { GalleryWall } from '@/components/gallery-wall'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { sanityFetch } from '@/sanity/lib/live'
import { homePageQuery } from '@/sanity/lib/queries'
import { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function LocalePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale as Locale)
  const t = await getTranslations('LocalePage')

  const { data } = await sanityFetch({
    query: homePageQuery,
    params: { locale }
  })

  const { title, description } = data?.hero || {}

  return (
    <div className="snap-footer section-soft flex flex-col gap-18 md:gap-0">
      <section className="relative flex snap-none items-center justify-center py-8 md:min-h-[calc(100dvh-var(--header-height))] md:snap-end md:py-0">
        <div className="container-wrapper w-full max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-3">
            {/* Text content */}
            <PageHeader className="md:items-start md:text-left">
              <PageHeaderHeading className="md:text-left">
                {title}
              </PageHeaderHeading>
              <PageHeaderDescription className="md:text-left">
                {description}
              </PageHeaderDescription>
              <PageActions className="md:justify-start">
                <Button asChild size="lg">
                  <Link href="/contact">{t('hero_action')}</Link>
                </Button>
              </PageActions>
            </PageHeader>

            {/* Instagram feed */}
            <div className="flex justify-center md:col-span-2 md:justify-end">
              <div className="w-full">
                <GalleryWall />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="snap:none container-wrapper relative flex max-w-7xl flex-1 flex-col items-center justify-center md:min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] md:snap-start">
        <PageHeader>
          <PageHeaderHeading className="max-w-none self-start text-2xl xl:text-4xl">
            {t('houses_title')}
          </PageHeaderHeading>
          <PageHeaderDescription className="max-w-none self-start text-start text-wrap">
            {t('houses_description')}
          </PageHeaderDescription>
          <PageActions>
            <Collection className="w-full pt-4" />
          </PageActions>
        </PageHeader>
      </section>
    </div>
  )
}
