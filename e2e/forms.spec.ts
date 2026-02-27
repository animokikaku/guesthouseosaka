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
    test('incomplete form shows validation errors on submit', async ({ page }) => {
      const fields = getFormFields(page)

      // Fill only some fields with invalid/missing values to trigger Zod validation
      // Don't select places (required)
      // Don't select gender (required)
      await fields.nameField.fill('A') // Too short (min 2)
      await fields.ageField.fill('25') // Valid age
      await fields.nationalityField.fill('Japan') // Valid
      await fields.emailField.fill('test@example.com') // Valid email
      await fields.messageField.fill('Hi') // Too short (min 5)

      // Check the privacy policy checkbox to bypass browser validation
      await fields.checkbox.click()

      // Click submit button
      await page.getByRole('button', { name: 'Submit' }).click()

      // Validation errors should appear for required fields (places, gender, name, message)
      const errorMessages = page.locator('[role="alert"][data-slot="field-error"]')
      await expect(errorMessages.first()).toBeVisible()

      // Check that at least one error is visible
      const errorCount = await errorMessages.count()
      expect(errorCount).toBeGreaterThan(0)
    })

    test('invalid email shows error', async ({ page }) => {
      // Fill all required fields with valid values except email
      await fillRequiredFields(page, { email: 'invalid@email' })

      const fields = getFormFields(page)

      // Check privacy policy
      await fields.checkbox.click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Wait for validation error to appear
      const errorMessage = page.locator('[role="alert"][data-slot="field-error"]')
      await expect(errorMessage.first()).toBeVisible()

      // Error should contain email validation message
      await expect(page.getByText('Invalid email address')).toBeVisible()
    })

    test('form fields accept valid input', async ({ page }) => {
      // Fill all required fields with valid values
      await fillRequiredFields(page, {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message for the contact form.'
      })

      const fields = getFormFields(page)

      // Blur the last field to trigger validation
      await fields.messageField.blur()

      // Verify no validation errors are visible after valid input
      const errorMessages = page.locator('[role="alert"][data-slot="field-error"]')
      await expect(errorMessages).toHaveCount(0)
    })

    test('message must be at least 5 characters', async ({ page }) => {
      // Fill all required fields with valid values except message
      await fillRequiredFields(page, { message: 'Hi' })

      const fields = getFormFields(page)

      // Check privacy policy to not block submission
      await fields.checkbox.click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show message validation error
      await expect(page.getByText('Message must be at least 5 characters long')).toBeVisible()
    })

    test('name must be at least 2 characters', async ({ page }) => {
      // Fill all required fields with valid values except name
      await fillRequiredFields(page, { name: 'A' })

      const fields = getFormFields(page)

      // Check privacy policy to not block submission
      await fields.checkbox.click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show name validation error
      await expect(page.getByText('Name must be at least 2 characters long')).toBeVisible()
    })

    test('places selection is required', async ({ page }) => {
      // Fill all required fields except places
      await fillRequiredFields(page, { skipPlaces: true })

      const fields = getFormFields(page)

      // Check privacy policy
      await fields.checkbox.click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show places validation error
      await expect(page.getByText('Please select at least one share house')).toBeVisible()
    })

    test('gender selection is required', async ({ page }) => {
      // Fill all required fields except gender
      await fillRequiredFields(page, { skipGender: true })

      const fields = getFormFields(page)

      // Check privacy policy
      await fields.checkbox.click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show gender validation error
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

    test('loading state shows while submitting', async ({ next, page }) => {
      // Mock the Resend API to prevent actual email sending
      mockResendAPI(next)

      // Fill all required fields
      await fillRequiredFields(page)

      const fields = getFormFields(page)

      // Check privacy policy checkbox
      await fields.checkbox.click()

      // The submit button should be enabled before submission
      const submitButton = page.getByRole('button', { name: 'Submit' })
      await expect(submitButton).toBeEnabled()

      // Submit the form
      await submitButton.click()

      // After submission, either loading toast, success toast, or redirect
      await Promise.race([
        expect(page.getByText('Sending message')).toBeVisible({
          timeout: 10000
        }),
        expect(page.getByText('Message sent successfully')).toBeVisible({
          timeout: 10000
        }),
        expect(page).toHaveURL(/\/en\/contact(?!\/other)/, { timeout: 10000 })
      ])
    })

    test('form resets after clicking reset button', async ({ page }) => {
      const fields = getFormFields(page)

      // Select a place
      await fields.placesGroup.getByRole('button').first().click()

      // Fill fields
      await fields.nameField.fill('Test User')
      await fields.emailField.fill('test@example.com')
      await fields.messageField.fill('Test message content')
      await fields.ageField.fill('30')
      await fields.checkbox.click()

      // Verify fields are filled
      await expect(fields.nameField).toHaveValue('Test User')
      await expect(fields.emailField).toHaveValue('test@example.com')
      await expect(fields.messageField).toHaveValue('Test message content')
      await expect(fields.ageField).toHaveValue('30')
      await expect(fields.checkbox).toBeChecked()

      // Click reset button
      await page.getByRole('button', { name: 'Reset' }).click()

      // Verify fields are cleared
      await expect(fields.nameField).toHaveValue('')
      await expect(fields.emailField).toHaveValue('')
      await expect(fields.messageField).toHaveValue('')
      await expect(fields.ageField).toHaveValue('')
      await expect(fields.checkbox).not.toBeChecked()
    })
  })
})

test.describe('Contact Page Navigation', () => {
  test('contact page shows contact type options', async ({ page }) => {
    await page.goto('/en/contact')

    // The main contact page should show links to different form types
    // Based on the ContactTypesList component - check that at least one link exists
    const tourLink = page.locator('a[href*="/contact/tour"]')
    const moveInLink = page.locator('a[href*="/contact/move-in"]')
    const otherLink = page.locator('a[href*="/contact/other"]')

    // All three contact type links should be visible
    await expect(tourLink).toBeVisible()
    await expect(moveInLink).toBeVisible()
    await expect(otherLink).toBeVisible()
  })

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
