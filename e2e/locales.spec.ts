import { expect, test } from '@playwright/test'

/**
 * Consolidated locale route tests.
 *
 * This file tests that all locale routes load successfully across all supported locales.
 * Test matrix: [en, ja, fr] x [/, /contact, /faq, /orange, /orange/gallery] = 15 tests
 *
 * This replaces duplicate locale tests previously scattered across:
 * - homepage.spec.ts (Locale Routes section)
 * - contact-faq.spec.ts (Internationalization sections)
 * - house.spec.ts (Internationalization section)
 * - gallery.spec.ts (Internationalization section)
 * - smoke.spec.ts (Internationalization section)
 */

const LOCALES = ['en', 'ja', 'fr'] as const
type Locale = (typeof LOCALES)[number]

const ROUTES = [
  { path: '', name: 'homepage', selector: 'heading' },
  { path: '/contact', name: 'contact', selector: 'a[href*="/contact/"]' },
  { path: '/faq', name: 'faq', selector: '[data-slot="accordion"]' },
  { path: '/orange', name: 'house', selector: 'heading' },
  { path: '/orange/gallery', name: 'gallery', selector: 'img' }
] as const

type Route = (typeof ROUTES)[number]

test.describe('Locale Routes', () => {
  test.describe.parallel('All locale and route combinations', () => {
    for (const locale of LOCALES) {
      for (const route of ROUTES) {
        const fullPath = `/${locale}${route.path}`

        test(`${locale} - ${route.name} (${fullPath})`, async ({ page }) => {
          // Navigate to the route
          await page.goto(fullPath)

          // Verify URL loaded correctly
          await expect(page).toHaveURL(new RegExp(`/${locale}${route.path}/?$`))

          // Verify page has content based on route type
          await verifyPageContent(page, route)
        })
      }
    }
  })
})

/**
 * Verify that the page loaded with appropriate content for the route type.
 */
async function verifyPageContent(
  page: import('@playwright/test').Page,
  route: Route
) {
  switch (route.selector) {
    case 'heading':
      // Homepage and house pages should have a heading
      const heading = page.getByRole('heading').first()
      await expect(heading).toBeVisible()
      break

    case 'a[href*="/contact/"]':
      // Contact page should have links to contact form types
      const contactLinks = page.locator('a[href*="/contact/"]')
      await expect(contactLinks.first()).toBeVisible()
      break

    case '[data-slot="accordion"]':
      // FAQ page should have an accordion
      const accordion = page.locator('[data-slot="accordion"]')
      await expect(accordion).toBeVisible()
      break

    case 'img':
      // Gallery page should have images
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()
      break
  }
}
