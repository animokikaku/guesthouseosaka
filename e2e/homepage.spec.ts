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

      const housePageUrl = /\/en\/(orange|apple|lemon)\/?$/
      const houseLink = page
        .locator(
          [
            '[data-slot="item-group"] a[href="/en/orange"]',
            '[data-slot="item-group"] a[href="/en/apple"]',
            '[data-slot="item-group"] a[href="/en/lemon"]'
          ].join(', ')
        )
        .first()

      await expect(houseLink).toBeVisible()
      await expect(houseLink).toHaveAttribute('href', housePageUrl)
      await houseLink.scrollIntoViewIfNeeded()
      await expect(houseLink).toBeInViewport()

      await Promise.all([page.waitForURL(housePageUrl), houseLink.click()])
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
})
