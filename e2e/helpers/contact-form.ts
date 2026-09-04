import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Locators for the shared user-account field group. Every contact form binds the
 * same group, so both the local and the preview suites drive it through here.
 *
 * Inputs are addressed by type and autocomplete attribute rather than by their
 * label, which keeps them stable as the copy changes.
 */
export function getAccountFields(form: Locator) {
  return {
    ageField: form.locator('input[type="number"]'),
    checkbox: form.getByRole('checkbox'),
    emailField: form.locator('input[type="email"]'),
    // The move-in form has a second combobox (stay duration), so the gender
    // trigger is addressed by the field name SelectField bakes into its id.
    genderSelect: form.locator('[role="combobox"][id$="gender"]'),
    messageField: form.locator('textarea'),
    nameField: form.locator('input[autocomplete="name"]'),
    nationalityField: form.locator('input[autocomplete="country-name"]'),
    placesGroup: form.locator('[data-slot="checkbox-group"]')
  }
}

type AccountOverrides = {
  name?: string
  email?: string
  age?: string
  nationality?: string
  message?: string
}

/**
 * Fill every required field of the account group, leaving the form's own fields
 * (date, hour, stay duration) to the caller. Does not tick the privacy checkbox.
 *
 * The gender option is picked by its English label. Base UI renders no value on
 * a select item, so matching the option any other way would mean adding a test
 * hook to the component; every caller loads the /en routes, so this stays put
 * until one of them needs another locale.
 */
export async function fillAccountFields(
  page: Page,
  form: Locator,
  overrides: AccountOverrides = {}
) {
  const fields = getAccountFields(form)

  await fields.placesGroup.first().getByRole('button').first().click()

  await fields.genderSelect.click()
  await page.getByRole('option', { name: 'Male', exact: true }).click()

  await fields.nameField.fill(overrides.name ?? 'Test User')
  await fields.ageField.fill(overrides.age ?? '25')
  await fields.nationalityField.fill(overrides.nationality ?? 'Japan')
  await fields.emailField.fill(overrides.email ?? 'test@example.com')

  await fields.messageField.fill(overrides.message ?? 'This is a valid test message.')

  return fields
}

/** Open one of the English contact forms and wait for it to be interactive. */
export async function gotoContactForm(page: Page, slug: 'tour' | 'move-in' | 'other') {
  await page.goto(`/en/contact/${slug}`)

  const form = page.locator(`form#${slug}-form`)
  await expect(form).toBeVisible()

  return form
}

/** The toast the form raises after a submit attempt. */
export function submissionToast(page: Page) {
  return page.locator('[data-slot="toast"]').first()
}
