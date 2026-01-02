import { ImagesIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { IconPreview } from '../../lib/icon-preview'

export const houseGalleryCategory = defineType({
  name: 'houseGalleryCategory',
  title: 'Gallery Category',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'galleryCategory' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'items',
      title: 'Photos',
      type: 'array',
      of: [defineArrayMember({ type: 'houseGalleryItem' })],
      validation: (rule) => rule.required().min(1)
    })
  ],
  preview: {
    select: {
      label: 'category.label.0.value',
      icon: 'category.icon',
      items: 'items'
    },
    prepare({ label, icon, items }) {
      const count = items?.length ?? 0
      return {
        title: label || 'No category',
        subtitle: `${count} ${count === 1 ? 'photo' : 'photos'}`,
        media: <IconPreview icon={icon} />
      }
    }
  }
})
