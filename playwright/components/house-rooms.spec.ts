import { expect, test } from './fixtures'

const story = 'components/house/house-rooms/WithRooms'

test('lists every room as a link, as many across as fit', async ({ mount, page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount(story)
  const section = component.getByRole('region', { name: 'Upcoming Vacancies' })

  await expect(
    section.getByText('Monthly prices include management and common fees.')
  ).toBeVisible()
  const rooms = section.getByRole('listitem')
  // A date is followed by its sentence for screen readers, out of sight.
  await expect(rooms).toHaveText([
    'Room 103¥53,000Available now',
    'Room 208¥58,000Dec 8Available from Dec 8',
    'Room 209¥58,000Dec 8Available from Dec 8',
    'Room 309Feb 1, 2027Available from Feb 1, 2027',
    'Room 204¥56,000Date TBC'
  ])
  // Each says when with an icon: a check, a calendar, a calendar with a clock.
  for (const index of [0, 1, 4]) {
    await expect(rooms.nth(index).locator('[data-slot=item-description] svg')).toBeVisible()
  }

  const link = section.getByRole('link', { name: /Room 208/ })
  await expect(link).toHaveAttribute('href', '/en/contact/move-in?room=orange-208#tabs')
  // The price follows the room name on its line.
  const price = await rooms.nth(1).locator('[data-slot=room-price]').boundingBox()
  const name = await rooms.nth(1).locator('[data-slot=item-title]').boundingBox()
  expect(price!.x + price!.width).toBeCloseTo(name!.x + name!.width, 0)
  expect(Math.abs(price!.y + price!.height / 2 - (name!.y + name!.height / 2))).toBeLessThan(3)

  // The whole item is the link.
  const item = await rooms.nth(1).boundingBox()
  const target = await link.boundingBox()
  expect(target!.width).toBeCloseTo(item!.width, 0)
  expect(target!.height).toBeCloseTo(item!.height, 0)

  // Several side by side, the rest on the row below.
  const first = await rooms.nth(0).boundingBox()
  const last = await rooms.nth(4).boundingBox()
  expect(item!.y).toBe(first!.y)
  expect(item!.x).toBeGreaterThan(first!.x)
  expect(last!.y).toBeGreaterThan(first!.y)
})

test('keeps a long answer on one line, and every item as tall as the next', async ({
  mount,
  page
}) => {
  // French says "Available now" at its longest, and prices as "53 000 JPY".
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount('components/house/house-rooms/French')
  const rooms = component.getByRole('listitem')
  await expect(rooms.nth(0)).toContainText('Disponible maintenant')

  const heights = await rooms.evaluateAll((items) =>
    items.map((item) => item.querySelector('a')!.getBoundingClientRect().height)
  )
  expect(new Set(heights).size).toBe(1)
  const when = await rooms.nth(0).locator('[data-slot=item-description]').boundingBox()
  const later = await rooms.nth(1).locator('[data-slot=item-description]').boundingBox()
  expect(when!.height).toBe(later!.height)
  // The name and its price share one line too.
  await expect(rooms.nth(1).locator('[data-slot=item-title]')).toHaveText('Chambre 20858 000 JPY')
  const title = await rooms.nth(1).locator('[data-slot=item-title]').boundingBox()
  expect(title!.height).toBeLessThan(24)
})

test('stacks the rooms on a phone, with nothing to scroll sideways', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const component = await mount(story)
  const rooms = component.getByRole('listitem')

  const first = await rooms.nth(0).boundingBox()
  const second = await rooms.nth(1).boundingBox()
  expect(second!.x).toBe(first!.x)
  expect(second!.y).toBeGreaterThan(first!.y)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('says a fully booked house is', async ({ mount }) => {
  const component = await mount('components/house/house-rooms/FullyBooked')
  const section = component.getByRole('region', { name: 'Upcoming Vacancies' })

  await expect(section.getByText('Currently fully booked')).toBeVisible()
  await expect(section.getByRole('list')).toHaveCount(0)
})
