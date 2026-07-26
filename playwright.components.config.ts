import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.COMPONENT_TEST_PORT || 3100)
const galleryURL = `http://127.0.0.1:${PORT}/playwright/gallery/index.html`

export default defineConfig({
  testDir: './playwright/components',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000
  },
  webServer: {
    command: `bunx vite --config playwright/gallery/vite.config.ts --host 127.0.0.1 --port ${PORT}`,
    url: galleryURL,
    reuseExistingServer: !process.env.CI
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: galleryURL,
    reuseContext: true,
    serviceWorkers: 'block',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
})
