import { routing } from '@/i18n/routing'
import { sanityFetch } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = routing.defaultLocale
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    params: { locale }
  })

  return {
    name: settings?.siteName ?? 'Share House Osaka',
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
