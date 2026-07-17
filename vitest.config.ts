import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/playwright/**'],
    passWithNoTests: true,
    coverage: {
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'i18n/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'sanity/**/*.{ts,tsx}'
      ],
      thresholds: {
        branches: 40,
        functions: 40,
        lines: 40,
        statements: 40
      },
      exclude: [
        'components/ui/**',
        '**/__tests__/**',
        '**/*.test.{ts,tsx}',
        '**/__tests__/utils/**',
        '**/__tests__/mocks/**',
        '**/__tests__/mocks.{ts,tsx}',
        '**/__mocks__/**',
        '**/index.ts'
      ]
    }
  }
})
