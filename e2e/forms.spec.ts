import { expect, test } from './fixtures/test'
import { fillAccountFields, gotoContactForm, submissionToast } from './helpers/contact-form'
import { gotoHydrated } from './helpers/navigation'
import { sentEmails } from './mocks/resend'

// Submissions go through the real server function and Turnstile's test keys,
// and their email to the Resend stand-in (see e2e/mocks/resend.ts). What the
// server does when Turnstile or Resend refuses, and how the form says so, is
// covered by the unit tests (contact.test.ts, form-feedback.test.tsx).

const tomorrow = () => new Date(Date.now() + 864e5).toISOString().slice(0, 10)

/** A reply address only this test uses, to find its email among the parallel tests'. */
const replyAddress = (testId: string) => `e2e+${testId}@example.com`

test.describe('Contact forms', () => {
  test('a general inquiry is emailed', async ({ page }, testInfo) => {
    const email = replyAddress(testInfo.testId)
    const form = await gotoContactForm(page, 'other')

    const fields = await fillAccountFields(page, form, { email })
    await fields.checkbox.click()
    await expect(fields.checkbox).toBeChecked()

    await page.getByRole('button', { name: /\bsubmit\b/i }).click()

    await expect(submissionToast(page)).toContainText(/\bsent successfully\b/i)
    await expect(page).toHaveURL(/\/en\/contact(?!\/other)/)

    expect(await sentEmails(email)).toEqual([
      expect.objectContaining({
        from: 'Guest House Osaka <info@guesthouseosaka.com>',
        html: expect.stringMatching(
          /<!DOCTYPE html[\s\S]*Test User[\s\S]*This is a valid test message/
        ),
        subject: 'お問い合わせ: Test User',
        // A local build never addresses a house inbox; the unit tests cover routing.
        to: 'dev@guesthouseosaka.com'
      })
    ])
  })

  // These forms reuse the same account field group as the general inquiry form
  // but bind it alongside their own date, hour, and stay-duration fields.
  test('a tour request is emailed', async ({ page }, testInfo) => {
    const email = replyAddress(testInfo.testId)
    const form = await gotoContactForm(page, 'tour')

    await form.locator('input[type="date"]').fill(tomorrow())
    await form.locator('input[type="time"]').fill('14:00')
    const fields = await fillAccountFields(page, form, { email })
    await fields.checkbox.click()

    await page.getByRole('button', { name: /\bsubmit\b/i }).click()

    await expect(submissionToast(page)).toContainText(/\bsent successfully\b/i)
    expect(await sentEmails(email)).toEqual([
      expect.objectContaining({ subject: '内覧希望: Test User' })
    ])
  })

  test('a move-in request is emailed', async ({ page }, testInfo) => {
    const email = replyAddress(testInfo.testId)
    const form = await gotoContactForm(page, 'move-in')

    await form.locator('input[type="date"]').fill(tomorrow())
    // Stay duration comes before the account group's gender select
    await form.getByRole('combobox').first().click()
    await page.getByRole('option').first().click()
    const fields = await fillAccountFields(page, form, { email })
    await fields.checkbox.click()

    await page.getByRole('button', { name: /\bsubmit\b/i }).click()

    await expect(submissionToast(page)).toContainText(/\bsent successfully\b/i)
    expect(await sentEmails(email)).toEqual([
      expect.objectContaining({ subject: '入居希望: Test User' })
    ])
  })

  test('a blocked Turnstile script leaves submit disabled and says how to reach us', async ({
    page
  }) => {
    await page.route('https://challenges.cloudflare.com/**', (route) => route.abort())
    await gotoContactForm(page, 'other')

    await expect(page.getByRole('alert')).toContainText(/\bcouldn’t load the verification\b/i)
    await expect(page.getByRole('alert')).toContainText('info@guesthouseosaka.com')
    await expect(page.getByRole('button', { name: /\bsubmit\b/i })).toBeDisabled()
  })

  // The unit tests check validation with the English catalog; this one checks
  // the server sends the visitor's.
  test('validation messages follow the active locale', async ({ page }) => {
    await gotoHydrated(page, '/ja/contact/other')

    const form = page.locator('form#other-form')

    // Bypass native `required` so the library's own submit validation runs.
    await form.evaluate((element: HTMLFormElement) => element.setAttribute('novalidate', ''))
    await page.locator('button[type="submit"]').click()

    await expect(form.locator('[data-slot="field-error"]').first()).toContainText(
      // Written in Japanese, whatever the exact wording.
      /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u
    )
  })
})
