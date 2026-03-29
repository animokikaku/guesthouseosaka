import type { MetadataRoute } from 'next'
import { ENV } from 'varlock/env'

export default function robots(): MetadataRoute.Robots {
  const url = ENV.NEXT_PUBLIC_APP_URL
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/studio' },
    sitemap: `${url}/sitemap.xml`
  }
}
