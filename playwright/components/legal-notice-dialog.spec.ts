import { expect, test } from '@playwright/test'

test('opens and closes the real desktop dialog with focus restoration', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount('components/legal-notice-dialog/Closable')
  const trigger = component.getByRole('button', { name: 'Privacy Policy' })

  await trigger.click()

  const dialog = page.locator('[data-slot="dialog-content"]')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()
  await expect(dialog.getByText('Policy content rendered in the browser.')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('records agreement through the real mobile drawer callback', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const component = await mount('components/legal-notice-dialog/Agreeable')

  await component.getByRole('button', { name: 'Privacy Policy' }).click()

  const drawer = page.locator('[data-slot="drawer-content"]')
  await expect(drawer).toBeVisible()
  await drawer.getByRole('button', { name: 'I agree' }).click()

  await expect(component.getByTestId('agreement-count')).toHaveValue('1')
  await expect(drawer).toBeHidden()
})
