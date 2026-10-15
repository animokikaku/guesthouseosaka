import { expect, test } from './fixtures'
import { message } from '../../lib/__tests__/utils/messages'

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
    dialog.getByLabel(message('Lightbox.full_size_images')).getByRole('img', { name: 'First room' })
  ).toBeVisible()
  await expect(dialog.getByText('First room', { exact: true })).toBeVisible()
})

test('closes with the top-left back arrow', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  await component.getByRole('button', { name: 'First room', exact: true }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await dialog.getByRole('button', { name: message('Lightbox.close'), exact: true }).click()
  await expect(dialog).toBeHidden()
})

test('Escape closes only the lightbox, not the route-intercept modal behind it', async ({
  mount,
  page
}) => {
  await mount('components/gallery/gallery-page-content/WithModal')

  const routeModal = page.getByRole('dialog', { name: message('GalleryModal.title') })
  const lightbox = page.getByRole('dialog', { name: 'Orange House' })
  await expect(routeModal).toBeVisible()

  await routeModal.getByRole('button', { name: 'First room', exact: true }).click()
  await expect(lightbox).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(lightbox).toBeHidden()
  // A regression that also closes the route modal would only show once its exit
  // transition finished, so wait on the animations themselves rather than a
  // fixed delay: this settles immediately when nothing is animating.
  await routeModal.evaluate((element) =>
    Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished))
  )
  await expect(routeModal).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(routeModal).toBeHidden()
})

// The full-bleed / snug choice is a visitor preference, kept across galleries and visits.
test('remembers the slide layout the visitor picked', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  const openLightbox = async () => {
    await component.getByRole('button', { name: 'First room', exact: true }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
  }
  const snugToggle = () =>
    page.getByRole('button', { name: message('Lightbox.switch_to_bleed_slides') })

  await openLightbox()
  await page.getByRole('button', { name: message('Lightbox.switch_to_snug_slides') }).click()
  await expect(snugToggle()).toHaveAttribute('aria-pressed', 'true')

  await page.keyboard.press('Escape')
  await openLightbox()
  await expect(snugToggle()).toHaveAttribute('aria-pressed', 'true')

  await page.reload()
  await mount(story)
  await openLightbox()
  await expect(snugToggle()).toHaveAttribute('aria-pressed', 'true')
})
