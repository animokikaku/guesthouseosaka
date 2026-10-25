import '@/app/globals.css'
import geistLatin from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import { GlobalError } from '@/components/global-fallbacks'
import { jsonLdScript } from '@/components/json-ld'
import { LocaleNotFound } from '@/components/locale-not-found'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toast'
import { localeConfig } from '@/i18n/locales'
import { intlConfig, loadMessages } from '@/i18n/messages'
import { localeToPrefix, prefixToLocale, routing } from '@/i18n/routing'
import { cacheHeaders } from '@/lib/cache-control'
import { META_THEME_COLORS } from '@/lib/config'
import { env } from '@/lib/env'
import { openGraphMeta, pageMeta } from '@/lib/metadata'
import { organizationJsonLd } from '@/lib/structured-data'
import { getLocaleLayout } from '@/sanity/lib/loaders.functions'
import { stegaClean } from '@sanity/client/stega'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { hasLocale, IntlProvider } from 'use-intl'

// Only loaded in draft mode, keeping @sanity/visual-editing out of the bundle
// for regular visitors.
const DraftMode = lazy(() => import('@/components/draft-mode'))

export const Route = createFileRoute('/$locale')({
  // `/zh-cn` in the URL, `zh-CN` in code.
  params: {
    parse: ({ locale }) => {
      const parsed = prefixToLocale(locale)
      return parsed ? { locale: parsed } : false
    },
    stringify: ({ locale }) => ({ locale: localeToPrefix(locale) })
  },
  // A layout still matches when `parse` rejects its param, so an unsupported
  // prefix (one the middleware lets through, like `/_x`) gets the root's 404.
  beforeLoad: ({ params }) => {
    if (!hasLocale(routing.locales, params.locale)) throw notFound({ routeId: '__root__' })
  },
  loader: async ({ params: { locale } }) => {
    const [messages, layout] = await Promise.all([
      loadMessages(locale),
      getLocaleLayout({ data: { locale } })
    ])
    return { messages, ...layout }
  },
  headers: ({ loaderData }) => cacheHeaders(loaderData?.isDraftMode ?? false),
  head: ({ loaderData, params: { locale } }) => {
    const settings = stegaClean(loaderData?.settings)
    return {
      meta: [
        ...pageMeta({ title: settings?.siteName, description: settings?.siteDescription }),
        {
          name: 'keywords',
          content: [
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
          ].join(', ')
        },
        { name: 'author', content: 'Thibault Vieux' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: META_THEME_COLORS.light },
        ...openGraphMeta({
          locale,
          siteName: settings?.siteName,
          image: new URL(`/opengraph-image.jpg`, env.NEXT_PUBLIC_APP_URL).toString()
        }),
        { property: 'og:image:alt', content: 'Guest House Osaka' }
      ],
      links: [
        // The body font, requested with the HTML rather than once the CSS is
        // parsed, as `next/font` did. Other subsets load on demand.
        { rel: 'preload', href: geistLatin, as: 'font', type: 'font/woff2', crossOrigin: '' },
        { rel: 'author', href: 'https://thibaultvieux.com' },
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'shortcut icon', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ],
      scripts: [
        ...(settings ? [jsonLdScript(organizationJsonLd(settings, env.NEXT_PUBLIC_APP_URL))] : []),
        {
          // Matches the browser chrome to a dark theme before first paint.
          children: `try{if(localStorage.theme==='dark'||((!('theme' in localStorage)||localStorage.theme==='system')&&matchMedia('(prefers-color-scheme: dark)').matches)){document.querySelector('meta[name="theme-color"]').setAttribute('content','${META_THEME_COLORS.dark}')}}catch(_){}`
        }
      ]
    }
  },
  component: LocaleLayout,
  // Child routes render their errors inside this layout (the router's
  // `defaultErrorComponent`); this one only covers the layout's own failure.
  notFoundComponent: LocaleNotFound,
  errorComponent: GlobalError
})

function LocaleLayout() {
  const { locale } = Route.useParams()
  const { messages, settings, houseItems, isDraftMode, year } = Route.useLoaderData()

  return (
    <ThemeProvider>
      <IntlProvider locale={locale} messages={messages} {...intlConfig}>
        {/* Repeated per locale, so `head()` would dedupe them; React hoists these. */}
        {routing.locales
          .filter((other) => other !== locale)
          .map((other) => (
            <meta
              key={other}
              property="og:locale:alternate"
              content={localeConfig[other].openGraph}
            />
          ))}
        <div className="bg-background relative z-10 flex min-h-svh flex-col">
          <SiteHeader houseItems={houseItems} />
          <main className="flex flex-1 flex-col pt-(--header-height)">
            <Outlet />
          </main>
          {settings && <SiteFooter settings={settings} year={year} />}
        </div>
        <TailwindIndicator />
        <Toaster />
        {isDraftMode && (
          <Suspense>
            <DraftMode />
          </Suspense>
        )}
      </IntlProvider>
    </ThemeProvider>
  )
}
