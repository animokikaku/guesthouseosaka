import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  // Note: Footer visibility tests are now covered by unit tests in
  // components/__tests__/site-footer.test.tsx

  test.describe('Navigation', () => {
    test('Contact link navigates to contact page', async ({ page }) => {
      await page.goto('/en')

      const nav = page.getByRole('navigation')
      const contactLink = nav.getByRole('link', { name: /contact/i })
      await contactLink.first().click()

      await expect(page).toHaveURL(/\/en\/contact/)
    })

    test('house card link navigates to house page', async ({ page }) => {
      await page.goto('/en')

      // Wait for the collection to load and find house links
      // House cards are in a grid and link to /[locale]/[house] routes
      const houseLink = page.locator('[data-slot="item-group"] a[href*="/en/"]').first()
      await expect(houseLink).toBeVisible()
      await houseLink.click()

      // Should navigate to a house page (orange, apple, or lemon)
      await expect(page).toHaveURL(/\/en\/(orange|apple|lemon)/)
    })
  })

  test.describe('Language Switcher', () => {
    test('preserves current page when switching language', async ({ page }) => {
      await page.goto('/en/faq')

      // Open language switcher
      const languageSwitcher = page.getByRole('button', {
        name: /select language/i
      })
      await languageSwitcher.click()

      // Select Japanese
      const japaneseOption = page.getByRole('menuitemradio', { name: '日本語' })
      await japaneseOption.click()

      // Should stay on FAQ page with Japanese locale
      await expect(page).toHaveURL(/\/ja\/faq/)
    })
  })

  // Note: Locale route tests are now consolidated in e2e/locales.spec.ts

  test.describe('Accessibility', () => {
    test('interactive elements are keyboard accessible', async ({ page }) => {
      await page.goto('/en')

      // Tab to first focusable element
      await page.keyboard.press('Tab')

      // Check that focus is visible on an element
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })
  })
})
