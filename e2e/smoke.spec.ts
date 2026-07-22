import { expect, test } from '@playwright/test'

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/')

    // Verify the page loaded by checking for essential elements
    await expect(page).toHaveURL(/\/(en|ja|fr)?$/)

    // Page should have a title
    const title = await page.title()
    expect(title).toBeTruthy()
  })
})
