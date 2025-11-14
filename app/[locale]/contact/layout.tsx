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
import { getExtracted, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/contact'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getExtracted({ locale: locale as Locale })

  return {
    title: t('Contact'),
    description: t('Get in touch with us for any inquiries or questions.')
  }
}

export default async function ContactLayout({
  params,
  children
}: LayoutProps<'/[locale]/contact'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getExtracted()

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{t('Get in touch')}</PageHeaderHeading>
        <PageHeaderDescription>
          {t(
            "We're here to help! Choose the option that best describes your inquiry and we'll get back to you as soon as possible."
          )}
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('Contact')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq#phone">
              <PhoneIcon />
              {t('Phone')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/faq">
              <BookTextIcon />
              {t('FAQ')}
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
