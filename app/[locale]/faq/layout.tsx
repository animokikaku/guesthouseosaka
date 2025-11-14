import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { MailIcon, PhoneIcon } from 'lucide-react'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { getExtracted, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/faq'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getExtracted({ locale: locale as Locale })

  return {
    title: t('FAQ'),
    description: t('Find answers to common questions about our share houses.')
  }
}

export default async function FAQLayout({
  params,
  children
}: LayoutProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getExtracted({ locale: locale as Locale })

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{t('Frequently asked questions')}</PageHeaderHeading>
        <PageHeaderDescription>
          {t(
            "Here you'll find the key information to make the most of your stay. If you don't see your question here, please contact us by phone or email."
          )}
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="#phone">
              <PhoneIcon />
              {t('Phone')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('Email')}
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
