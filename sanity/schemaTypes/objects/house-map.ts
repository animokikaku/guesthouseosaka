import { defineField, defineType } from 'sanity'

export const houseMap = defineType({
  name: 'houseMap',
  title: 'Map',
  type: 'object',
  description: 'Google Maps configuration and address for JSON-LD',
  fields: [
    defineField({
      name: 'googleMapsUrl',
      title: 'Google Maps URL',
      type: 'url',
      description: 'Direct link to Google Maps',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'placeId',
      title: 'Google Place ID',
      type: 'string',
      description: 'Google Maps Place ID for embedded maps',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'placeImage',
      title: 'Place Image',
      type: 'localizedImage',
      description: 'Image for Google Maps Place card',
      validation: (rule) => rule.required().assetRequired()
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Pin location on the map',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'address',
      validation: (rule) => rule.required()
    })
  ]
})
