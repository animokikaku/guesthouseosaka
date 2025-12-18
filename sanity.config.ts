'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { assist } from '@sanity/assist'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import { defineConfig, defineField } from 'sanity'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { routing } from '@/i18n/routing'
import { env } from '@/lib/env'
import { locales } from '@/sanity/config'
import { resolve } from '@/sanity/presentation/resolve'
import { schema } from '@/sanity/schemaTypes'
import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { structure } from '@/sanity/structure'

const languages = locales.map(({ name, label }) => ({
  id: name,
  title: label
}))

export default defineConfig({
  basePath: '/studio',
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    assist({
      translate: {
        field: {
          documentTypes: ['galleryWall', 'collection'],
          languages
        },
        document: {
          languageField: LocaleField.name,
          documentTypes: ['homePage', 'faqPage', 'housePage', 'contactPage']
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
        // TODO: Add other custom field types as needed
        defineField({
          name: 'stringArray',
          type: 'array',
          of: [{ type: 'string' }]
        })
      ]
    }),
    documentInternationalization({
      supportedLanguages: languages,
      languageField: LocaleField.name,
      schemaTypes: ['homePage', 'faqPage', 'housePage', 'contactPage']
    })
  ]
})
