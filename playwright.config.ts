import { defineConfig, devices } from '@playwright/test'

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`
const vercelProtectionBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

const extraHTTPHeaders =
  process.env.BASE_URL && vercelProtectionBypass
    ? {
        'x-vercel-protection-bypass': vercelProtectionBypass,
        'x-vercel-set-bypass-cookie': 'true'
      }
    : undefined

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

  // Run E2E tests against a production build. Skip the managed server when
  // testing an external deployment via BASE_URL.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'bun run build && bun run start',
        url: baseURL,
        timeout: 5 * 60 * 1000,
        reuseExistingServer: !process.env.CI
      },

  // Shared settings for all the projects below
  use: {
    // Use baseURL for navigations
    baseURL,
    extraHTTPHeaders,

    // Collect trace when retrying the failed test
    trace: process.env.CI ? 'on' : 'retain-on-failure',

    // Record videos on CI when test fails
    video: process.env.CI ? 'retain-on-failure' : undefined,

    // Take screenshot on failure
    screenshot: 'only-on-failure'
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
