import { PageActions, PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { sanityFetch } from '@/sanity/lib/live'
import { faqPageQuery, settingsQuery } from '@/sanity/lib/queries'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { MailIcon, PhoneIcon } from 'lucide-react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

const headerComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-primary leading-tighter max-w-2xl text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
        {children}
      </h1>
    ),
    normal: ({ children }) => (
      <p className="text-foreground max-w-3xl text-base text-balance sm:text-lg">
        {children}
      </p>
    )
  }
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]/faq'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const [t, { data: settings }] = await Promise.all([
    getTranslations({ locale: locale as Locale, namespace: 'FAQLayout.meta' }),
    sanityFetch({ query: settingsQuery, params: { locale } })
  ])

  const title = t('title')
  const description = t('description')

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale: locale as Locale,
    image: assets.openGraph.faq.src,
    siteName: settings?.siteName
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

  const { data } = await sanityFetch({
    query: faqPageQuery,
    params: { locale }
  })

  return (
    <>
      <PageHeader>
        {data?.header && (
          <PortableText value={data.header} components={headerComponents} />
        )}
        <PageActions>
          <Button asChild size="sm">
            <Link href="/contact">
              <MailIcon />
              {t('actions.email')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href={{ pathname: '/faq', hash: '#phone' }}>
              <PhoneIcon />
              {t('actions.phone')}
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
