import { defineField, defineType } from 'sanity'

// Shared field definitions
const labelField = defineField({
  name: 'label',
  title: 'Label',
  type: 'internationalizedArrayString',
  validation: (rule) => rule.required(),
  options: { aiAssist: { translateAction: true } }
})

const placeholderField = defineField({
  name: 'placeholder',
  title: 'Placeholder',
  type: 'internationalizedArrayString',
  options: { aiAssist: { translateAction: true } }
})

const descriptionField = defineField({
  name: 'description',
  title: 'Description',
  type: 'internationalizedArrayString',
  options: { aiAssist: { translateAction: true } }
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
