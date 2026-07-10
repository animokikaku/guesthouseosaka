import { expect, test, type Page } from '@playwright/test'

test.skip(!process.env.BASE_URL, 'Preview smoke test requires a deployed preview URL.')

function getFormFields(page: Page) {
  const form = page.locator('form#other-form')

  return {
    ageField: form.locator('input[type="number"]'),
    checkbox: form.getByRole('checkbox'),
    emailField: form.locator('input[type="email"]'),
    genderSelect: form.getByRole('combobox'),
    messageField: form.locator('textarea'),
    nameField: form.locator('input[autocomplete="name"]'),
    nationalityField: form.locator('input[type="text"]:not([autocomplete="name"])'),
    placesGroup: form.locator('[data-slot="checkbox-group"]')
  }
}

async function fillPreviewSmokeContactForm(page: Page) {
  const fields = getFormFields(page)

  await fields.placesGroup.getByRole('button').first().click()
  await fields.genderSelect.click()
  await page.getByRole('option', { name: 'Male', exact: true }).click()
  await fields.nameField.fill('Preview Smoke Test')
  await fields.ageField.fill('25')
  await fields.nationalityField.fill('Japan')
  await fields.emailField.fill('preview-smoke@example.com')
  await fields.messageField.fill('Preview smoke test for React Email and Resend.')
  await fields.checkbox.click()
}

test('preview deployment can send the contact form through Resend', async ({ page }) => {
  await page.goto('/en/contact/other')
  await expect(page.locator('form#other-form')).toBeVisible()

  await fillPreviewSmokeContactForm(page)
  await page.getByRole('button', { name: 'Submit' }).click()

  const statusMessage = page.getByText(/^(Message sent successfully!|Failed to send message\.)$/)
  await expect(statusMessage).toBeVisible({ timeout: 10000 })
  await expect(statusMessage).toHaveText('Message sent successfully!')
})
