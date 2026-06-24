import { expect, test } from '@playwright/test'

test('studio renders', async ({ page }) => {
  await page.goto('/studio')

  // Studio should render the client-side shell.
  await expect(page.locator('[data-ui="NextStudioLayout"]')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('Choose login provider')).toBeVisible()
})
