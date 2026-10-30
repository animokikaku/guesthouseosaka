/**
 * The Studio's configuration, hosted by Sanity (see docs/sanity-workflow.md).
 * It shares the site's config, locales, icons and types through `@/`.
 */

import { visionTool } from '@sanity/vision'
import { defineConfig, defineField } from 'sanity'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { localeConfig } from '@/i18n/locales'
import { routing } from '@/i18n/routing'
import { SANITY_API_VERSION, SANITY_PROJECT_ID } from '@/lib/config'
import { env } from '@/lib/env'
import { iconMap } from '@/lib/icons'
import { lucideIconPicker } from '@/studio/plugins/lucide-icon-picker'
import { resolve } from '@/studio/presentation/resolve'
import { siteUrl } from '@/studio/site-url'
import { documentTypes, fixedSetTypes, protectedTypes, schema } from '@/studio/schemaTypes'
import { structure } from '@/studio/structure'

const languages = routing.locales.map((locale) => ({
  id: locale,
  title: localeConfig[locale].label
}))

export default defineConfig({
  projectId: SANITY_PROJECT_ID,
  dataset: env.VITE_SANITY_DATASET,
  tasks: {
    enabled: false
  },
  scheduledPublishing: {
    enabled: false
  },
  scheduledDrafts: {
    enabled: false
  },
  releases: {
    enabled: false
  },
  // Add and edit the content schema in the './schemaTypes' folder
  schema,
  document: {
    actions: (prev, context) => {
      let actions = prev

      // Remove delete action for protected document types
      if (protectedTypes.some((type) => type === context.schemaType)) {
        actions = actions.filter(({ action }) => action !== 'delete')
      }

      // Remove duplicate and unpublish actions for singletons/fixed document sets
      if (fixedSetTypes.some((type) => type === context.schemaType)) {
        actions = actions.filter(({ action }) => action !== 'duplicate' && action !== 'unpublish')
      }

      return actions
    },
    // Hide certain types from the "Create new document" menu
    newDocumentOptions: (prev) => {
      return prev.filter(({ templateId }) => !fixedSetTypes.some((type) => type === templateId))
    }
  },
  plugins: [
    lucideIconPicker({ icons: iconMap }),
    structureTool({ structure }),
    ...(process.env.NODE_ENV === 'development'
      ? [visionTool({ defaultApiVersion: SANITY_API_VERSION })]
      : []),
    presentationTool({
      // The development Studio also previews the dev server on any port and
      // every Worker Preview (`<branch>-guesthouseosaka.animokikaku.workers.dev`),
      // picked by the `preview` search param the site's `/studio` adds.
      ...(env.VITE_SANITY_DATASET === 'production'
        ? {}
        : {
            allowOrigins: [
              'http://localhost:*',
              'https://*-guesthouseosaka.animokikaku.workers.dev'
            ]
          }),
      previewUrl: {
        initial: siteUrl,
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
      languageFilter: {
        documentTypes: documentTypes.map(({ name }) => name)
      },
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
