import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ja', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/faq': '/faq',
    '/[house]': '/[house]',
    '/[house]/gallery': '/[house]/gallery',
    '/contact': '/contact',
    '/contact/tour': '/contact/tour',
    '/contact/move-in': '/contact/move-in',
    '/contact/other': '/contact/other'
  }
})
