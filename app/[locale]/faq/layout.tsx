import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { MailIcon, PhoneIcon } from 'lucide-react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/faq'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'FAQLayout.meta'
  })

  const title = t('title')
  const description = t('description')

  const { openGraph, twitter } = await getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.faq.src
  })

  return { title, description, openGraph, twitter }
}

export default async function FAQLayout({
  params,
  children
}: LayoutProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'FAQLayout'
  })

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{t('title')}</PageHeaderHeading>
        <PageHeaderDescription>{t('description')}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="#phone">
              <PhoneIcon />
              {t('actions.phone')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('actions.email')}
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 pb-12">
        <div className="align-center container max-w-2xl">{children}</div>
      </div>
    </>
  )
}
