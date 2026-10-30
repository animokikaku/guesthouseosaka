import { env } from '@/lib/env'

/** Lets crawlers in, except into the Studio redirect, and points them at the sitemap. */
export function robotsTxt() {
  return [
    'User-Agent: *',
    'Allow: /',
    'Disallow: /studio',
    '',
    `Sitemap: ${env.VITE_APP_URL}/sitemap.xml`,
    ''
  ].join('\n')
}
