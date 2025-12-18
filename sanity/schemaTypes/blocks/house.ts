// schemas/house.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'house',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'card',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          type: 'image',
          options: { hotspot: true },
          validation: (r) => r.required()
        }),
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'internationalizedArrayString',
          validation: (r) => r.required(),
          options: {
            aiAssist: {
              translateAction: true
            }
          }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'card.image',
      subtitle: 'slug.current'
    }
  }
})
