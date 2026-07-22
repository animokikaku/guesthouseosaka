import { expect, type Page, test } from '@playwright/test'

/**
 * Consolidated locale route tests.
 *
 * This file tests that all locale routes load successfully across all supported locales.
 * Test matrix: [en, ja, fr] x [/, /contact, /orange/gallery] = 9 tests
 *
 * This keeps locale routing as a whole-app browser boundary instead of
 * duplicating it in component-focused suites.
 */

const LOCALES = ['en', 'ja', 'fr'] as const

const ROUTES = [
  { path: '', name: 'homepage', selector: 'heading' },
  { path: '/contact', name: 'contact', selector: 'a[href*="/contact/"]' },
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
async function verifyPageContent(page: Page, route: Route) {
  switch (route.selector) {
    case 'heading': {
      // Homepage and house pages should have a heading
      const heading = page.getByRole('heading').first()
      await expect(heading).toBeVisible()
      break
    }

    case 'a[href*="/contact/"]': {
      // Contact page should have links to contact form types
      const contactLinks = page.locator('a[href*="/contact/"]')
      await expect(contactLinks.first()).toBeVisible()
      break
    }

    case 'img': {
      // Gallery page should have images
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()
      break
    }
  }
}
