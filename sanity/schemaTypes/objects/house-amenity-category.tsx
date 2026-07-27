import { ComponentIcon } from '@sanity/icons/Component'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { Icon } from '@/lib/icons'

export const houseAmenityCategory = defineType({
  name: 'houseAmenityCategory',
  title: 'Amenity Category',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'amenityCategory' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'items',
      title: 'Amenities',
      type: 'array',
      of: [defineArrayMember({ type: 'houseAmenity' })],
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
        subtitle: `${count} ${count === 1 ? 'amenity' : 'amenities'}`,
        media: <Icon name={icon} />
      }
    }
  }
})
