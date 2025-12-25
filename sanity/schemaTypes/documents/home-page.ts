import { ImageField } from '@/sanity/schemaTypes/fields/image'
import { HomeIcon } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  icon: HomeIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      type: 'object',
      fields: [
        defineField({
          name: 'content',
          title: 'Content',
          type: 'internationalizedArrayPortableText',
          description:
            'Use H1 for the heading and normal text for the description',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'ctaLabel',
          type: 'internationalizedArrayString',
          options: { aiAssist: { translateAction: true } },
          validation: (rule) => rule.required()
        })
      ],
      validation: (rule) => rule.required()
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
          name: 'content',
          title: 'Content',
          type: 'internationalizedArrayPortableText',
          description:
            'Use H2 for the heading and normal text for the description',
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
    prepare() {
      return { title: 'Home Page' }
    }
  }
})
