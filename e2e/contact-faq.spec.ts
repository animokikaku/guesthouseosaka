import { expect, test } from '@playwright/test'

test.describe('Contact Page', () => {
  // Note: Form field visibility tests are now covered by unit tests in
  // components/forms/__tests__/contact-form.test.tsx
  // components/forms/__tests__/tour-form.test.tsx
  // components/forms/__tests__/move-in-form.test.tsx

  test.describe('Contact Types List', () => {
    test('navigates to tour form when clicking tour option', async ({
      page
    }) => {
      await page.goto('/en/contact')

      // Wait for link to be visible and click
      const tourLink = page.locator('a[href*="/contact/tour"]')
      await expect(tourLink).toBeVisible()
      await Promise.all([
        page.waitForURL(/\/en\/contact\/tour/),
        tourLink.click()
      ])
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})

test.describe('FAQ Page', () => {
  test.describe('FAQ Accordion', () => {
    test('accordion items are expandable', async ({ page }) => {
      await page.goto('/en/faq')

      // Find and click first accordion trigger
      const firstTrigger = page
        .locator('[data-slot="accordion-trigger"]')
        .first()
      await expect(firstTrigger).toBeVisible()

      // Check initial state (should be collapsed)
      await expect(firstTrigger).toHaveAttribute('data-state', 'closed')

      // Click to expand
      await firstTrigger.click()

      // Check expanded state
      await expect(firstTrigger).toHaveAttribute('data-state', 'open')

      // Content should be visible
      const firstContent = page
        .locator('[data-slot="accordion-content"]')
        .first()
      await expect(firstContent).toBeVisible()
    })

    test('multiple accordion items can be expanded', async ({ page }) => {
      await page.goto('/en/faq')

      const triggers = page.locator('[data-slot="accordion-trigger"]')
      const count = await triggers.count()

      if (count >= 2) {
        // Expand first item
        await triggers.nth(0).click()
        await expect(triggers.nth(0)).toHaveAttribute('data-state', 'open')

        // Expand second item
        await triggers.nth(1).click()
        await expect(triggers.nth(1)).toHaveAttribute('data-state', 'open')

        // First should still be open (type="multiple")
        await expect(triggers.nth(0)).toHaveAttribute('data-state', 'open')
      }
    })
  })

  // Note: Locale tests are now consolidated in e2e/locales.spec.ts
})
