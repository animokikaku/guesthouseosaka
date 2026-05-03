import { expect, test } from '@playwright/test'

test('studio renders', async ({ page }) => {
  await page.goto('/studio')

  // Studio should render the login screen (client-side rendered)
  await expect(page.getByText('Choose login provider')).toBeVisible({ timeout: 15_000 })
})
