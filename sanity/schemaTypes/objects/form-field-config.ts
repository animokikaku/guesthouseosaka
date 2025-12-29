import { defineField, defineType } from 'sanity'

export const formFieldConfig = defineType({
  name: 'formFieldConfig',
  title: 'Form Field Configuration',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'internationalizedArrayString',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      label: 'label.0.value'
    },
    prepare({ label }) {
      return {
        title: label || 'Unlabeled field'
      }
    }
  }
})
