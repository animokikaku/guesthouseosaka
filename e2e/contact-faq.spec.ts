import { expect, test } from '@playwright/test'

test.describe('FAQ Page', () => {
  test.describe('FAQ Accordion', () => {
    test('accordion items are expandable', async ({ page }) => {
      await page.goto('/en/faq')

      // Find and click first accordion trigger
      const firstTrigger = page.locator('[data-slot="accordion-trigger"]').first()
      await expect(firstTrigger).toBeVisible()

      // Check initial state (should be collapsed)
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'false')

      // Click to expand
      await firstTrigger.click()

      // Check expanded state
      await expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')

      // Content should be visible
      const firstContent = page.locator('[data-slot="accordion-content"]').first()
      await expect(firstContent).toBeVisible()
    })

    test('multiple accordion items can be expanded', async ({ page }) => {
      await page.goto('/en/faq')

      const triggers = page.locator('[data-slot="accordion-trigger"]')
      const count = await triggers.count()

      expect(count).toBeGreaterThanOrEqual(2)

      // Expand first item
      await triggers.nth(0).click()
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true')

      // Expand second item
      await triggers.nth(1).click()
      await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true')

      // First should still be open (multiple accordion)
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true')
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
