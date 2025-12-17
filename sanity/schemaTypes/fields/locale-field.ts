import { routing } from '@/i18n/routing'
import { locales } from '@/sanity/config'
import { defineField } from 'sanity'

export const LocaleField = defineField({
  name: 'locale',
  type: 'string',
  initialValue: routing.defaultLocale,
  validation: (rule) => rule.required(),
  options: {
    list: locales.map((locale) => ({ title: locale.label, value: locale.name }))
  }
})
