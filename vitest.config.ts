import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/playwright/**'],
    passWithNoTests: true,
    coverage: {
      exclude: [
        'components/ui/**',
        '**/__tests__/utils/**',
        '**/__tests__/mocks/**',
        '**/__tests__/mocks.{ts,tsx}',
        '**/__mocks__/**',
        '**/index.ts'
      ]
    }
  }
})
