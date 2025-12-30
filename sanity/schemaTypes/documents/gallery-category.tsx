import {
  orderRankField,
  orderRankOrdering
} from '@sanity/orderable-document-list'
import { ImagesIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'
import { allowedIcons } from '../../lib/allowed-icons'
import { IconPreview } from '../../lib/icon-preview'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'Gallery Category',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'slug',
      description: 'Unique identifier (e.g., "room", "common-spaces")',
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
      description: 'Decorative icon for this category',
      options: { allowedIcons }
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Display name shown to visitors',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    orderRankField({ type: 'galleryCategory' })
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
