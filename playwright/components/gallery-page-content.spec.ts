import { expect, test } from '@playwright/test'

const story = 'components/gallery/gallery-page-content/Default'

test('opens the lightbox from a grid item with the right image and caption', async ({
  mount,
  page
}) => {
  const component = await mount(story)
  const trigger = component.getByRole('button', { name: 'First room', exact: true })

  await trigger.click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(
    dialog.getByLabel('Full-size images').getByRole('img', { name: 'First room' })
  ).toBeVisible()
  await expect(dialog.getByText('First room', { exact: true })).toBeVisible()
})

test('navigates with arrow keys and the thumbnail strip', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)

  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')

  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('Second room', { exact: true })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('Third room', { exact: true })).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(dialog.getByText('Second room', { exact: true })).toBeVisible()

  // There is no on-screen prev/next chrome — the strip is the pointer affordance.
  await dialog.getByRole('tab').first().click()
  await expect(dialog.getByText('First room', { exact: true })).toBeVisible()
})

test('closes with Escape', async ({ mount, page }) => {
  const component = await mount(story)
  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('closes with the top-left back arrow', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()
})

test('closes on a downward drag', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const component = await mount(story)
  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  const image = dialog.getByLabel('Full-size images').getByRole('img', { name: 'First room' })
  const box = await image.boundingBox()
  if (!box) throw new Error('Expected the slide image to have a bounding box')

  // Ramka's pull-to-dismiss only reacts to real touch pointers, not mouse drags,
  // so simulate a vertical touch drag via synthetic PointerEvents.
  const startX = box.x + box.width / 2
  const startY = box.y + box.height / 2
  const pointerId = 1

  await image.dispatchEvent('pointerdown', {
    pointerId,
    pointerType: 'touch',
    clientX: startX,
    clientY: startY,
    bubbles: true
  })
  for (let step = 1; step <= 10; step++) {
    await image.dispatchEvent('pointermove', {
      pointerId,
      pointerType: 'touch',
      clientX: startX,
      clientY: startY + step * 30,
      bubbles: true
    })
  }
  await image.dispatchEvent('pointerup', {
    pointerId,
    pointerType: 'touch',
    clientX: startX,
    clientY: startY + 300,
    bubbles: true
  })

  await expect(dialog).toBeHidden()
})

test('zooms in and out', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')
  const zoomIn = dialog.getByRole('button', { name: 'Zoom in' })
  const zoomOut = dialog.getByRole('button', { name: 'Zoom out' })

  await expect(zoomOut).toBeDisabled()
  await zoomIn.click()
  await expect(zoomOut).toBeEnabled()

  await zoomOut.click()
  await expect(zoomOut).toBeDisabled()
})
