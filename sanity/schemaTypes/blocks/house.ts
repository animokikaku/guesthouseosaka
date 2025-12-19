import { HouseIdentifierValues } from '@/lib/types'
import { ImageField } from '@/sanity/schemaTypes/fields/image'
import { Building } from 'lucide-react'
import { defineField, defineType } from 'sanity'

export const house = defineType({
  name: 'house',
  title: 'House',
  icon: Building,
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      type: 'string',
      options: { list: [...HouseIdentifierValues] },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayText',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    ImageField
  ],
  preview: {
    select: {
      title: 'title.0.value',
      subtitle: 'description.0.value',
      media: 'image'
    }
  }
})
