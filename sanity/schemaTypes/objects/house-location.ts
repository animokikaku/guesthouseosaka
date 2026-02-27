import { defineField, defineType } from 'sanity'

export const houseLocation = defineType({
  name: 'houseLocation',
  title: 'Location',
  type: 'object',
  fields: [
    defineField({
      name: 'highlight',
      title: 'Location Highlight',
      type: 'internationalizedArrayText',
      description: 'Key location selling point (e.g., "14 minutes walk to Namba")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'details',
      title: 'Location Details',
      type: 'internationalizedArrayPortableText',
      description:
        'Use H3 for section headings (e.g., "Getting Around", "Nearby") and bullet lists for items',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ]
})
