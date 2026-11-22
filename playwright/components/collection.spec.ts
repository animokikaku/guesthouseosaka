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

test('puts every badge under its title below the widest layout', async ({ mount, page }) => {
  // Three cards across, each narrower than at full width.
  await page.setViewportSize({ width: 1024, height: 800 })
  const component = await mount(story)
  const houses = component.getByRole('listitem')

  for (const [index, name, label] of [
    [0, 'Orange House', '1 room available now'],
    [1, 'Apple House', '1 room opening soon'],
    // Short enough to fit beside its title, and under it all the same.
    [2, 'Lemon House', 'Fully booked']
  ] as const) {
    const title = await houses.nth(index).getByText(name, { exact: true }).boundingBox()
    const badge = await houses.nth(index).getByText(label).boundingBox()
    expect(badge!.y).toBeGreaterThanOrEqual(title!.y + title!.height)
    expect(badge!.x).toBeCloseTo(title!.x, 0)
  }
})
