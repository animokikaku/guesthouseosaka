import { routing } from '@/i18n/routing'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { hasLocale, Locale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import '@/app/globals.css'
import { ActiveThemeProvider } from '@/components/active-theme'
import { Analytics } from '@/components/analytics'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { META_THEME_COLORS } from '@/lib/config'
import { env } from '@/lib/env'
import { fontVariables } from '@/lib/fonts'
import { getOpenGraphMetadata } from '@/lib/metadata'
import { cn } from '@/lib/utils'
import { type Metadata } from 'next'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(
  props: Omit<LayoutProps<'/[locale]'>, 'children'>
): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'meta'
  })

  const siteName = t('siteName')
  const { openGraph, twitter } = await getOpenGraphMetadata({
    locale: locale as Locale
  })

  return {
    title: {
      default: siteName,
      template: `%s - ${siteName}`
    },
    metadataBase: env.NEXT_PUBLIC_APP_URL,
    authors: [{ name: 'Thibault Vieux', url: 'https://thibaultvieux.com' }],
    description: t('siteDescription'),
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
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: LayoutProps<'/[locale]'>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

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
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        className={cn(
          'text-foreground group/body theme-default font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]',
          fontVariables
        )}
      >
        <ThemeProvider>
          <ActiveThemeProvider initialTheme="default">
            <NextIntlClientProvider>
              <div className="bg-background relative z-10 flex min-h-svh flex-col">
                <SiteHeader />
                <main className="flex flex-1 flex-col">{children}</main>
                <SiteFooter />
              </div>
              <TailwindIndicator />
              <Toaster position="top-center" />
              <Analytics />
              <SpeedInsights />
            </NextIntlClientProvider>
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
