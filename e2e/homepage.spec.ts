import { expect, test } from '@playwright/test'
import { gotoHydrated } from './helpers/navigation'

test.describe('Homepage', () => {
  // Note: Footer visibility tests are now covered by unit tests in
  // components/__tests__/site-footer.test.tsx

  test.describe('Navigation', () => {
    test('Contact link navigates to contact page', async ({ page }) => {
      await gotoHydrated(page, '/en')

      const nav = page.getByRole('navigation')
      const contactLink = nav.getByRole('link', { name: /\bcontact\b/i })
      await contactLink.first().click()

      await expect(page).toHaveURL(/\/en\/contact/)
    })

    test('house card link navigates to house page', async ({ page }) => {
      await gotoHydrated(page, '/en')

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

  // Pages opt into footer overrides with marker classes (see SiteFooter).
  test.describe('Footer overrides', () => {
    // The site snaps mandatorily, so a snap target left over from the home
    // page would open the next page scrolled to its footer.
    test('the footer stops being a snap target once the home page is left', async ({ page }) => {
      await gotoHydrated(page, '/en')
      const footer = page.locator('[data-slot="site-footer"]')
      await expect(footer).toHaveCSS('scroll-snap-align', 'end')

      await page.mouse.wheel(0, 5000)
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0)

      await page.locator('[data-slot="item-group"] a[href="/en/orange"]').click()
      await page.waitForURL(/\/en\/orange$/)

      await expect(footer).toHaveCSS('scroll-snap-align', 'none')
      expect(await page.evaluate(() => scrollY)).toBe(0)
    })

    test('the 404 page drops the footer tint, which comes back after it', async ({ page }) => {
      await gotoHydrated(page, '/en/does-not-exist')
      const footer = page.locator('[data-slot="site-footer"]')
      await expect(footer).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

      await page
        .getByRole('navigation')
        .getByRole('link', { name: /\bfaq\b/i })
        .first()
        .click()
      await page.waitForURL(/\/en\/faq$/)

      await expect(footer).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    })
  })

  test.describe('Language Switcher', () => {
    test('preserves current page when switching language', async ({ page }) => {
      await gotoHydrated(page, '/en/faq')

      // Open language switcher
      const languageSwitcher = page.getByRole('button', {
        name: /\blanguage\b/i
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
