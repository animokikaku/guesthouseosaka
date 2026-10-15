import { expect, test } from 'next/experimental/testmode/playwright'
import {
  fillAccountFields,
  getAccountFields,
  gotoContactForm,
  submissionToast
} from './helpers/contact-form'
import { mockResendAPI } from './mocks/resend'

const tomorrow = () => new Date(Date.now() + 864e5).toISOString().slice(0, 10)

// Next throws "Proxy request aborted" for any server-side fetch a test leaves
// unhandled, so every test needs a fallback. Handlers run last registered
// first, which keeps this one behind the per-test Resend mocks. Resend itself
// can never reach here: `mockResendAPI` answers everything on its origin, and
// `RESEND_BASE_URL` does not resolve even if it somehow did.
test.beforeEach(async ({ next, page }) => {
  next.onFetch(() => 'continue')

  // Router prefetches carry the fixture's test headers too, so each one round
  // trips through the Playwright worker and renders a page nothing asserts on.
  // Left alone they stall real navigations into their timeouts.
  await page.route('**', (route) =>
    route.request().headers()['next-router-prefetch'] ? route.abort() : route.fallback()
  )
})

test.describe('General inquiry form', () => {
  test('valid form can be submitted', async ({ next, page }) => {
    // Mock the Resend API to prevent actual email sending
    const requests = mockResendAPI(next)
    const form = await gotoContactForm(page, 'other')

    const fields = await fillAccountFields(page, form)
    await fields.checkbox.click()
    await expect(fields.checkbox).toBeChecked()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Message sent successfully!')
    await expect(page).toHaveURL(/\/en\/contact(?!\/other)/)

    expect(requests).toHaveLength(1)
    expect(requests[0]).toMatchObject({
      from: 'Guest House Osaka <info@guesthouseosaka.com>',
      html: expect.stringMatching(
        /<!DOCTYPE html[\s\S]*Test User[\s\S]*This is a valid test message/
      ),
      reply_to: 'test@example.com',
      subject: 'お問い合わせ: Test User',
      to: 'orange@guesthouseosaka.com'
    })
  })

  test('failed email delivery shows an error without leaving the form', async ({ next, page }) => {
    const requests = mockResendAPI(next, {
      status: 422,
      body: {
        message: 'The email could not be delivered.',
        name: 'validation_error',
        statusCode: 422
      }
    })

    const form = await gotoContactForm(page, 'other')

    const fields = await fillAccountFields(page, form)
    await fields.checkbox.click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Failed to send message.')
    await expect(page).toHaveURL(/\/en\/contact\/other/)

    // The action maps every failure to this one toast, so without asserting the
    // request the test would also pass if the payload never reached Resend.
    expect(requests).toHaveLength(1)
  })
})

// These forms reuse the same account field group as the general inquiry form
// but bind it alongside their own date, hour, and stay-duration fields.
test.describe('Tour and move-in forms', () => {
  test('tour form submits successfully', async ({ next, page }) => {
    const requests = mockResendAPI(next)
    const form = await gotoContactForm(page, 'tour')

    await form.locator('input[type="date"]').fill(tomorrow())
    await form.locator('input[type="time"]').fill('14:00')
    const fields = await fillAccountFields(page, form)
    await fields.checkbox.click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Message sent successfully!')
    expect(requests).toHaveLength(1)
  })

  test('move-in form submits successfully', async ({ next, page }) => {
    const requests = mockResendAPI(next)
    const form = await gotoContactForm(page, 'move-in')

    await form.locator('input[type="date"]').fill(tomorrow())
    // Stay duration comes before the account group's gender select
    await form.getByRole('combobox').first().click()
    await page.getByRole('option').first().click()
    const fields = await fillAccountFields(page, form)
    await fields.checkbox.click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Message sent successfully!')
    expect(requests).toHaveLength(1)
  })
})

test.describe('Validation feedback', () => {
  test('submit validation reports errors on every invalid field', async ({ page }) => {
    const form = await gotoContactForm(page, 'tour')

    // Bypass native `required` so the library's own submit validation runs.
    await form.evaluate((element: HTMLFormElement) => element.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(form.locator('[data-slot="field-error"]').first()).toBeVisible()
    // onSubmitInvalid moves focus to the first invalid control.
    await expect(form.locator('[aria-invalid="true"]').first()).toBeFocused()
  })

  test('errors clear as the user corrects each field', async ({ page }) => {
    const form = await gotoContactForm(page, 'other')

    await form.evaluate((element: HTMLFormElement) => element.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: 'Submit' }).click()

    const email = getAccountFields(form).emailField
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    const errorsBefore = await form.locator('[data-slot="field-error"]').count()

    // Correcting one field revalidates it without touching the others.
    await email.fill('someone@example.com')
    await expect(email).toHaveAttribute('aria-invalid', 'false')
    expect(await form.locator('[data-slot="field-error"]').count()).toBeLessThan(errorsBefore)
  })

  test('validation messages follow the active locale', async ({ page }) => {
    await page.goto('/ja/contact/other')

    const form = page.locator('form#other-form')
    await expect(form).toBeVisible()

    await form.evaluate((element: HTMLFormElement) => element.setAttribute('novalidate', ''))
    await page.locator('button[type="submit"]').click()

    await expect(form.locator('[data-slot="field-error"]').first()).toContainText(
      'シェアハウスを1件以上選択してください。'
    )
  })
})
