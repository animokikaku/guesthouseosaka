import { expect, test } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    // Verify the page loaded by checking for essential elements
    await expect(page).toHaveURL(/\/(en|ja|fr)?$/)

    // Page should have a title
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('homepage has navigation', async ({ page }) => {
    await page.goto('/')

    // Check that the main navigation exists
    const nav = page.locator('nav')
    await expect(nav.first()).toBeVisible()
  })

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`${locale} locale is accessible`, async ({ page }) => {
        await page.goto(`/${locale}`)

        // Verify the locale route loads
        await expect(page).toHaveURL(new RegExp(`/${locale}`))
      })
    }
  })

  test.describe('Main pages load', () => {
    test('FAQ page loads', async ({ page }) => {
      await page.goto('/en/faq')
      await expect(page).toHaveURL(/\/en\/faq/)
    })

    test('Contact page loads', async ({ page }) => {
      await page.goto('/en/contact')
      await expect(page).toHaveURL(/\/en\/contact/)
    })
  })
})
