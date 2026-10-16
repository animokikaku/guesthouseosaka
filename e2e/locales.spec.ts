import { expect, type Page, test } from '@playwright/test'
import { existsSync } from 'node:fs'

/**
 * Consolidated locale route tests.
 *
 * Every page loads with a self-referencing canonical, in two locales:
 * [en, zh-tw] x [/, /faq, /contact, /orange/gallery] = 8 tests
 *
 * Locales share one code path, so the other three add run time, not cases. The
 * two kept are the ones that can break differently: the default locale, and one
 * whose URL prefix (/zh-tw) is mapped rather than its code (zh-TW). Every
 * catalog is checked for parity in i18n/__tests__/messages.test.ts, every
 * locale's hreflang by the sitemap test, and ja and fr pages are rendered by
 * the form, language switcher and not-found tests.
 *
 * This keeps locale routing as a whole-app browser boundary instead of
 * duplicating it in component-focused suites.
 */

// URL prefixes (zh-TW is served under a lowercase prefix)
const LOCALES = ['en', 'zh-tw'] as const

const ROUTES = [
  { path: '', name: 'homepage', selector: 'heading' },
  { path: '/faq', name: 'faq', selector: 'heading' },
  { path: '/contact', name: 'contact', selector: 'a[href*="/contact/"]' },
  { path: '/orange/gallery', name: 'gallery', selector: 'img' }
] as const

type Route = (typeof ROUTES)[number]

// Origin the app was built with: CI sets it in the environment (which wins, as in Next),
// local builds read it from .env.local.
if (existsSync('.env.local')) process.loadEnvFile('.env.local')
const APP_URL = process.env.NEXT_PUBLIC_APP_URL
if (!APP_URL) throw new Error('NEXT_PUBLIC_APP_URL is required to check canonical links')

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

          // Self-referencing canonical, so copies served on other hosts defer to this URL
          await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
            'href',
            new URL(fullPath, APP_URL).toString()
          )

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
