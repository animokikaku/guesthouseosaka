import { defineField, defineType } from 'sanity'

// Shared field definitions
const labelField = defineField({
  name: 'label',
  title: 'Label',
  type: 'internationalizedArrayString',
  validation: (rule) => rule.required()
})

const placeholderField = defineField({
  name: 'placeholder',
  title: 'Placeholder',
  type: 'internationalizedArrayString'
})

const descriptionField = defineField({
  name: 'description',
  title: 'Description',
  type: 'internationalizedArrayString'
})

const previewConfig = {
  select: { label: 'label.0.value' },
  prepare(selection: Record<string, string>) {
    return { title: selection.label || 'Unlabeled field' }
  }
}

// Full config with label, placeholder, and description
export const formFieldConfig = defineType({
  name: 'formFieldConfig',
  title: 'Form Field Configuration',
  type: 'object',
  fields: [labelField, placeholderField, descriptionField],
  preview: previewConfig
})

// Config without placeholder (for fields like places, date, hour)
export const formFieldConfigNoPlaceholder = defineType({
  name: 'formFieldConfigNoPlaceholder',
  title: 'Form Field Configuration',
  type: 'object',
  fields: [labelField, descriptionField],
  preview: previewConfig
})
