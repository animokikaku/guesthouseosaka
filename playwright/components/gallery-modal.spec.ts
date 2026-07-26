import { expect, test } from '@playwright/test'

const story = 'components/gallery/gallery-modal/Open'

test('opens at the selected image', async ({ mount, page }) => {
  await mount(story)

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('First room', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('img', { name: 'First room' })).toBeVisible()
})

test('supports real carousel button and keyboard navigation', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await mount(story)

  const dialog = page.getByRole('dialog')
  const nextButton = dialog.getByRole('button', { name: 'Next slide' })

  await expect(nextButton).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('Second room', { exact: true })).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(dialog.getByText('First room', { exact: true })).toBeVisible()

  await nextButton.click()
  await expect(dialog.getByText('Second room', { exact: true })).toBeVisible()
})

test('closes with Escape', async ({ mount, page }) => {
  await mount(story)

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('uses mobile controls and closes after a vertical swipe', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await mount(story)

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Next slide' })).toBeHidden()

  const carousel = dialog.locator('[data-slot="carousel-content"] > div')
  await carousel.dispatchEvent('touchstart', {
    touches: [{ identifier: 0, clientX: 100, clientY: 100 }]
  })
  await carousel.dispatchEvent('touchend', {
    changedTouches: [{ identifier: 0, clientX: 100, clientY: 180 }]
  })

  await expect(dialog).toBeHidden()
})
