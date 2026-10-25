import { env } from '@/lib/env'

export default function robots() {
  const url = env.VITE_APP_URL
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${url}/sitemap.xml`
  }
}

/** The rules as a robots.txt file. */
export function toRobotsTxt({ rules, sitemap }: ReturnType<typeof robots>) {
  return [
    `User-Agent: ${rules.userAgent}`,
    `Allow: ${rules.allow}`,
    '',
    `Sitemap: ${sitemap}`,
    ''
  ].join('\n')
}
