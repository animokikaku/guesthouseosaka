import { env } from '@/lib/env'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const url = env.NEXT_PUBLIC_APP_URL
  return {
    // TODO: Enable indexing once production is ready
    rules: { userAgent: '*', disallow: '/' },
    sitemap: `${url}/sitemap.xml`
  }
}
