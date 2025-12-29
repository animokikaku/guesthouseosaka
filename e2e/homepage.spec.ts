import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test.describe('Main Content', () => {
    test('displays hero section with heading and CTA button', async ({
      page
    }) => {
      await page.goto('/en')

      // Hero section should have a main heading
      const heroHeading = page.getByRole('heading', { level: 1 })
      await expect(heroHeading).toBeVisible()

      // Hero section should have a CTA button linking to contact
      const ctaButton = page.getByRole('link', { name: /contact us/i })
      await expect(ctaButton.first()).toBeVisible()
    })

    test('displays gallery wall images', async ({ page }) => {
      await page.goto('/en')

      // Gallery wall images should be present
      const images = page.locator('img')
      await expect(images.first()).toBeVisible()
    })

    test('displays collection section with house cards', async ({ page }) => {
      await page.goto('/en')

      // Collection section should have a heading (h2)
      const collectionHeading = page.getByRole('heading', { level: 2 })
      await expect(collectionHeading.first()).toBeVisible()

      // House cards should be displayed as list items
      const houseCards = page.getByRole('listitem')
      await expect(houseCards.first()).toBeVisible()

      // Each house card should have a link
      const houseLinks = houseCards.getByRole('link')
      const linkCount = await houseLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    })
  })

  test.describe('Navigation', () => {
    test('header navigation is visible with main links', async ({ page }) => {
      await page.goto('/en')

      // Main navigation should be present
      const nav = page.getByRole('navigation')
      await expect(nav.first()).toBeVisible()

      // FAQ link should be visible (direct link in nav)
      const faqLink = nav.getByRole('link', { name: /faq/i })
      await expect(faqLink.first()).toBeVisible()

      // Contact link should be visible (direct link in nav)
      const contactLink = nav.getByRole('link', { name: /contact/i })
      await expect(contactLink.first()).toBeVisible()
    })

    test('logo link is present in header', async ({ page }) => {
      await page.goto('/en')

      // Logo link should be present and link to homepage
      const logoLink = page.getByRole('link', { name: /share house osaka/i })
      await expect(logoLink).toBeVisible()
      await expect(logoLink).toHaveAttribute('href', '/en')
    })

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
      const houseLink = page
        .locator('[data-slot="item-group"] a[href*="/en/"]')
        .first()
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

  test.describe('Footer', () => {
    test('footer is visible with company name', async ({ page }) => {
      await page.goto('/en')

      // Footer should be present
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()

      // Footer should contain copyright year
      const currentYear = new Date().getFullYear().toString()
      await expect(footer).toContainText(currentYear)
    })

    test('footer has social links', async ({ page }) => {
      await page.goto('/en')

      const footer = page.locator('footer')

      // Social links should be present (external links with target="_blank")
      const socialLinks = footer.locator('a[target="_blank"]')
      const linkCount = await socialLinks.count()
      expect(linkCount).toBeGreaterThan(0)
    })
  })

  test.describe('Responsive Design', () => {
    test('mobile navigation toggle is visible on small screens', async ({
      page
    }) => {
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

  test.describe('Locale Routes', () => {
    const locales = ['en', 'ja', 'fr'] as const

    for (const locale of locales) {
      test(`${locale} locale homepage loads successfully`, async ({ page }) => {
        await page.goto(`/${locale}`)

        // Page should load with correct URL
        await expect(page).toHaveURL(new RegExp(`/${locale}/?$`))

        // Page should have content
        const heading = page.getByRole('heading', { level: 1 })
        await expect(heading).toBeVisible()
      })
    }
  })

  test.describe('Accessibility', () => {
    test('page has proper heading structure', async ({ page }) => {
      await page.goto('/en')

      // Page should have exactly one h1
      const h1 = page.getByRole('heading', { level: 1 })
      await expect(h1).toBeVisible()

      // Should also have h2 for sections
      const h2 = page.getByRole('heading', { level: 2 })
      await expect(h2.first()).toBeVisible()
    })

    test('images have alt attributes', async ({ page }) => {
      await page.goto('/en')

      // All images should have an alt attribute (even if empty for decorative)
      const imagesWithAlt = page.locator('img[alt]')
      const count = await imagesWithAlt.count()
      expect(count).toBeGreaterThan(0)
    })

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
