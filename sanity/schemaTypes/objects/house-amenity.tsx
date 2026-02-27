import { defineField, defineType } from 'sanity'
import { IconPreview } from '../../lib/icon-preview'

export const houseAmenity = defineType({
  name: 'houseAmenity',
  title: 'House Amenity',
  type: 'object',
  fields: [
    defineField({
      name: 'amenity',
      title: 'Amenity',
      type: 'reference',
      to: [{ type: 'amenity' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      description: 'Optional note about availability (e.g., private, shared)',
      options: {
        list: [
          { title: 'Private', value: 'private' },
          { title: 'Shared', value: 'shared' },
          { title: 'Coin-operated', value: 'coin' }
        ],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this amenity in the preview section on the house page',
      initialValue: false
    }),
    defineField({
      name: 'customLabel',
      title: 'Custom Label',
      type: 'internationalizedArrayString',
      description: 'Override the default amenity label for this house',
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      label: 'amenity.label.0.value',
      icon: 'amenity.icon',
      note: 'note',
      featured: 'featured',
      customLabel: 'customLabel.0.value'
    },
    prepare({ label, icon, note, featured, customLabel }) {
      const displayLabel = customLabel || label || 'No amenity selected'
      const noteLabels: Record<string, string> = {
        private: 'Private',
        shared: 'Shared',
        coin: 'Coin-operated'
      }
      const subtitle = [note ? noteLabels[note] : null, featured ? 'Featured' : null]
        .filter(Boolean)
        .join(' | ')

      return {
        title: displayLabel,
        subtitle: subtitle || undefined,
        media: <IconPreview icon={icon} />
      }
    }
  }
})
