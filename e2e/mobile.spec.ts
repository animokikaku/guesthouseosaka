import { devices, expect, test } from '@playwright/test'
import { gotoContactForm } from './helpers/contact-form'
import { message } from '../lib/__tests__/utils/messages'

// Phones get their own navigation, hero and dialogs, none of which the desktop
// suites render. Chromium-based, like the rest of the suite.
const { defaultBrowserType: _browser, ...pixel } = devices['Pixel 7']
test.use(pixel)

test('reaches a house from the menu and opens its gallery from the hero', async ({ page }) => {
  await page.goto('/en')

  await page.getByRole('button', { name: message('MobileNav.toggle_menu') }).click()
  await page
    .locator('[data-slot="mobile-nav-content"]')
    .getByRole('link', { name: /Orange/ })
    .click()
  await expect(page).toHaveURL(/\/en\/orange$/)

  // The swipeable hero replaces the desktop photo grid.
  await page
    .getByRole('link', { name: message('MobileHeroImage.view_gallery') })
    .first()
    .click()
  await expect(page).toHaveURL(/\/en\/orange\/gallery$/)
  await expect(page.getByRole('dialog')).toBeVisible()
})

/** The linked words in the consent sentence, which open the policy. */
const privacyPolicyLink = message
  .markup('forms.fields.privacy_policy_agreement', { link: (chunks) => `|${chunks}|` })
  .split('|')[1]

test('agrees to the privacy policy from its drawer', async ({ page }) => {
  const form = await gotoContactForm(page, 'other')
  const consent = form.getByRole('checkbox')

  await form.getByRole('button', { name: privacyPolicyLink }).click()
  await page.getByRole('button', { name: message('LegalNoticeDialog.agree_button') }).click()

  await expect(consent).toBeChecked()
})
