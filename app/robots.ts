import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const url = env.NEXT_PUBLIC_APP_URL
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/studio' },
    sitemap: `${url}/sitemap.xml`
  }
}
