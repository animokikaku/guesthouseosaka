import { ComponentIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'
import { allowedIcons } from '../../lib/allowed-icons'
import { IconPreview } from '../../lib/icon-preview'

export const amenityCategory = defineType({
  name: 'amenityCategory',
  title: 'Amenity Category',
  type: 'document',
  icon: ComponentIcon,
  fields: [
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
      description: 'Decorative icon for this category',
      options: { allowedIcons }
    }),
    orderRankField({ type: 'amenityCategory' })
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      label: 'label.0.value',
      icon: 'icon'
    },
    prepare({ label, icon }) {
      return {
        title: label || 'No label',
        media: <IconPreview icon={icon} />
      }
    }
  }
})
