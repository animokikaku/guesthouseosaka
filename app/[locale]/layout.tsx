import { routing } from '@/i18n/routing'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'

import '@/app/globals.css'
import { DraftModeIndicator } from '@/components/draft-mode-indicator'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { assets } from '@/lib/assets'
import { META_THEME_COLORS } from '@/lib/config'
import { env } from '@/lib/env'
import { fontVariables } from '@/lib/fonts'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { toHouseNavItems } from '@/lib/transforms/nav'
import { cn } from '@/lib/utils'
import { HOUSE_THEMES } from '@/lib/utils/theme'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { housesNavQuery, settingsQuery } from '@/sanity/lib/queries'
import { type Metadata } from 'next'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'
import { Organization, WithContext } from 'schema-dts'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    params: { locale }
  })

  const siteName = settings?.siteName

  const { openGraph, twitter } = getOpenGraphMetadata({
    locale,
    siteName
  })

  return {
    title: siteName ? { default: siteName, template: `%s - ${siteName}` } : undefined,
    metadataBase: env.NEXT_PUBLIC_APP_URL,
    authors: [{ name: 'Thibault Vieux', url: 'https://thibaultvieux.com' }],
    description: settings?.siteDescription,
    keywords: [
      'Guest House Osaka',
      'Osaka Guest House',
      'Osaka Share House',
      'Share House Osaka',
      'International Share House',
      'Long-term stay Osaka',
      'Room for rent Osaka',
      'Accommodation Osaka',
      'Share House Japan',
      'Foreigners housing Osaka'
    ],
    openGraph,
    twitter,
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png'
    },
    robots: { index: true, follow: true }
  }
}

export default async function LocaleLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await getLocale()

  const url = env.NEXT_PUBLIC_APP_URL

  const [{ data: settings }, { data: houses }] = await Promise.all([
    sanityFetch({ query: settingsQuery, params: { locale } }),
    sanityFetch({ query: housesNavQuery, params: { locale } })
  ])

  // Transform houses data server-side to reduce client-side work
  const houseItems = toHouseNavItems(houses)

  const jsonLd: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'Guest House Osaka',
    alternateName: 'ゲストハウス大阪',
    logo: assets.logo.sho.src,
    image: assets.openGraph.home.src,
    ...(settings && {
      legalName: settings.companyName,
      telephone: settings.phone,
      email: settings.email,
      sameAs: settings.socialLinks?.map((link) => link.url),
      address: settings.address ? { '@type': 'PostalAddress', ...settings.address } : undefined
    })
  }

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
          }}
        />
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          'text-foreground group/body theme-default font-sans antialiased [--footer-height:--spacing(14)] [--header-height:--spacing(14)] xl:[--footer-height:--spacing(24)]',
          fontVariables
        )}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const houseThemes = ${JSON.stringify(HOUSE_THEMES)}
                const house = window.location.pathname.split('/').filter(Boolean)[1]
                const theme = Object.hasOwn(houseThemes, house) ? houseThemes[house] : undefined
                if (theme) {
                  Array.from(document.body.classList)
                    .filter((className) => className.startsWith('theme-'))
                    .forEach((className) => document.body.classList.remove(className))
                  document.body.classList.add('theme-' + theme)
                }
              } catch (_) {}
            `
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider>
            <div className="bg-background relative z-10 flex min-h-svh flex-col">
              <SiteHeader houseItems={houseItems} />
              <main className="flex flex-1 flex-col pt-(--header-height)">{children}</main>
              {settings && <SiteFooter settings={settings} />}
            </div>
            <TailwindIndicator />
            <Toaster position="top-center" />
            <Analytics />
            <SpeedInsights />
            <SanityLive />
            {(await draftMode()).isEnabled && (
              <>
                <VisualEditing />
                <DraftModeIndicator />
              </>
            )}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
