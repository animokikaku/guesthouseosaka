import { expect, test } from './fixtures'

const story = 'components/home/collection/WithRooms'

test('shows each house’s availability right after its title', async ({ mount, page }) => {
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

  // On the title's line, a small gap after it.
  const title = await houses.nth(0).getByText('Orange House', { exact: true }).boundingBox()
  const beside = await badge.boundingBox()
  expect(beside!.x - (title!.x + title!.width)).toBeCloseTo(8, 0)
  expect(beside!.y).toBeGreaterThan(title!.y)
  expect(beside!.y + beside!.height).toBeLessThan(title!.y + title!.height)
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
