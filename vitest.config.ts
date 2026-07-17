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
        'app/actions/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}'
      ],
      thresholds: {
        branches: 55,
        functions: 55,
        lines: 55,
        statements: 55
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
