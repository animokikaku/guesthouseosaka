import { expect, type Page, test } from './fixtures/test'
import { existsSync } from 'node:fs'

/**
 * Every page loads with a self-referencing canonical: each route in the default
 * locale, and the deepest one in a locale whose URL prefix (/zh-tw) is mapped
 * rather than its code (zh-TW) = 5 tests.
 *
 * Locales share one code path, so more locales or routes per locale add run
 * time, not cases. Every catalog is checked for parity in
 * i18n/__tests__/messages.test.ts, every locale's hreflang by the sitemap test,
 * and ja and fr pages are rendered by the form, language switcher and
 * not-found tests.
 *
 * This keeps locale routing as a whole-app browser boundary instead of
 * duplicating it in component-focused suites.
 */

const ROUTES = [
  { path: '', name: 'homepage', selector: 'heading' },
  { path: '/faq', name: 'faq', selector: 'heading' },
  { path: '/contact', name: 'contact', selector: 'a[href*="/contact/"]' },
  { path: '/orange/gallery', name: 'gallery', selector: 'img' }
] as const

type Route = (typeof ROUTES)[number]

// URL prefixes (zh-TW is served under a lowercase prefix)
const CASES = [
  ...ROUTES.map((route) => ({ locale: 'en', route })),
  { locale: 'zh-tw', route: ROUTES[3] }
]

// Origin the app was built with: CI sets it in the environment (which wins),
// local builds read it from .env.
if (existsSync('.env')) process.loadEnvFile('.env')
const APP_URL = process.env.VITE_APP_URL
if (!APP_URL) throw new Error('VITE_APP_URL is required to check canonical links')

test.describe('Locale Routes', () => {
  test.describe.parallel('All locale and route combinations', () => {
    for (const { locale, route } of CASES) {
      const fullPath = `/${locale}${route.path}`

      test(`${locale} - ${route.name} (${fullPath})`, async ({ page }) => {
        await page.goto(fullPath)

        await expect(page).toHaveURL(new RegExp(`/${locale}${route.path}/?$`))

        // Self-referencing canonical, so copies served on other hosts defer to this URL
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
          'href',
          new URL(fullPath, APP_URL).toString()
        )

        await verifyPageContent(page, route)
      })
    }
  })
})

/**
 * Verify that the page loaded with appropriate content for the route type.
 */
async function verifyPageContent(page: Page, route: Route) {
  switch (route.selector) {
    case 'heading': {
      // CMS pages lead with their page heading
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
