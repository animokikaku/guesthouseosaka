import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Workers read the time zone once at startup, so a test can't change it. Run
// the suite behind UTC, where a calendar date parsed as UTC midnight shows up
// as the day before: the bug a UTC server or a Tokyo laptop would hide.
process.env.TZ = 'America/Los_Angeles'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'jsdom',
    // Reuses one jsdom per worker while keeping each file in its own VM context,
    // roughly halving the run. See vitest.setup.ts for the globals the VM lacks.
    pool: 'vmThreads',
    setupFiles: ['./vitest.setup.ts'],
    // next-intl imports `next/navigation` without an extension, which only a
    // bundler resolves, so Vite processes it instead of Node.
    server: { deps: { inline: ['next-intl'] } },
    // Fixed values instead of whatever the shell or CI exports, so URLs built from
    // them (Sanity CDN, canonical links, assets) are the same on every machine.
    env: {
      NEXT_PUBLIC_APP_URL: 'https://guesthouseosaka.test',
      NEXT_PUBLIC_BLOB_STORAGE_URL: 'https://test.public.blob.vercel-storage.com',
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'test-maps-key',
      NEXT_PUBLIC_SANITY_API_VERSION: '2025-01-01',
      NEXT_PUBLIC_SANITY_DATASET: 'production',
      NEXT_PUBLIC_SANITY_PROJECT_ID: 'test',
      RESEND_API_KEY: 're_test',
      SANITY_API_READ_TOKEN: 'test-token'
    },
    globals: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/playwright/**'],
    passWithNoTests: true,
    coverage: {
      // Sanity schemas are validated through type generation, TypeScript, and production builds.
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'i18n/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}'
      ],
      thresholds: {
        branches: 40,
        functions: 40,
        lines: 40,
        statements: 40
      },
      exclude: [
        'components/ui/**',
        'i18n/navigation.ts',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/*.story.{ts,tsx}',
        '**/__mocks__/**'
      ]
    }
  }
})
