import type { Locale } from 'use-intl'

/** Per-locale display and metadata values; `routing.locales` stays the list of supported locales. */
export const localeConfig: Record<Locale, { label: string; openGraph: string }> = {
  en: { label: 'English', openGraph: 'en_US' },
  ja: { label: '日本語', openGraph: 'ja_JP' },
  fr: { label: 'Français', openGraph: 'fr_FR' },
  'zh-CN': { label: '简体中文', openGraph: 'zh_CN' },
  'zh-TW': { label: '繁體中文', openGraph: 'zh_TW' }
}
