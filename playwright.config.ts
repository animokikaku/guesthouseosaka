import { defineConfig, devices } from '@playwright/test'
import { RESEND_MOCK_BASE_URL } from './e2e/mocks/resend'

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`
const realEmail = process.env.E2E_REAL_EMAIL === '1'

/**
 * Playwright configuration for E2E testing.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory containing test files
  testDir: './e2e',

  // Look for files with .spec.ts or .e2e.ts extension
  testMatch: '*.@(spec|e2e).ts',

  // Each config owns a subfolder, since CI runs this suite alongside the
  // component tests and Playwright empties its output folder on start.
  outputDir: 'test-results/e2e',

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

  // Run E2E tests against a production build whose emails go to a local
  // Resend stand-in (e2e/mocks/resend.ts): `RESEND_BASE_URL` is built in, so a
  // submission can't reach the real API with the key from `.env`. Skip the
  // managed servers when testing an external deployment via BASE_URL.
  //
  // Never reuse an existing server: a `bun dev` already on this port wasn't
  // built with the stand-in's URL, so its submissions reach the real Resend
  // API. The build is the cost of that defence actually being in place.
  //
  // `bun run test:e2e:preview` (E2E_REAL_EMAIL) builds the preview environment
  // instead, without the stand-in: workerd runs the same bundle `void deploy`
  // uploads, and `DEPLOY_ENV=preview` sends its one email to Resend's test
  // inbox with the key from `.env`.
  webServer: process.env.BASE_URL
    ? undefined
    : realEmail
      ? {
          command: 'DEPLOY_ENV=preview bun run build && bun run start',
          url: baseURL,
          timeout: 5 * 60 * 1000,
          reuseExistingServer: false
        }
      : [
          {
            command: 'bun e2e/mocks/resend-server.ts',
            url: `${RESEND_MOCK_BASE_URL}/emails`,
            reuseExistingServer: false
          },
          {
            command: 'bun run build && bun run start',
            url: baseURL,
            timeout: 5 * 60 * 1000,
            reuseExistingServer: false,
            env: {
              RESEND_BASE_URL: RESEND_MOCK_BASE_URL,
              // The server runs in workerd, which only sees the shell's
              // variables (CI's secrets) when asked to.
              CLOUDFLARE_INCLUDE_PROCESS_ENV: 'true'
            }
          }
        ],

  // Shared settings for all the projects below
  use: {
    // Use baseURL for navigations
    baseURL,

    // Collect a trace when a failed test is retried. Tracing every CI test
    // slows each one down and uploads artifacts nobody looks at. No video: it
    // has to record every test to keep the failures, which cost a fifth of the
    // run, and the trace's screencast already shows what happened.
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',

    // Take screenshot on failure
    screenshot: 'only-on-failure'
  },

  // Configure projects for major browsers. A real-email server only runs the
  // preview project, so the form tests can't reach Resend unmocked.
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
  ].filter((project) => !realEmail || project.name === 'preview')
})
