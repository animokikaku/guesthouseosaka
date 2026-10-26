import { formats } from '@/i18n/formats'
import { routing } from '@/i18n/routing'
import messages from './messages/en.json'

declare module 'use-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}

declare global {
  /** Set by `vite.config.ts`: whether this build serves the Playwright suite. */
  const __E2E_TEST_PROXY__: boolean
}
