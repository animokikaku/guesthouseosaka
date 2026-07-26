import { expect, test } from '@playwright/test'

const story = 'components/house/house-amenities/Populated'

test('uses responsive visibility and a real desktop dialog', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)

  for (let index = 1; index <= 10; index += 1) {
    await expect(component.getByText(`Amenity ${index}`, { exact: true })).toBeVisible()
  }

  const trigger = component.getByRole('button', { name: 'Show all 4 amenities' })
  await trigger.click()

  const dialog = page.locator('[data-slot="dialog-content"]')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Internet' })).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Bedroom' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('hides overflow amenities and opens a real mobile drawer', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const component = await mount(story)

  for (let index = 1; index <= 5; index += 1) {
    await expect(component.getByText(`Amenity ${index}`, { exact: true })).toBeVisible()
  }
  for (let index = 6; index <= 10; index += 1) {
    await expect(component.getByText(`Amenity ${index}`, { exact: true })).toBeHidden()
  }

  await component.getByRole('button', { name: 'Show all 4 amenities' }).click()

  const drawer = page.locator('[data-slot="drawer-content"]')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('heading', { name: 'Internet' })).toBeVisible()
  await expect(drawer.getByText('Router', { exact: true })).toBeVisible()
})
