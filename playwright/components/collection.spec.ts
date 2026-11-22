import { expect, test } from './fixtures'

test('shows each house’s availability over the top right corner of its photo', async ({
  mount,
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount('components/home/collection/WithRooms')
  const houses = component.getByRole('listitem')
  await expect(houses).toHaveCount(3)

  const badge = houses.nth(0).getByRole('link', { name: '1 room available now' })
  await expect(badge).toHaveAttribute('href', '/en/orange#availability')
  await expect(houses.nth(1).getByText('1 room opening soon')).toBeVisible()
  // Nothing to list, so nothing to link to.
  await expect(houses.nth(2).getByText('Fully booked')).toBeVisible()
  await expect(houses.nth(2).getByRole('link', { name: 'Fully booked' })).toHaveCount(0)

  const photo = await houses.nth(0).locator('[data-slot=item-header]').boundingBox()
  const corner = await badge.boundingBox()
  expect(corner!.y - photo!.y).toBeCloseTo(8, 0)
  expect(photo!.x + photo!.width - (corner!.x + corner!.width)).toBeCloseTo(8, 0)
})
