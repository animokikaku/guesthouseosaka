import { HouseIdentifierValues } from '@/lib/types'
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
      options: {
        list: [...HouseIdentifierValues]
      },
      validation: (r) => r.required()
    }),
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: {
        aiAssist: {
          translateAction: true
        }
      }
    }),
    defineField({
      name: 'description',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: {
        aiAssist: {
          translateAction: true
        }
      }
    })
  ]
})
