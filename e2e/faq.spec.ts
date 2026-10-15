import { expect, test } from '@playwright/test'
import { message } from '../lib/__tests__/utils/messages'

test.describe('FAQ page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/faq')
  })

  test('opens an answer when its question is selected', async ({ page }) => {
    const question = page.locator('[data-slot="accordion-trigger"]').first()

    await expect(question).toHaveAttribute('aria-expanded', 'false')
    await question.click()
    await expect(question).toHaveAttribute('aria-expanded', 'true')
  })

  // The contact card is the page's call to action: every house must be callable.
  test('lists a phone number for every house', async ({ page }) => {
    const table = page
      .getByRole('table')
      .filter({ hasText: message('FAQContactTable.within_japan') })

    await expect(table).toBeVisible()
    for (const house of ['Orange House', 'Apple House', 'Lemon House']) {
      const row = table.getByRole('row', { name: new RegExp(house) })
      await expect(row.locator('a[href^="tel:+81"]')).toBeVisible()
      await expect(row.locator('a[href^="tel:0"]')).toBeVisible()
    }
  })
})
