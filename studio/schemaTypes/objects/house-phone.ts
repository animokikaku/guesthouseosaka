import { defineField, defineType } from 'sanity'

export const housePhone = defineType({
  name: 'housePhone',
  title: 'Phone Numbers',
  type: 'object',
  fields: [
    defineField({
      name: 'domestic',
      title: 'Domestic',
      type: 'string',
      description: 'Phone number for calls from Japan',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'international',
      title: 'International',
      type: 'string',
      description: 'Phone number for calls from abroad',
      validation: (rule) => rule.required()
    })
  ]
})
