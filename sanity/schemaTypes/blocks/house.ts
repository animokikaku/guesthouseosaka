import { HouseIdentifierValues } from '@/lib/types'
import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const house = defineType({
  name: 'house',
  title: 'House',
  icon: HomeIcon,
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'about', title: 'About' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'amenities', title: 'Amenities' },
    { name: 'location', title: 'Location' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'contact', title: 'Contact' }
  ],
  fields: [
    // ============================================
    // IDENTITY GROUP
    // ============================================
    defineField({
      name: 'slug',
      title: 'House ID',
      type: 'string',
      group: 'identity',
      description: 'Unique identifier for this house',
      options: { list: [...HouseIdentifierValues] },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'identity',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      group: 'identity',
      description: 'Main description shown on the house page',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'caption',
      title: 'Navigation Caption',
      type: 'internationalizedArrayText',
      group: 'identity',
      description: 'Short description shown in navigation dropdown',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'localizedImage',
      group: 'identity',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'localizedImage',
      group: 'identity',
      description:
        'Optional image displayed first in gallery grids (mobile carousel and desktop block gallery)'
    }),
    defineField({
      name: 'building',
      title: 'Building Facts',
      type: 'object',
      group: 'identity',
      fields: [
        defineField({
          name: 'rooms',
          title: 'Number of Rooms',
          type: 'number',
          validation: (rule) => rule.required().min(1)
        }),
        defineField({
          name: 'floors',
          title: 'Number of Floors',
          type: 'number',
          validation: (rule) => rule.required().min(1)
        }),
        defineField({
          name: 'startingPrice',
          title: 'Starting Price (JPY)',
          type: 'number',
          description: 'Monthly rent starting from',
          validation: (rule) => rule.required().min(0)
        })
      ]
    }),

    // ============================================
    // ABOUT GROUP
    // ============================================
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'object',
      group: 'about',
      fields: [
        defineField({
          name: 'description',
          title: 'Description',
          type: 'internationalizedArrayText',
          description: 'Detailed description of the house',
          validation: (rule) => rule.required(),
          options: { aiAssist: { translateAction: true } }
        }),
        defineField({
          name: 'highlights',
          title: 'Highlights',
          type: 'array',
          description: 'Key features as bullet points',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'text',
                  title: 'Text',
                  type: 'internationalizedArrayString',
                  validation: (rule) => rule.required(),
                  options: { aiAssist: { translateAction: true } }
                })
              ],
              preview: {
                select: { text: 'text.0.value' },
                prepare({ text }) {
                  return { title: text || 'No text' }
                }
              }
            })
          ]
        })
      ]
    }),

    // ============================================
    // GALLERY GROUP
    // ============================================
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      group: 'gallery',
      description: 'House photos organized by category. Drag to reorder.',
      of: [defineArrayMember({ type: 'galleryImage' })]
    }),

    // ============================================
    // AMENITIES GROUP
    // ============================================
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      group: 'amenities',
      description:
        'Amenities available at this house. Mark items as "featured" to show in the preview section.',
      of: [defineArrayMember({ type: 'houseAmenity' })]
    }),

    // ============================================
    // LOCATION GROUP
    // ============================================
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'location',
      fields: [
        defineField({
          name: 'highlight',
          title: 'Location Highlight',
          type: 'internationalizedArrayText',
          description: 'Key location selling point (e.g., "14 minutes walk to Namba")',
          options: { aiAssist: { translateAction: true } }
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'address'
        }),
        defineField({
          name: 'coordinates',
          title: 'Coordinates',
          type: 'geopoint',
          description: 'Pin location on the map'
        }),
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps URL',
          type: 'url',
          description: 'Direct link to Google Maps'
        }),
        defineField({
          name: 'placeId',
          title: 'Google Place ID',
          type: 'string',
          description: 'Google Maps Place ID for embedded maps'
        }),
        defineField({
          name: 'stations',
          title: 'Nearby Stations',
          type: 'array',
          description: 'Train stations within walking distance',
          of: [defineArrayMember({ type: 'stationInfo' })]
        }),
        defineField({
          name: 'nearby',
          title: 'Nearby Places',
          type: 'array',
          description: 'Notable places and facilities nearby',
          of: [defineArrayMember({ type: 'nearbyPlace' })]
        })
      ]
    }),

    // ============================================
    // PRICING GROUP
    // ============================================
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      group: 'pricing',
      fields: [
        defineField({
          name: 'rows',
          title: 'Pricing Table',
          type: 'array',
          description: 'Main pricing information rows',
          of: [defineArrayMember({ type: 'pricingRow' })]
        }),
        defineField({
          name: 'notes',
          title: 'Additional Notes',
          type: 'array',
          description: 'Additional pricing notes (discounts, fees, etc.)',
          of: [defineArrayMember({ type: 'pricingNote' })]
        })
      ]
    }),

    // ============================================
    // CONTACT GROUP
    // ============================================
    defineField({
      name: 'phone',
      title: 'Phone Numbers',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'domestic',
          title: 'Domestic',
          type: 'string',
          description: 'Phone number for calls from Japan'
        }),
        defineField({
          name: 'international',
          title: 'International',
          type: 'string',
          description: 'Phone number for calls from abroad'
        })
      ]
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
