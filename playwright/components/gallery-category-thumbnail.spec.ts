import { expect, test } from '@playwright/test'

const story = 'components/gallery/gallery-category-thumbnail/WithTarget'

test('supports keyboard focus and scrolls to the real category target', async ({ mount, page }) => {
  const component = await mount(story)
  const thumbnail = component.getByRole('button', { name: /Living Room/ })
  const target = component.getByRole('heading', { name: 'Living Room Gallery' })

  await page.keyboard.press('Tab')
  await expect(thumbnail).toBeFocused()
  await expect(target).not.toBeInViewport()

  await page.keyboard.press('Enter')

  await expect(target).toBeInViewport()
})
