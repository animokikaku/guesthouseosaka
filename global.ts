import type { formats } from '@/i18n/formats'
import type { routing } from '@/i18n/routing'
import type messages from './messages/en.json'

declare module 'use-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}

declare global {
  /** Set by `vite.config.ts` from `DEPLOY_ENV`: which deployment this build is. */
  const __DEPLOY_ENV__: 'development' | 'preview' | 'production'
}
