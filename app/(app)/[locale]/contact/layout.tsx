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
import { BookTextIcon, MailIcon, PhoneIcon } from 'lucide-react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/contact'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'ContactLayout.meta'
  })

  const { openGraph, twitter } = await getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.contact.src
  })

  const title = t('title')
  const description = t('description')

  return { title, description, openGraph, twitter }
}

export default async function ContactLayout({
  params,
  children
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'ContactLayout'
  })

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{t('title')}</PageHeaderHeading>
        <PageHeaderDescription>{t('description')}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('actions.contact')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={{ pathname: '/faq', hash: '#phone' }}>
              <PhoneIcon />
              {t('actions.phone')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq">
              <BookTextIcon />
              {t('actions.faq')}
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper section-soft flex-1 md:pb-12">
        <div className="sm:container">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}
