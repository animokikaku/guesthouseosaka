import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { BookTextIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/contact'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale: locale as Locale })

  return {
    title: t('navigation.contact'),
    description: t('contact.description')
  }
}

export default async function ContactLayout({
  params,
  children
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations()

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{t('contact.title')}</PageHeaderHeading>
        <PageHeaderDescription>{t('contact.intro')}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('navigation.contact')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq#phone">
              <PhoneIcon />
              {t('forms.fields.phone.label')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq">
              <BookTextIcon />
              {t('navigation.faq')}
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
