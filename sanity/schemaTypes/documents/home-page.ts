import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  type: 'document',
  fields: [
    LocaleField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'heroSection',
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
