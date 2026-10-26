import { expect, test } from '@playwright/test'
import { fillAccountFields, submissionToast } from '../helpers/contact-form'

test.skip(
  !process.env.BASE_URL && process.env.E2E_REAL_EMAIL !== '1',
  'Sends a real email: run with `bun run test:e2e:preview`.'
)

test('the preview build can send the contact form through Resend', async ({ page }) => {
  await page.goto('/en/contact/other')

  const form = page.locator('form#other-form')
  await expect(form).toBeVisible()

  const fields = await fillAccountFields(page, form, {
    name: 'Preview Test',
    email: 'preview@example.com',
    message: 'Preview test for React Email and Resend.'
  })
  await fields.checkbox.click()

  await page.getByRole('button', { name: /\bsubmit\b/i }).click()

  await expect(submissionToast(page)).toContainText(/\bsent successfully\b/i)
})
