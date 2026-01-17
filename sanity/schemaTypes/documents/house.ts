import { HouseIdentifierSchema, HouseIdentifierValues } from '@/lib/types'
import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const house = defineType({
  name: 'house',
  title: 'House',
  icon: HomeIcon,
  type: 'document',
  orderings: [
    {
      title: 'Global Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }]
    }
  ],
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'amenities', title: 'Amenities' },
    { name: 'location', title: 'Location' },
    { name: 'business', title: 'Pricing & Contact' }
  ],
  fields: [
    // Hidden field for @sanity/orderable-document-list
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true
    }),

    // ============================================
    // OVERVIEW GROUP
    // ============================================
    defineField({
      name: 'slug',
      title: 'House ID',
      type: 'string',
      group: 'overview',
      description: 'Unique identifier for this house',
      hidden: true,
      readOnly: true,
      options: {
        list: [...HouseIdentifierValues],
        layout: 'dropdown'
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!HouseIdentifierSchema.safeParse(value).success) {
            return `Must be one of: ${HouseIdentifierValues.join(', ')}`
          }
          return true
        })
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'overview',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      group: 'overview',
      description: 'Main description shown on the house page',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'caption',
      title: 'Navigation Caption',
      type: 'internationalizedArrayText',
      group: 'overview',
      description: 'Short description shown in navigation dropdown',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'localizedImage',
      group: 'overview',
      validation: (rule) => rule.required().assetRequired()
    }),

    defineField({
      name: 'building',
      title: 'Building Facts',
      type: 'houseBuilding',
      group: 'overview'
    }),

    // ============================================
    // CONTENT GROUP
    // ============================================
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'internationalizedArrayPortableText',
      group: 'content',
      description:
        'Detailed description and highlights of the house. Use bullet points for key features.',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),

    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'localizedImage',
      group: 'content',
      description:
        'Optional image displayed first in gallery grids (mobile carousel and desktop block gallery)'
    }),
    defineField({
      name: 'galleryCategories',
      title: 'Photos by Category',
      type: 'array',
      group: 'content',
      description:
        'Photos grouped by category. Drag to reorder within each category.',
      of: [defineArrayMember({ type: 'houseGalleryCategory' })],
      options: { sortable: false }
    }),

    // ============================================
    // AMENITIES GROUP
    // ============================================
    defineField({
      name: 'amenityCategories',
      title: 'Amenities by Category',
      type: 'array',
      group: 'amenities',
      description:
        'Amenities grouped by category. Drag to reorder within each category.',
      of: [defineArrayMember({ type: 'houseAmenityCategory' })],
      options: { sortable: false }
    }),

    // ============================================
    // LOCATION GROUP
    // ============================================
    defineField({
      name: 'location',
      title: 'Location',
      type: 'houseLocation',
      group: 'location'
    }),
    defineField({
      name: 'map',
      title: 'Map',
      type: 'houseMap',
      group: 'location'
    }),

    // ============================================
    // PRICING & CONTACT GROUP
    // ============================================
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'array',
      group: 'business',
      description: 'Pricing information rows with rich text content',
      of: [defineArrayMember({ type: 'pricingRow' })],
      validation: (rule) =>
        rule.min(1).error('At least one pricing row is required')
    }),
    defineField({
      name: 'extraCosts',
      title: 'Extra Costs',
      type: 'array',
      group: 'business',
      description:
        'Additional costs shown in the FAQ section. Order is controlled on the FAQ page.',
      of: [defineArrayMember({ type: 'extraCostItem' })],
      options: { sortable: false },
      validation: (rule) =>
        rule.custom(
          (items: Array<{ category?: { _ref: string } }> | undefined) => {
            if (!items || items.length === 0) return true
            const categoryRefs = items
              .map((item) => item.category?._ref)
              .filter(Boolean)
            const uniqueRefs = new Set(categoryRefs)
            if (uniqueRefs.size !== categoryRefs.length) {
              return 'Each category can only be used once'
            }
            return true
          }
        )
    }),

    defineField({
      name: 'phone',
      title: 'Phone Numbers',
      type: 'housePhone',
      group: 'business',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      slug: 'slug',
      media: 'image.asset'
    },
    prepare({ title, slug, media }) {
      return {
        title: title || 'Untitled House',
        subtitle: slug || 'No ID',
        media
      }
    }
  }
})
