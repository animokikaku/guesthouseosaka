import { expect, test, type Page } from 'next/experimental/testmode/playwright'
import { mockResendAPI } from './mocks/resend'

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
      skipPlaces?: boolean
      skipGender?: boolean
    } = {}
  ) {
    const fields = getFormFields(page)

    // Select at least one place (toggle button)
    if (!overrides.skipPlaces) {
      await fields.placesGroup.getByRole('button').first().click()
    }

    // Select gender
    if (!overrides.skipGender) {
      await fields.genderSelect.click()
      await page.getByRole('option', { name: 'Male', exact: true }).click()
    }

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

  test.describe('Form Validation', () => {
    // Detailed field-level validation is covered by Vitest schema/component tests.
    test('missing places and gender show validation errors on submit', async ({ page }) => {
      const fields = getFormFields(page)

      await fields.nameField.fill('Alice')
      await fields.ageField.fill('25')
      await fields.nationalityField.fill('Japan')
      await fields.emailField.fill('test@example.com')
      await fields.messageField.fill('This is a valid test message.')
      await fields.checkbox.click()

      await page.getByRole('button', { name: 'Submit' }).click()

      await expect(page.getByText('Please select at least one share house')).toBeVisible()
      await expect(page.getByText('Please select your gender')).toBeVisible()
    })
  })

  test.describe('Privacy Policy', () => {
    test('privacy checkbox must be checked to submit', async ({ page }) => {
      // Fill all required fields with valid values but leave checkbox unchecked
      await fillRequiredFields(page)

      // Click submit without checking privacy policy
      await page.getByRole('button', { name: 'Submit' }).click()

      const fields = getFormFields(page)

      // Verify the checkbox is not checked and submission is blocked
      await expect(fields.checkbox).not.toBeChecked()

      // The form should not have navigated away (still on the same page)
      await expect(page).toHaveURL(/\/en\/contact\/other/)
    })

    test('privacy policy link opens dialog', async ({ page }) => {
      // Find and click the privacy policy link
      const privacyLink = page.getByRole('button', { name: 'Privacy Policy' })
      await expect(privacyLink).toBeVisible()
      await privacyLink.click()

      // Dialog should be visible
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()

      // Dialog should have the Privacy Policy title
      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

      // Close the dialog using the footer Close button (first one in DOM order)
      const closeButton = page.getByRole('button', { name: 'Close' }).first()
      await closeButton.click()
      await expect(dialog).not.toBeVisible()
    })
  })

  test.describe('Form Submission', () => {
    test('valid form can be submitted', async ({ next, page }) => {
      // Mock the Resend API to prevent actual email sending
      mockResendAPI(next)

      // Fill all required fields
      await fillRequiredFields(page)

      const fields = getFormFields(page)

      // Check privacy policy checkbox
      await fields.checkbox.click()
      await expect(fields.checkbox).toBeChecked()

      // Submit the form
      await page.getByRole('button', { name: 'Submit' }).click()

      // Wait for toast message or redirect
      await Promise.race([
        expect(page.getByText('Message sent successfully')).toBeVisible({
          timeout: 10000
        }),
        expect(page).toHaveURL(/\/en\/contact(?!\/other)/, { timeout: 10000 })
      ])
    })
  })
})

test.describe('Contact Page Navigation', () => {
  test('can navigate to general inquiry form', async ({ page }) => {
    await page.goto('/en/contact')

    // Find and click the link to the general inquiry form
    const generalLink = page.locator('a[href*="/contact/other"]')
    await expect(generalLink).toBeVisible()
    await generalLink.click()
    await expect(page).toHaveURL(/\/en\/contact\/other/)
    await expect(page.locator('form#other-form')).toBeVisible()
  })
})
