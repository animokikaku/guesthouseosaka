import { ImagesIcon } from '@sanity/icons/Images'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'
import { Icon } from '@/lib/icons'

export const galleryCategory = defineType({
  name: 'galleryCategory',
  title: 'Gallery Category',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Display name shown to visitors',
      validation: (rule) => rule.required().min(1),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'lucide-icon',
      description: 'Decorative icon for this category'
    }),
    orderRankField({ type: 'galleryCategory' })
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
        media: <Icon name={icon} />
      }
    }
  }
})
