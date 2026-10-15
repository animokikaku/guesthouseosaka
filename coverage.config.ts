/**
 * Source files counted toward coverage, shared by the unit report
 * (vitest.config.mts) and the component suite's browser report
 * (playwright/coverage.ts) so Codecov merges the two over the same scope.
 * Sanity schemas are validated through type generation, TypeScript, and
 * production builds.
 */
export const coverageInclude = [
  'app/**/*.{ts,tsx}',
  'components/**/*.{ts,tsx}',
  'hooks/**/*.{ts,tsx}',
  'i18n/**/*.{ts,tsx}',
  'lib/**/*.{ts,tsx}'
]

export const coverageExclude = [
  'components/ui/**',
  'i18n/navigation.ts',
  '**/__tests__/**',
  '**/*.test.{ts,tsx}',
  '**/*.story.{ts,tsx}',
  '**/__mocks__/**'
]
