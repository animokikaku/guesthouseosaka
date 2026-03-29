import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_APP_URL
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/studio' },
    sitemap: `${url}/sitemap.xml`
  }
}
