import { expect, test } from '@playwright/test'

// Locale routes themselves are covered in locales.spec.ts; this pins the
// unprefixed entry point, which is the only path the proxy has to resolve.
test('the root path resolves to a localized homepage', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/(en|ja|fr)?$/)
  await expect(page.getByRole('heading').first()).toBeVisible()
})
