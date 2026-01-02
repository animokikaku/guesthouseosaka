import { routing } from '@/i18n/routing'
import { Locale } from 'next-intl'

export const locales: { name: Locale; label: string }[] = [
  { name: 'en', label: 'English' },
  { name: 'ja', label: '日本語' },
  { name: 'fr', label: 'Français' }
]

export const defaultLocale = routing.defaultLocale
