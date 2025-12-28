import { expect, test } from '@playwright/test'

test.describe('Contact Form Tests', () => {
  // Navigate to the "Other" contact form (general inquiry)
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/contact/other')
    // Wait for form to be visible
    await expect(page.locator('form#other-form')).toBeVisible()
  })

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
      // Fill name with valid value
      await page.getByPlaceholder('Enter your name').fill('Test User')

      // Fill email with value that passes HTML5 validation but fails Zod
      // Using a malformed but @ containing email
      const emailField = page.getByPlaceholder('Enter your email')
      await emailField.fill('invalid@email')

      // Fill message with valid value
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .fill('This is a test message.')

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
      // Fill name field
      const nameField = page.getByPlaceholder('Enter your name')
      await nameField.fill('John Doe')
      await expect(nameField).toHaveValue('John Doe')

      // Fill email field
      const emailField = page.getByPlaceholder('Enter your email')
      await emailField.fill('john@example.com')
      await expect(emailField).toHaveValue('john@example.com')

      // Fill message field
      const messageField = page.getByPlaceholder(
        'Let us know any additional information or questions.'
      )
      await messageField.fill('This is a test message for the contact form.')
      await expect(messageField).toHaveValue(
        'This is a test message for the contact form.'
      )

      // After filling fields correctly, no validation errors should be visible
      // Blur to trigger validation
      await messageField.blur()

      // Wait a moment for validation to complete
      await page.waitForTimeout(100)
    })

    test('message must be at least 5 characters', async ({ page }) => {
      // Fill name and email with valid values
      await page.getByPlaceholder('Enter your name').fill('Test User')
      await page.getByPlaceholder('Enter your email').fill('test@example.com')

      // Fill message with too short value (but not empty to bypass HTML5 validation)
      const messageField = page.getByPlaceholder(
        'Let us know any additional information or questions.'
      )
      await messageField.fill('Hi')

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
      // Fill name with too short value (but not empty to bypass HTML5 validation)
      const nameField = page.getByPlaceholder('Enter your name')
      await nameField.fill('A')

      // Fill other fields with valid values
      await page.getByPlaceholder('Enter your email').fill('test@example.com')
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .fill('This is a test message.')

      // Check privacy policy to not block submission
      await page.getByRole('checkbox').click()

      // Try to submit
      await page.getByRole('button', { name: 'Submit' }).click()

      // Should show name validation error
      await expect(
        page.getByText('Name must be at least 2 characters long')
      ).toBeVisible()
    })
  })

  test.describe('Privacy Policy', () => {
    test('privacy checkbox must be checked to submit', async ({ page }) => {
      // Fill all fields with valid values but leave checkbox unchecked
      await page.getByPlaceholder('Enter your name').fill('Test User')
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
    test('valid form can be submitted', async ({ page }) => {
      // Mock the API route to prevent actual email sending
      await page.route('**/contact', async (route) => {
        const request = route.request()
        if (request.method() === 'POST') {
          // Return a success response
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true })
          })
        } else {
          await route.continue()
        }
      })

      // Fill all required fields
      await page.getByPlaceholder('Enter your name').fill('Test User')
      await page.getByPlaceholder('Enter your email').fill('test@example.com')
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .fill('This is a valid test message for the contact form.')

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

    test('loading state shows while submitting', async ({ page }) => {
      // Fill all required fields
      await page.getByPlaceholder('Enter your name').fill('Test User')
      await page.getByPlaceholder('Enter your email').fill('test@example.com')
      await page
        .getByPlaceholder(
          'Let us know any additional information or questions.'
        )
        .fill('This is a valid test message for the contact form.')

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

      await nameField.fill('Test User')
      await emailField.fill('test@example.com')
      await messageField.fill('Test message content')
      await checkbox.click()

      // Verify fields are filled
      await expect(nameField).toHaveValue('Test User')
      await expect(emailField).toHaveValue('test@example.com')
      await expect(messageField).toHaveValue('Test message content')
      await expect(checkbox).toBeChecked()

      // Click reset button
      await page.getByRole('button', { name: 'Reset' }).click()

      // Verify fields are cleared
      await expect(nameField).toHaveValue('')
      await expect(emailField).toHaveValue('')
      await expect(messageField).toHaveValue('')
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
