import {
  orderRankField,
  orderRankOrdering
} from '@sanity/orderable-document-list'
import { ComponentIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { IconPreview } from '../../lib/icon-preview'

export const amenityCategory = defineType({
  name: 'amenityCategory',
  title: 'Amenity Category',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      description: 'Unique identifier (e.g., "kitchen-dining", "bathroom")',
      validation: (rule) => rule.required(),
      options: {
        source: 'label.0.value',
        maxLength: 50
      }
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      description: 'Decorative icon for this category'
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Display name shown to visitors',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    orderRankField({ type: 'amenityCategory' })
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      label: 'label.0.value',
      key: 'key.current',
      icon: 'icon'
    },
    prepare({ label, key, icon }) {
      return {
        title: label || 'No label',
        subtitle: key || 'no-key',
        media: <IconPreview icon={icon} />
      }
    }
  }
})
