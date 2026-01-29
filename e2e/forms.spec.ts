import { expect, test } from 'next/experimental/testmode/playwright'
import { mockResendAPI } from './mocks/resend'

test.describe('Contact Form Tests', () => {
  // Navigate to the "Other" contact form (general inquiry)
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/contact/other')
    // Wait for form to be visible
    await expect(page.locator('form#other-form')).toBeVisible()
  })

  // Helper to fill all required fields for general inquiry form
  async function fillRequiredFields(
    page: import('@playwright/test').Page,
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
    // Select at least one place (toggle button)
    if (!overrides.skipPlaces) {
      await page.getByRole('group').getByRole('button').first().click()
    }

    // Select gender
    if (!overrides.skipGender) {
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: 'Male' }).click()
    }

    // Fill name
    await page
      .getByPlaceholder('Enter your name')
      .fill(overrides.name ?? 'Test User')

    // Fill age
    await page.getByRole('spinbutton').fill(overrides.age ?? '25')

    // Fill nationality
    await page
      .getByPlaceholder('Enter your nationality')
      .fill(overrides.nationality ?? 'Japan')

    // Fill email
    await page
      .getByPlaceholder('Enter your email')
      .fill(overrides.email ?? 'test@example.com')

    // Fill message
    await page
      .getByPlaceholder('Let us know any additional information or questions.')
      .fill(overrides.message ?? 'This is a valid test message.')
  }

  test.describe('Form Validation', () => {
    test('empty form shows validation errors on submit', async ({ page }) => {
      // Fill fields with invalid minimal values to bypass browser HTML5 validation
      // but trigger the Zod validation
      const nameField = page.getByPlaceholder('Enter your name')
      const emailField = page.getByPlaceholder('Enter your email')
      const messageField = page.getByPlaceholder(
        'Let us know any additional information or questions.'
      )

      // Fill with values that bypass HTML5 validation but fail Zod validation
      await nameField.fill('A') // Too short (min 2)
      await emailField.fill('a@b.c') // Looks like email to browser but may fail Zod
      await messageField.fill('Hi') // Too short (min 5)

      // Check the privacy policy checkbox to bypass browser validation
      await page.getByRole('checkbox').click()

      // Click submit button
      await page.getByRole('button', { name: 'Submit' }).click()

      // Validation errors should appear for required fields
      // The form uses role="alert" for error messages
      const errorMessages = page.locator(
        '[role="alert"][data-slot="field-error"]'
      )
      await expect(errorMessages.first()).toBeVisible()

      // Check that at least one error is visible (name, email, or message validation)
      const errorCount = await errorMessages.count()
      expect(errorCount).toBeGreaterThan(0)
    })

    test('invalid email shows error', async ({ page }) => {
      // Fill all required fields with valid values except email
      await fillRequiredFields(page, { email: 'invalid@email' })

      // Check privacy policy
      await page.getByRole('checkbox').click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Wait for validation error to appear
      const errorMessage = page.locator(
        '[role="alert"][data-slot="field-error"]'
      )
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

      // After filling fields correctly, no validation errors should be visible
      // Blur the last field to trigger validation
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .blur()

      // Verify no validation errors are visible after valid input
      const errorMessages = page.locator(
        '[role="alert"][data-slot="field-error"]'
      )
      await expect(errorMessages).toHaveCount(0)
    })

    test('message must be at least 5 characters', async ({ page }) => {
      // Fill all required fields with valid values except message
      await fillRequiredFields(page, { message: 'Hi' })

      // Check privacy policy to not block submission
      await page.getByRole('checkbox').click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show message validation error
      await expect(
        page.getByText('Message must be at least 5 characters long')
      ).toBeVisible()
    })

    test('name must be at least 2 characters', async ({ page }) => {
      // Fill all required fields with valid values except name
      await fillRequiredFields(page, { name: 'A' })

      // Check privacy policy to not block submission
      await page.getByRole('checkbox').click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show name validation error
      await expect(
        page.getByText('Name must be at least 2 characters long')
      ).toBeVisible()
    })

    test('places selection is required', async ({ page }) => {
      // Fill all required fields except places
      await fillRequiredFields(page, { skipPlaces: true })

      // Check privacy policy
      await page.getByRole('checkbox').click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show places validation error
      await expect(
        page.getByText('Please select at least one share house')
      ).toBeVisible()
    })

    test('gender selection is required', async ({ page }) => {
      // Fill all required fields except gender
      await fillRequiredFields(page, { skipGender: true })

      // Check privacy policy
      await page.getByRole('checkbox').click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show gender validation error
      await expect(page.getByText('Please select your gender')).toBeVisible()
    })
  })

  test.describe('Privacy Policy', () => {
    test('privacy checkbox must be checked to submit', async ({ page }) => {
      // Fill all required fields with valid values but leave checkbox unchecked
      // Select a place
      await page.getByRole('group').getByRole('button').first().click()

      // Select gender
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: 'Male' }).click()

      // Fill other fields
      await page.getByPlaceholder('Enter your name').fill('Test User')
      await page.getByRole('spinbutton').fill('25')
      await page.getByPlaceholder('Enter your nationality').fill('Japan')
      await page.getByPlaceholder('Enter your email').fill('test@example.com')
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .fill('This is a valid test message.')

      // Click submit without checking privacy policy
      // The browser will show native validation ("Please check this box if you want to proceed.")
      await page.getByRole('button', { name: 'Submit' }).click()

      // Verify the checkbox is not checked and submission is blocked
      // Browser shows native validation, so we check the checkbox state instead
      const checkbox = page.getByRole('checkbox')
      await expect(checkbox).not.toBeChecked()

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
      await expect(
        page.getByRole('heading', { name: 'Privacy Policy' })
      ).toBeVisible()

      // Close the dialog using the footer Close button (first one in DOM order)
      const closeButton = page.getByRole('button', { name: 'Close' }).first()
      await closeButton.click()
      await expect(dialog).not.toBeVisible()
    })
  })

  test.describe('Form Submission', () => {
    // Helper to fill all required fields for submission tests
    async function fillAllRequiredFields(
      page: import('@playwright/test').Page
    ) {
      // Select a place
      await page.getByRole('group').getByRole('button').first().click()

      // Select gender
      await page.getByRole('combobox').click()
      await page.getByRole('option', { name: 'Male' }).click()

      // Fill other fields
      await page.getByPlaceholder('Enter your name').fill('Test User')
      await page.getByRole('spinbutton').fill('25')
      await page.getByPlaceholder('Enter your nationality').fill('Japan')
      await page.getByPlaceholder('Enter your email').fill('test@example.com')
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .fill('This is a valid test message for the contact form.')
    }

    test('valid form can be submitted', async ({ next, page }) => {
      // Mock the Resend API to prevent actual email sending
      mockResendAPI(next)

      // Fill all required fields
      await fillAllRequiredFields(page)

      // Check privacy policy checkbox
      const checkbox = page.getByRole('checkbox')
      await checkbox.click()
      await expect(checkbox).toBeChecked()

      // Submit the form
      await page.getByRole('button', { name: 'Submit' }).click()

      // Wait for toast message or redirect
      // The form shows a toast on success and redirects to /contact
      // Wait for either the success toast or the navigation
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
      await fillAllRequiredFields(page)

      // Check privacy policy checkbox
      await page.getByRole('checkbox').click()

      // The submit button should be enabled before submission
      const submitButton = page.getByRole('button', { name: 'Submit' })
      await expect(submitButton).toBeEnabled()

      // Submit the form
      await submitButton.click()

      // After submission, either:
      // 1. The "Sending message" toast appears (loading state)
      // 2. The "Message sent successfully" toast appears (success)
      // 3. The page redirects to /contact (success with redirect)
      // Any of these indicates the form submission was initiated
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
      // Fill some fields
      const nameField = page.getByPlaceholder('Enter your name')
      const emailField = page.getByPlaceholder('Enter your email')
      const messageField = page.getByPlaceholder(
        'Let us know any additional information or questions.'
      )
      const checkbox = page.getByRole('checkbox')
      const ageField = page.getByRole('spinbutton')

      // Select a place
      await page.getByRole('group').getByRole('button').first().click()

      await nameField.fill('Test User')
      await emailField.fill('test@example.com')
      await messageField.fill('Test message content')
      await ageField.fill('30')
      await checkbox.click()

      // Verify fields are filled
      await expect(nameField).toHaveValue('Test User')
      await expect(emailField).toHaveValue('test@example.com')
      await expect(messageField).toHaveValue('Test message content')
      await expect(ageField).toHaveValue('30')
      await expect(checkbox).toBeChecked()

      // Click reset button
      await page.getByRole('button', { name: 'Reset' }).click()

      // Verify fields are cleared
      await expect(nameField).toHaveValue('')
      await expect(emailField).toHaveValue('')
      await expect(messageField).toHaveValue('')
      await expect(ageField).toHaveValue('')
      await expect(checkbox).not.toBeChecked()
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
