import { ImagesIcon } from '@sanity/icons'
import {
  orderRankField,
  orderRankOrdering
} from '@sanity/orderable-document-list'
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Unique identifier (e.g., "room", "common-spaces")',
      validation: (rule) => rule.required(),
      options: { source: 'label.0.value', maxLength: 50 }
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
      slug: 'slug.current',
      icon: 'icon'
    },
    prepare({ label, slug, icon }) {
      return {
        title: label || 'No label',
        subtitle: slug || 'no-slug',
        media: <IconPreview icon={icon} />
      }
    }
  }
})
