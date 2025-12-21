import { CheckmarkCircleIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const amenity = defineType({
  name: 'amenity',
  title: 'Amenity',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      description: 'Unique identifier (e.g., "wifi", "air-conditioning")',
      validation: (rule) => rule.required(),
      options: {
        source: 'label.0.value',
        maxLength: 50
      }
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Display name shown to visitors',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'amenityCategory' }],
      validation: (rule) => rule.required()
    })
  ],
  orderings: [
    {
      title: 'Label A-Z',
      name: 'labelAsc',
      by: [{ field: 'key.current', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      label: 'label.0.value',
      icon: 'icon',
      categoryLabel: 'category.label.0.value'
    },
    prepare({ label, icon, categoryLabel }) {
      return {
        title: label || 'No label',
        subtitle: `${icon ? `Icon: ${icon}` : 'No icon'} | ${categoryLabel || 'No category'}`
      }
    }
  }
})
