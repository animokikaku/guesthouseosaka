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

        // Verify the page loaded with correct URL
        await expect(page).toHaveURL(new RegExp(`/en/${slug}`))

        // Page should have a title
        const title = await page.title()
        expect(title).toBeTruthy()
      })
    }
  })

  // Note: Visibility tests for About, Amenities, Pricing, Location sections
  // are covered by unit tests in components/house/__tests__/

  test.describe('Amenities Section', () => {
    test('opens amenities dialog when clicking show all', async ({ page }) => {
      await page.goto(`/en/${testHouse}`)

      const showAllButton = page.getByRole('button', {
        name: /Show all.*amenities/i
      })
      await showAllButton.click()

      // Dialog should appear with amenities content
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
    })
  })

  test.describe('Gallery Section', () => {
    test('gallery link navigates to gallery page', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      await page.goto(`/en/${testHouse}`)

      const galleryButton = page.getByRole('link', {
        name: /Show all photos/i
      })
      await galleryButton.click()

      // Should navigate to gallery page
      await expect(page).toHaveURL(new RegExp(`/en/${testHouse}/gallery`))
    })
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
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
