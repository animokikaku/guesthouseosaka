import { defineConfig } from '@eloqnt/cli'

export default defineConfig({
  srcPath: '.',
  messages: {
    path: './messages',
    locales: 'infer',
    sourceLocale: 'en',
    format: 'json'
  },
  lint: {
    overrides: [
      {
        // Read outside React, in route `head()`s (`getMetadataTranslator`) and
        // `lib/manifest.ts`, through use-intl's `createTranslator`, which the
        // usage scan doesn't follow; it only tracks `useTranslations`.
        keys: ['Metadata.contact_title', 'Metadata.faq_title', 'Metadata.manifest_name'],
        rules: { 'orphan-message': 'off' }
      }
    ]
  }
})
