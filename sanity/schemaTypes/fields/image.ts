import { defineField } from 'sanity'

export const ImageField = defineField({
  name: 'image',
  type: 'image',
  options: { hotspot: true },
  validation: (rule) => rule.assetRequired(),
  fields: [
    defineField({
      name: 'alt',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: { media: 'asset', title: 'alt.0.value' }
  }
})
