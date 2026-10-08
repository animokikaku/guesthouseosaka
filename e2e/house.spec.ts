import { expect, test } from '@playwright/test'

// House slugs defined in lib/types.ts
const HOUSE_SLUGS = ['orange', 'apple', 'lemon'] as const

test.describe('House Page', () => {
  // Use the first house for detailed section tests
  const testHouse = HOUSE_SLUGS[0]

  test.describe('Page Loading', () => {
    for (const slug of HOUSE_SLUGS) {
      test(`${slug} house page loads correctly`, async ({ page }) => {
        await page.goto(`/en/${slug}`)

        await expect(page).toHaveURL(new RegExp(`/en/${slug}`))
        // The document is data-driven, so an empty title means the query failed
        await expect(page).toHaveTitle(/\S/)
        await expect(page.locator(`article#${slug}`)).toBeVisible()
      })
    }
  })

  // Note: Visibility tests for About, Amenities, Pricing, Location sections
  // are covered by unit tests in components/house/__tests__/

  test('applies the house theme before hydration on direct visits', async ({ page }) => {
    await page.route('**/_next/static/chunks/*.js', (route) => route.abort())

    await page.goto(`/en/${testHouse}`, { waitUntil: 'domcontentloaded' })

    await expect(page.locator('body')).toHaveClass(/theme-orange/)
  })

  test.describe('Navigation', () => {
    test('can navigate to other houses from tabs', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      // Find another house link in the navigation and click it
      const tabsNav = page.locator('#tabs')
      const houseLinks = tabsNav.getByRole('link')

      const firstLink = houseLinks.first()
      await firstLink.click()

      // Should navigate to another house page
      await expect(page).toHaveURL(new RegExp(`/en/(orange|apple|lemon)`))
      await expect(page.locator('body')).toHaveClass(/theme-(orange|red|yellow)/)
    })
  })

  test.describe('Gallery Modal', () => {
    // Cache Components keeps the closed modal alive in <Activity>, so reopening
    // it must not restore its closed state.
    test('reopens after being closed', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const galleryLink = page.getByRole('link', { name: /Show all/ }).first()
      const dialog = page.getByRole('dialog')

      await galleryLink.click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery$`))
      await expect(dialog).toBeVisible()

      await dialog.getByRole('button', { name: 'Close gallery' }).click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}$`))
      await expect(dialog).toBeHidden()

      await galleryLink.click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery$`))
      await expect(dialog).toBeVisible()
    })

    test('reopens after browser back navigation', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const galleryLink = page.getByRole('link', { name: /Show all/ }).first()
      const dialog = page.getByRole('dialog')

      await galleryLink.click()
      await expect(dialog).toBeVisible()

      await page.goBack()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}$`))
      await expect(dialog).toBeHidden()

      await galleryLink.click()
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery$`))
      await expect(dialog).toBeVisible()
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
