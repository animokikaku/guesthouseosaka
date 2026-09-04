import { expect, test, type Page } from '@playwright/test'
import { fillAccountFields, submissionToast } from '../helpers/contact-form'

test.skip(!process.env.BASE_URL, 'Preview tests require a deployed preview URL.')

/**
 * Deployment protection blocks automated requests, so the first navigation
 * carries the bypass secret and exchanges it for a cookie the rest of the run
 * reuses.
 */
async function authenticatePreview(page: Page) {
  const baseURL = process.env.BASE_URL
  const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

  if (!baseURL || !bypassSecret) return

  const deploymentUrl = new URL('/', baseURL).href
  await page.route(
    deploymentUrl,
    (route) =>
      route.continue({
        headers: {
          ...route.request().headers(),
          'x-vercel-protection-bypass': bypassSecret,
          'x-vercel-set-bypass-cookie': 'true'
        }
      }),
    { times: 1 }
  )
  await page.goto(deploymentUrl)
}

test.beforeEach(async ({ page }) => {
  await authenticatePreview(page)
})

test('preview deployment can send the contact form through Resend', async ({ page }) => {
  await page.goto('/en/contact/other')

  const form = page.locator('form#other-form')
  await expect(form).toBeVisible()

  const fields = await fillAccountFields(page, form, {
    name: 'Preview Test',
    email: 'preview@example.com',
    message: 'Preview test for React Email and Resend.'
  })
  await fields.checkbox.click()

  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(submissionToast(page)).toContainText('Message sent successfully!')
})
