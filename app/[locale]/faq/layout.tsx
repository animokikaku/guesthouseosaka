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
import { getTranslations, setRequestLocale } from 'next-intl/server'

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/faq'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale: locale as Locale })

  return {
    title: t('faq.title'),
    description: t('faq.description')
  }
}

export default async function FAQLayout({
  params,
  children
}: LayoutProps<'/[locale]/faq'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const t = await getTranslations({ locale: locale as Locale })

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{t('faq.heading')}</PageHeaderHeading>
        <PageHeaderDescription>
          {t('faq.intro')}
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="#phone">
              <PhoneIcon />
              {t('forms.fields.phone.label')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('forms.fields.email.label')}
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
