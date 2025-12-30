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

      // Click the first contact type link (tour)
      const tourLink = page.locator('a[href*="/contact/tour"]')
      if ((await tourLink.count()) > 0) {
        await tourLink.click()
        await expect(page).toHaveURL(/\/en\/contact\/tour/)
      }
    })
  })

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`contact page loads in ${locale} locale`, async ({ page }) => {
        await page.goto(`/${locale}/contact`)
        await expect(page).toHaveURL(new RegExp(`/${locale}/contact`))

        // Contact types should be visible
        const links = page.locator('a[href*="/contact/"]')
        await expect(links.first()).toBeVisible()
      })
    }
  })
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

  test.describe('Internationalization', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`FAQ page loads in ${locale} locale`, async ({ page }) => {
        await page.goto(`/${locale}/faq`)
        await expect(page).toHaveURL(new RegExp(`/${locale}/faq`))

        // Accordion should be visible (uses data-slot="accordion")
        const accordion = page.locator('[data-slot="accordion"]')
        await expect(accordion).toBeVisible()
      })
    }
  })
})
