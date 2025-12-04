import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'

const nextIntl = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        name: 'next/link',
        message: 'Please import from `@/i18n/navigation` instead.'
      },
      {
        name: 'next/navigation',
        importNames: [
          'redirect',
          'permanentRedirect',
          'useRouter',
          'usePathname'
        ],
        message: 'Please import from `@/i18n/navigation` instead.'
      }
    ]
  }
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  nextIntl,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'components/ui/**'
  ])
])

export default eslintConfig
