import { devices, expect, test } from '@playwright/test'
import { gotoContactForm } from './helpers/contact-form'

// Phones get their own navigation, hero and dialogs, none of which the desktop
// suites render. Chromium-based, like the rest of the suite.
const { defaultBrowserType: _browser, ...pixel } = devices['Pixel 7']
test.use(pixel)

test('reaches a house from the menu and opens its gallery from the hero', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('button', { name: /menu/i }).click()
  await page
    .locator('[data-slot="mobile-nav-content"]')
    .getByRole('link', { name: /Orange/ })
    .click()
  await expect(page).toHaveURL(/\/en\/orange$/)

  // The swipeable hero replaces the desktop photo grid.
  await page
    .getByRole('link', { name: /all photos/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/en\/orange\/gallery$/)
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('agrees to the privacy policy from its drawer', async ({ page }) => {
  const form = await gotoContactForm(page, 'other')
  const consent = form.getByRole('checkbox')

  await form.getByRole('button', { name: /privacy/i }).click()
  await page.getByRole('button', { name: /agree/i }).click()

  await expect(consent).toBeChecked()
})
