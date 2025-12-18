import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'housePage',
  title: 'House Page',
  type: 'document',
  fields: [
    LocaleField,
    defineField({
      name: 'slug',
      type: 'string',
      options: {
        list: [
          { title: 'orange', value: 'orange' },
          { title: 'apple', value: 'apple' },
          { title: 'lemon', value: 'lemon' }
        ]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
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
