import { defineConfig, devices } from '@playwright/test'
import { RESEND_MOCK_BASE_URL } from './e2e/mocks/resend'

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`

/**
 * Playwright configuration for E2E testing.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory containing test files
  testDir: './e2e',

  // Look for files with .spec.ts or .e2e.ts extension
  testMatch: '*.@(spec|e2e).ts',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Use all available vCPUs on CI now that tests run in a single job.
  workers: process.env.CI ? 4 : undefined,

  // Reporter to use
  reporter: process.env.CI ? 'github' : 'list',

  // Timeout per test
  timeout: 30 * 1000,

  expect: {
    // Timeout for async expect matchers
    timeout: 10 * 1000
  },

  // Run E2E tests against a production build, with outgoing Resend calls
  // pointed at a local stub. Skip the managed servers when testing an external
  // deployment via BASE_URL.
  webServer: process.env.BASE_URL
    ? undefined
    : [
        {
          command: 'bun run e2e/mocks/resend-server.ts',
          url: `${RESEND_MOCK_BASE_URL}/emails`,
          timeout: 30 * 1000,
          reuseExistingServer: !process.env.CI
        },
        {
          command: 'bun run build && bun run start',
          url: baseURL,
          timeout: 5 * 60 * 1000,
          reuseExistingServer: !process.env.CI,
          env: { RESEND_BASE_URL: RESEND_MOCK_BASE_URL }
        }
      ],

  // Shared settings for all the projects below
  use: {
    // Use baseURL for navigations
    baseURL,

    // Collect a trace when a failed test is retried. Tracing every CI test
    // slows each one down and uploads artifacts nobody looks at.
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',

    // Record videos on CI when test fails
    video: process.env.CI ? 'retain-on-failure' : undefined,

    // Take screenshot on failure
    screenshot: 'only-on-failure'
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'local',
      testIgnore: 'preview/**',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'preview',
      testMatch: '**/preview/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
