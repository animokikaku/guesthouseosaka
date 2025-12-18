import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
