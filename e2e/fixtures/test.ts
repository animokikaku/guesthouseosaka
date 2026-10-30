import { test as base } from '@playwright/test'

// Every map load and Places UI Kit request counts against the key's daily
// quota, and no test asserts on the map, so the location section stays on its
// skeleton instead.
const GOOGLE_MAPS_HOSTS = ['https://maps.googleapis.com/**', 'https://places.googleapis.com/**']

/** `@playwright/test`'s `test`, with Google Maps blocked. Import it in every spec. */
export const test = base.extend<{ blockGoogleMaps: void }>({
  blockGoogleMaps: [
    async ({ context }, use) => {
      for (const url of GOOGLE_MAPS_HOSTS) await context.route(url, (route) => route.abort())
      await use()
    },
    { auto: true }
  ]
})

export { devices, expect, type Page, type TestInfo } from '@playwright/test'
