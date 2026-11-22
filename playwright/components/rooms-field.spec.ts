import { expect, test } from './fixtures'

const story = 'components/forms/fields/rooms-field/TwoHouses'

test('chooses rooms from a list under the field on a wide screen', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  const input = component.getByRole('combobox', { name: /Rooms/ })

  await expect(component.getByRole('button', { name: 'Remove Room 208' })).toBeVisible()

  await input.click()
  const list = page.getByRole('listbox')
  await expect(list.getByRole('group', { name: 'Orange House' })).toBeVisible()
  await expect(list.getByRole('group', { name: 'Apple House' })).toBeVisible()
  await expect(list.getByRole('option')).toHaveText([
    'Room 103Available now¥53,000',
    'Room 208Dec 8¥58,000',
    'Room 402Mar 15, 2027¥63,000'
  ])
  await expect(list.getByRole('option', { name: /Room 208/ })).toHaveAttribute(
    'aria-selected',
    'true'
  )

  await list.getByRole('option', { name: /Room 402/ }).click()
  await expect(component.getByRole('button', { name: 'Remove Room 402' })).toBeVisible()

  // Typing narrows the list.
  await input.fill('103')
  await expect(list.getByRole('option')).toHaveText(['Room 103Available now¥53,000'])
  await page.keyboard.press('Escape')

  await component.getByRole('button', { name: 'Remove Room 208' }).click()
  await expect(component.getByRole('button', { name: 'Remove Room 208' })).toBeHidden()
  await expect(component.getByRole('button', { name: 'Remove Room 402' })).toBeVisible()
})

test('chooses rooms from a sheet on a phone, without a keyboard', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const component = await mount(story)

  // No text input for the keyboard to open on.
  await expect(component.getByRole('combobox')).toHaveCount(0)
  await component.getByRole('button', { name: 'Choose rooms' }).click()

  const sheet = page.locator('[data-slot="drawer-content"]')
  await expect(sheet).toBeVisible()
  await expect(sheet.getByRole('group', { name: 'Apple House' })).toBeVisible()
  await expect(sheet.getByRole('checkbox', { name: /Room 208/ })).toBeChecked()

  // Each row is its checkbox's label, which is what a finger reaches.
  await sheet.getByText('Room 402').click()
  await sheet.getByText('Room 208').click()
  await expect(sheet.getByRole('checkbox', { name: /Room 402/ })).toBeChecked()
  await expect(sheet.getByRole('checkbox', { name: /Room 208/ })).not.toBeChecked()
  await sheet.getByRole('button', { name: 'Done' }).click()

  await expect(sheet).toBeHidden()
  await expect(component.getByRole('button', { name: 'Remove Room 402' })).toBeVisible()
  await expect(component.getByRole('button', { name: 'Remove Room 208' })).toBeHidden()
})
