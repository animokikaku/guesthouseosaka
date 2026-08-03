import { expect, test, type Page } from '@playwright/test'
import { DELIVERY_FAILURE_PREFIX, getSentEmails, uniqueReplyTo } from './mocks/resend'

test.describe('Contact Form Tests', () => {
  // Navigate to the "Other" contact form (general inquiry)
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/contact/other')
    // Wait for form to be visible
    await expect(page.locator('form#other-form')).toBeVisible()
  })

  // Helper to get form fields using robust selectors
  function getFormFields(page: Page) {
    const form = page.locator('form#other-form')
    return {
      // Use input types and autocomplete attributes for reliable selection
      nameField: form.locator('input[autocomplete="name"]'),
      emailField: form.locator('input[type="email"]'),
      ageField: form.locator('input[type="number"]'),
      nationalityField: form.locator('input[type="text"]:not([autocomplete="name"])'),
      messageField: form.locator('textarea'),
      checkbox: form.getByRole('checkbox'),
      genderSelect: form.getByRole('combobox'),
      // Places toggle group - uses data-slot="checkbox-group" from ToggleGroupField
      placesGroup: form.locator('[data-slot="checkbox-group"]')
    }
  }

  // Helper to fill all required fields for general inquiry form
  async function fillRequiredFields(
    page: Page,
    overrides: {
      name?: string
      email?: string
      age?: string
      nationality?: string
      message?: string
    } = {}
  ) {
    const fields = getFormFields(page)

    // Select at least one place (toggle button)
    await fields.placesGroup.getByRole('button').first().click()

    // Select gender
    await fields.genderSelect.click()
    await page.getByRole('option', { name: 'Male', exact: true }).click()

    // Fill name
    await fields.nameField.fill(overrides.name ?? 'Test User')

    // Fill age
    await fields.ageField.fill(overrides.age ?? '25')

    // Fill nationality
    await fields.nationalityField.fill(overrides.nationality ?? 'Japan')

    // Fill email
    await fields.emailField.fill(overrides.email ?? 'test@example.com')

    // Fill message
    await fields.messageField.fill(overrides.message ?? 'This is a valid test message.')
  }

  test.describe('Form Submission', () => {
    test('valid form can be submitted', async ({ page, request }) => {
      // Unique reply-to so the stubbed Resend API only reports this submission
      const replyTo = uniqueReplyTo()

      // Fill all required fields
      await fillRequiredFields(page, { email: replyTo })

      const fields = getFormFields(page)

      // Check privacy policy checkbox
      await fields.checkbox.click()
      await expect(fields.checkbox).toBeChecked()

      // Submit the form
      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.locator('[data-sonner-toast]').first()).toContainText(
        'Message sent successfully!'
      )

      await expect(page).toHaveURL(/\/en\/contact(?!\/other)/)

      const emails = await getSentEmails(request, replyTo)
      expect(emails).toHaveLength(1)
      expect(emails[0]).toMatchObject({
        from: 'Guest House Osaka <info@guesthouseosaka.com>',
        html: expect.stringMatching(
          /<!DOCTYPE html[\s\S]*Test User[\s\S]*This is a valid test message/
        ),
        reply_to: replyTo,
        subject: 'お問い合わせ: Test User',
        to: 'orange@guesthouseosaka.com'
      })
    })

    test('failed email delivery shows an error without leaving the form', async ({ page }) => {
      // The stub rejects submissions from this reply-to prefix with a 422
      await fillRequiredFields(page, { email: uniqueReplyTo(DELIVERY_FAILURE_PREFIX) })

      const fields = getFormFields(page)
      await fields.checkbox.click()
      await page.getByRole('button', { name: 'Submit' }).click()

      const toast = page.locator('[data-sonner-toast]').first()
      await expect(toast).toBeVisible()
      await expect(toast).toContainText('Failed to send message.')
      await expect(page).toHaveURL(/\/en\/contact\/other/)
    })
  })
})
