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

test('closes with the top-left back arrow', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await dialog.getByRole('button', { name: 'Close' }).click()
  await expect(dialog).toBeHidden()
})

test('Escape closes only the lightbox, not the route-intercept modal behind it', async ({
  mount,
  page
}) => {
  await mount('components/gallery/gallery-page-content/WithModal')

  const routeModal = page.getByRole('dialog', { name: 'House Gallery' })
  const lightbox = page.getByRole('dialog', { name: 'Orange House' })
  await expect(routeModal).toBeVisible()

  await routeModal.getByRole('button', { name: 'First room', exact: true }).click()
  await expect(lightbox).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(lightbox).toBeHidden()
  // Give the route modal's own close transition time to run, so a regression
  // that also closes it isn't masked by asserting mid-animation.
  await page.waitForTimeout(500)
  await expect(routeModal).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(routeModal).toBeHidden()
})
