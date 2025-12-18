import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  fields: [
    LocaleField,
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'locale'
    }
  }
})
