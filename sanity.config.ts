'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import './sanity/studio.css'

import { assist } from '@sanity/assist'
import { languageFilter } from '@sanity/language-filter'
import { visionTool } from '@sanity/vision'
import { defineConfig, defineField, isKeySegment } from 'sanity'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { lucideIconPicker } from 'sanity-plugin-lucide-icon-picker'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { locales } from '@/sanity/config'
import { resolve } from '@/sanity/presentation/resolve'
import { type DocumentTypeName, documentTypes, schema } from '@/sanity/schemaTypes'
import { structure } from '@/sanity/structure'

const languages = locales.map(({ name, label }) => ({
  id: name,
  title: label
}))

// Document types that cannot be deleted (essential/singleton documents)
const protectedDocumentTypes: string[] = [
  'homePage',
  'faqPage',
  'contactPage',
  'house',
  'contactType',
  'legalNotice',
  'settings',
  // Taxonomy (referenced by houses)
  'galleryCategory',
  'amenityCategory',
  'pricingCategory'
] satisfies DocumentTypeName[]

// Document types where new documents cannot be created (singletons/fixed set)
const noCreateDocumentTypes: string[] = [
  'homePage',
  'faqPage',
  'contactPage',
  'settings',
  'contactType',
  'house',
  'legalNotice'
] satisfies DocumentTypeName[]

export default defineConfig({
  basePath: '/studio',
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  document: {
    actions: (prev, context) => {
      let actions = prev

      // Remove delete action for protected document types
      if (protectedDocumentTypes.includes(context.schemaType)) {
        actions = actions.filter(({ action }) => action !== 'delete')
      }

      // Remove duplicate and unpublish actions for singletons/fixed document sets
      if (noCreateDocumentTypes.includes(context.schemaType)) {
        actions = actions.filter(({ action }) => action !== 'duplicate' && action !== 'unpublish')
      }

      return actions
    },
    // Hide certain types from the "Create new document" menu
    newDocumentOptions: (prev) => {
      return prev.filter(({ templateId }) => !noCreateDocumentTypes.includes(templateId))
    }
  },
  plugins: [
    languageFilter({
      supportedLanguages: languages,
      defaultLanguages: [],
      documentTypes: documentTypes.map(({ name }) => name),
      filterField: (enclosingType, member, selectedLanguageIds) => {
        // Filter internationalized arrays
        if (
          enclosingType.jsonType === 'object' &&
          enclosingType.name.startsWith('internationalizedArray') &&
          'kind' in member
        ) {
          // Get last two segments of the field's path
          const pathEnd = member.field.path.slice(-2)
          // If the second-last segment is a _key, and the last segment is `value`,
          // It's an internationalized array value
          // And the array _key is the language of the field
          const language =
            pathEnd[1] === 'value' && isKeySegment(pathEnd[0]) ? pathEnd[0]._key : null

          return language ? selectedLanguageIds.includes(language) : false
        }

        // Filter internationalized objects if you have them
        // `localeString` must be registered as a custom schema type
        if (enclosingType.jsonType === 'object' && enclosingType.name.startsWith('locale')) {
          return selectedLanguageIds.includes(member.name)
        }

        return true
      }
    }),
    lucideIconPicker(),
    assist({
      translate: {
        field: {
          documentTypes: documentTypes.map(({ name }) => name),
          languages
        }
      }
    }),
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION }),
    presentationTool({
      previewUrl: {
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable'
        }
      },
      resolve
    }),
    internationalizedArray({
      languages,
      defaultLanguages: [routing.defaultLocale],
      fieldTypes: [
        'string',
        'text',
        defineField({
          name: 'stringArray',
          type: 'array',
          of: [{ type: 'string' }]
        }),
        defineField({
          name: 'portableText',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'Heading 1', value: 'h1' },
                { title: 'Heading 2', value: 'h2' },
                { title: 'Heading 3', value: 'h3' }
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' }
                ]
              },
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' }
              ]
            }
          ]
        })
      ]
    })
  ]
})
