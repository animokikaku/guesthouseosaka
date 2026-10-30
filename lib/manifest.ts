import { routing } from '@/i18n/routing'
import { intlConfig, loadMessages } from '@/i18n/messages'
import { sanityFetch } from '@/sanity/lib/fetch.server'
import { settingsQuery } from '@/sanity/lib/queries'
import { stegaClean } from '@sanity/client/stega'
import { createTranslator } from 'use-intl'

/** The web app manifest, named after the site in the default locale. */
export async function webManifest() {
  const locale = routing.defaultLocale
  const [{ data: settings }, messages] = await Promise.all([
    sanityFetch({ query: settingsQuery, params: { locale } }),
    loadMessages(locale)
  ])
  const t = createTranslator({ locale, messages, namespace: 'Metadata', ...intlConfig })

  return {
    name: stegaClean(settings?.siteName) ?? t('manifest_name'),
    short_name: 'SHO',
    start_url: '/',
    theme_color: '#101E33',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    display: 'standalone'
  }
}
