import { expect, test } from './fixtures'

const story = 'components/home/collection/WithRooms'

test('shows each house’s availability at the end of its title’s row', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  const houses = component.getByRole('listitem')
  await expect(houses).toHaveCount(3)

  const badge = houses.nth(0).getByRole('link', { name: '1 room available now' })
  await expect(badge).toHaveAttribute('href', '/en/orange#availability')
  await expect(houses.nth(1).getByText('1 room opening soon')).toBeVisible()
  // Nothing to list, so nothing to link to.
  await expect(houses.nth(2).getByText('Fully booked')).toBeVisible()
  await expect(houses.nth(2).getByRole('link', { name: 'Fully booked' })).toHaveCount(0)

  // On the title's line, flush with the photo's right edge.
  const card = await houses.nth(0).locator('[data-slot=item-header]').boundingBox()
  const title = await houses.nth(0).getByText('Orange House', { exact: true }).boundingBox()
  const corner = await badge.boundingBox()
  expect(corner!.x + corner!.width).toBeCloseTo(card!.x + card!.width, 0)
  expect(corner!.y).toBeGreaterThan(title!.y)
  expect(corner!.y + corner!.height).toBeLessThan(title!.y + title!.height)
})

test('drops the badge under the title in a card too narrow for both', async ({ mount, page }) => {
  // Three cards across at the narrowest width that has them.
  await page.setViewportSize({ width: 768, height: 800 })
  const component = await mount(story)
  const house = component.getByRole('listitem').nth(0)
  const title = await house.getByText('Orange House', { exact: true }).boundingBox()
  const badge = await house.getByRole('link', { name: '1 room available now' }).boundingBox()
  const card = await house.locator('[data-slot=item-header]').boundingBox()

  expect(badge!.y).toBeGreaterThanOrEqual(title!.y + title!.height)
  expect(badge!.x + badge!.width).toBeLessThanOrEqual(card!.x + card!.width)
})
