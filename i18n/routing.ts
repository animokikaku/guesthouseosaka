import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ja', 'fr', 'zh-CN', 'zh-TW'],
  defaultLocale: 'en',
  // Keep canonical BCP 47 codes internally (Sanity, hreflang, Intl) but lowercase URLs
  localePrefix: {
    mode: 'always',
    prefixes: {
      'zh-CN': '/zh-cn',
      'zh-TW': '/zh-tw'
    }
  },
  pathnames: {
    '/': '/',
    '/[house]': '/[house]',
    '/[house]/gallery': '/[house]/gallery',
    '/contact': '/contact',
    '/contact/[slug]': '/contact/[slug]',
    '/faq': '/faq'
  }
})
