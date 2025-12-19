import { ImageField } from '@/sanity/schemaTypes/fields/image'
import { HomeIcon } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  icon: HomeIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      options: { aiAssist: { translateAction: true } },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'hero',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'internationalizedArrayString',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'description',
          type: 'internationalizedArrayText',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'ctaLabel',
          type: 'internationalizedArrayString',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        })
      ]
    }),
    defineField({
      name: 'galleryWall',
      description: 'Exactly 6 images required. Drag to reorder.',
      type: 'array',
      of: [
        defineArrayMember({
          ...ImageField
        })
      ],
      validation: (rule) => rule.required().length(6)
    }),
    defineField({
      name: 'collection',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'internationalizedArrayString',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'description',
          type: 'internationalizedArrayText',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'houses',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'house' } }]
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      subtitle: 'hero.title.0.value'
    }
  }
})
