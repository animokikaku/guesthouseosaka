import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  // Note: Footer visibility tests are now covered by unit tests in
  // components/__tests__/site-footer.test.tsx

  test.describe('Navigation', () => {
    test('FAQ link navigates to FAQ page', async ({ page }) => {
      await page.goto('/en')

      const nav = page.getByRole('navigation')
      const faqLink = nav.getByRole('link', { name: /faq/i })
      await faqLink.first().click()

      await expect(page).toHaveURL(/\/en\/faq/)
    })

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
    test('language switcher is visible and functional', async ({ page }) => {
      await page.goto('/en')

      // Language switcher button should be visible
      const languageSwitcher = page.getByRole('button', {
        name: /select language/i
      })
      await expect(languageSwitcher).toBeVisible()

      // Open language switcher
      await languageSwitcher.click()

      // Language options should be visible
      const japaneseOption = page.getByRole('menuitemradio', { name: '日本語' })
      await expect(japaneseOption).toBeVisible()

      const frenchOption = page.getByRole('menuitemradio', {
        name: 'Français'
      })
      await expect(frenchOption).toBeVisible()

      const englishOption = page.getByRole('menuitemradio', { name: 'English' })
      await expect(englishOption).toBeVisible()
    })

    test('switches language to Japanese', async ({ page }) => {
      await page.goto('/en')

      // Open language switcher
      const languageSwitcher = page.getByRole('button', {
        name: /select language/i
      })
      await languageSwitcher.click()

      // Select Japanese
      const japaneseOption = page.getByRole('menuitemradio', { name: '日本語' })
      await japaneseOption.click()

      // URL should change to Japanese locale
      await expect(page).toHaveURL(/\/ja\/?$/)
    })

    test('switches language to French', async ({ page }) => {
      await page.goto('/en')

      // Open language switcher
      const languageSwitcher = page.getByRole('button', {
        name: /select language/i
      })
      await languageSwitcher.click()

      // Select French
      const frenchOption = page.getByRole('menuitemradio', {
        name: 'Français'
      })
      await frenchOption.click()

      // URL should change to French locale
      await expect(page).toHaveURL(/\/fr\/?$/)
    })

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

  test.describe('Responsive Design', () => {
    test('mobile navigation toggle is visible on small screens', async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en')

      // Mobile menu toggle should be visible
      const mobileMenuToggle = page.getByRole('button', {
        name: /toggle menu/i
      })
      await expect(mobileMenuToggle).toBeVisible()
    })

    test('desktop navigation is hidden on mobile', async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en')

      // Desktop navigation menu should be hidden (has class hidden lg:flex)
      const desktopNav = page.locator('nav.hidden.lg\\:flex')
      await expect(desktopNav).toBeHidden()
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
