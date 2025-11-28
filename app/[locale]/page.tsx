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
import {
  getOrganizationJsonLd,
  serializeJsonLd
} from '@/lib/structured-data'
import { Locale, useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

export default function LocalePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = use(params)

  // Enable static rendering
  setRequestLocale(locale as Locale)
  const t = useTranslations()
  const siteName = t('meta.siteName')
  const telephone = t('faq.contact.phones.orange.international')

  const organizationJsonLd = getOrganizationJsonLd({
    siteName,
    telephone,
    email: 'info@guesthouseosaka.com',
    contactName: 'Kenji Hisamoto'
  })

  return (
    <div className="section-soft flex flex-col gap-18 md:gap-0">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(organizationJsonLd)
      }}
    />
      <section className="relative flex snap-none items-center justify-center py-8 md:min-h-[calc(100dvh-var(--header-height))] md:snap-end md:py-0">
        <div className="container-wrapper w-full max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-3">
            {/* Text content */}
            <PageHeader className="md:items-start md:text-left">
              <PageHeaderHeading className="md:text-left">
                {t.rich('home.heroTitle', {
                  block: (chunks) => (
                    <>
                      <br />
                      {chunks}
                      <br />
                    </>
                  )
                })}
              </PageHeaderHeading>
              <PageHeaderDescription className="md:text-left">
                {t('home.heroDescription')}
              </PageHeaderDescription>
              <PageActions className="md:justify-start">
                <Button asChild size="lg">
                  <Link href="/contact">{t('home.heroCta')}</Link>
                </Button>
              </PageActions>
            </PageHeader>

            {/* Instagram feed */}
            <div className="flex justify-center md:col-span-2 md:justify-end">
              <div className="w-full">
                <GalleryWall locale={locale as Locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="snap:none container-wrapper relative flex max-w-7xl flex-1 flex-col items-center justify-center md:min-h-[calc(100dvh-var(--header-height)-var(--footer-height))] md:snap-start">
        <PageHeader>
          <PageHeaderHeading className="self-start text-2xl xl:text-4xl">
            {t('home.housesTitle')}
          </PageHeaderHeading>
          <PageHeaderDescription className="max-w-none self-start text-start text-wrap">
            {t('home.housesDescription')}
          </PageHeaderDescription>
          <PageActions>
            <Collection className="w-full pt-4" />
          </PageActions>
        </PageHeader>
      </section>
    </div>
  )
}
