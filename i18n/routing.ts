import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ja', 'fr'],
  defaultLocale: 'en',
  pathnames: {
    '/': '/',
    '/[house]': '/[house]',
    '/[house]/gallery': '/[house]/gallery',
    '/contact': {
      ja: '/お問い合わせ'
    },
    '/contact/tour': {
      ja: '/お問い合わせ/見学のご依頼',
      fr: '/contact/visite'
    },
    '/contact/move-in': {
      ja: '/お問い合わせ/入居リクエスト',
      fr: '/contact/demenagement'
    },
    '/contact/other': {
      ja: '/お問い合わせ/一般的なお問い合わせ',
      fr: '/contact/autre'
    },
    '/faq': {
      ja: '/よくある質問'
    }
  }
})
