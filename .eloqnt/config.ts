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
        // Read outside React through use-intl's `createTranslator`, which the
        // usage scan doesn't follow; it only tracks `useTranslations`. The
        // Metadata keys are read in route `head()`s (`getMetadataTranslator`)
        // and `app/manifest.ts`, the LineBot replies in `app/routes/api/line.ts`.
        keys: [
          'Metadata.contact_title',
          'Metadata.faq_title',
          'Metadata.manifest_name',
          'LineBot.*'
        ],
        rules: { 'orphan-message': 'off' }
      }
    ]
  }
})
