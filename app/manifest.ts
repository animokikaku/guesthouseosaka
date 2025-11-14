import { routing } from '@/i18n/routing'
import { MetadataRoute } from 'next'
import { getExtracted } from 'next-intl/server'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  /*
   * Provide locale explicitly since manifest is outside [locale] segment.
   * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#manifest
   */
  const locale = routing.defaultLocale
  const t = await getExtracted({ locale })

  return {
    name: t('Share House Osaka'),
    short_name: t('SHO'),
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
