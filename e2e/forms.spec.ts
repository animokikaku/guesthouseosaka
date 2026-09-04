import { expect, test } from '@playwright/test'
import {
  fillAccountFields,
  getAccountFields,
  gotoContactForm,
  submissionToast
} from './helpers/contact-form'
import { DELIVERY_FAILURE_PREFIX, getSentEmails, uniqueReplyTo } from './mocks/resend'

const tomorrow = () => new Date(Date.now() + 864e5).toISOString().slice(0, 10)

test.describe('General inquiry form', () => {
  test('valid form can be submitted', async ({ page, request }) => {
    // Unique reply-to so the stubbed Resend API only reports this submission
    const replyTo = uniqueReplyTo()
    const form = await gotoContactForm(page, 'other')

    const fields = await fillAccountFields(page, form, { email: replyTo })
    await fields.checkbox.click()
    await expect(fields.checkbox).toBeChecked()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Message sent successfully!')
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
    const form = await gotoContactForm(page, 'other')

    // The stub rejects submissions from this reply-to prefix with a 422
    const fields = await fillAccountFields(page, form, {
      email: uniqueReplyTo(DELIVERY_FAILURE_PREFIX)
    })
    await fields.checkbox.click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Failed to send message.')
    await expect(page).toHaveURL(/\/en\/contact\/other/)
  })
})

// These forms reuse the same account field group as the general inquiry form
// but bind it alongside their own date, hour, and stay-duration fields.
test.describe('Tour and move-in forms', () => {
  test('tour form submits successfully', async ({ page, request }) => {
    const replyTo = uniqueReplyTo()
    const form = await gotoContactForm(page, 'tour')

    await form.locator('input[type="date"]').fill(tomorrow())
    await form.locator('input[type="time"]').fill('14:00')
    const fields = await fillAccountFields(page, form, { email: replyTo })
    await fields.checkbox.click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Message sent successfully!')
    expect(await getSentEmails(request, replyTo)).toHaveLength(1)
  })

  test('move-in form submits successfully', async ({ page, request }) => {
    const replyTo = uniqueReplyTo()
    const form = await gotoContactForm(page, 'move-in')

    await form.locator('input[type="date"]').fill(tomorrow())
    // Stay duration comes before the account group's gender select
    await form.getByRole('combobox').first().click()
    await page.getByRole('option').first().click()
    const fields = await fillAccountFields(page, form, { email: replyTo })
    await fields.checkbox.click()

    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(submissionToast(page)).toContainText('Message sent successfully!')
    expect(await getSentEmails(request, replyTo)).toHaveLength(1)
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
