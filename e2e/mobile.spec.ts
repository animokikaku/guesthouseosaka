import { devices, expect, test } from './fixtures/test'
import { gotoHydrated } from './helpers/navigation'
import { gotoContactForm } from './helpers/contact-form'

// Phones get their own navigation, hero and dialogs, none of which the desktop
// suites render. Chromium-based, like the rest of the suite.
const { defaultBrowserType: _browser, ...pixel } = devices['Pixel 7']
test.use(pixel)

test('reaches a house from the menu and opens its gallery from the hero', async ({ page }) => {
  await gotoHydrated(page, '/en')

  await page.getByRole('button', { name: /\bmenu\b/i }).click()
  await page
    .locator('[data-slot="mobile-nav-content"]')
    .getByRole('link', { name: /\bOrange\b/ })
    .click()
  await expect(page).toHaveURL(/\/en\/orange$/)

  // The swipeable hero replaces the desktop photo grid.
  await page
    .getByRole('link', { name: /\ball photos\b/i })
    .first()
    .click()
  await expect(page).toHaveURL(/\/en\/orange\/gallery$/)
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('agrees to the privacy policy from its drawer', async ({ page }) => {
  const form = await gotoContactForm(page, 'other')
  const consent = form.getByRole('checkbox')

  await form.getByRole('button', { name: /\bprivacy\b/i }).click()
  await page.getByRole('button', { name: /\bagree\b/i }).click()

  await expect(consent).toBeChecked()
})
