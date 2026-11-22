import { expect, test } from './fixtures'

test('lists the rooms on a timeline of icons, its steps spread along the row', async ({
  mount,
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount('components/house/house-rooms/WithRooms')
  const section = component.getByRole('region', { name: 'Upcoming Vacancies' })

  await expect(
    section.getByText('Monthly prices include management and common fees.')
  ).toBeVisible()
  const steps = section.locator('ol > li')
  await expect(steps).toHaveCount(4)
  await expect(steps.nth(0)).toContainText('Available now')
  await expect(steps.nth(1)).toContainText('Dec 8')
  await expect(steps.nth(1).getByRole('link')).toHaveCount(2)
  await expect(steps.nth(2)).toContainText('Feb 1, 2027')
  await expect(steps.nth(3)).toContainText('Date TBC')

  // The step's icon stands where the timeline's dot would, without its ring.
  const icon = steps.nth(1).locator('[data-slot=timeline-indicator]')
  await expect(icon.locator('svg')).toBeVisible()
  await expect(icon).toHaveCSS('border-top-width', '0px')

  // Steps share the row, up to a width, and are never closer than their gap.
  await expect(steps.nth(0)).toHaveCSS('flex-grow', '1')
  await expect(steps.nth(0)).toHaveCSS('max-width', '256px')
  await expect(steps.nth(0)).toHaveCSS('padding-right', '56px')

  const link = section.getByRole('link', { name: /Room 208/ })
  await expect(link).toHaveAttribute('href', '/en/contact/move-in?room=orange-208#tabs')
  // Nothing hangs out of the timeline: it scrolls sideways only, never in itself.
  const viewport = section.locator('[data-slot=scroll-area-viewport]')
  expect(await viewport.evaluate((element) => element.scrollHeight - element.clientHeight)).toBe(0)

  // The whole row is the link, not only its words.
  const row = await steps.nth(1).locator('ul > li').first().boundingBox()
  const target = await link.boundingBox()
  expect(target!.width).toBeCloseTo(row!.width, 0)
  // Taller than its text, so it meets the rows above and below.
  expect(target!.height).toBe(28)
})

test('answers the pointer over a room’s whole step, or its whole row among several', async ({
  mount,
  page
}) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  const component = await mount('components/house/house-rooms/WithRooms')
  const steps = component.locator('ol > li')
  /** The room whose link is under a point, if any. */
  const roomAt = (x: number, y: number) =>
    page.evaluate(
      ([px, py]) => document.elementFromPoint(px, py)?.closest('a')?.textContent ?? null,
      [x, y]
    )
  const centerOf = async (locator: typeof steps) => {
    const box = await locator.boundingBox()
    return { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2, box: box! }
  }

  // A step with one room: its label and its icon are the room's link too.
  const now = await centerOf(steps.nth(0).locator('[data-slot=timeline-date]'))
  expect(await roomAt(now.x, now.y)).toContain('Room 103')
  const icon = await centerOf(steps.nth(0).locator('[data-slot=timeline-indicator]'))
  expect(await roomAt(icon.x, icon.y)).toContain('Room 103')

  // A step with two: each row answers across the step, and the label is no one's.
  const dec8 = await centerOf(steps.nth(1).locator('[data-slot=timeline-date]'))
  expect(await roomAt(dec8.x, dec8.y)).toBeNull()
  const step = await steps.nth(1).boundingBox()
  const first = await centerOf(steps.nth(1).getByRole('link', { name: /Room 208/ }))
  const second = await centerOf(steps.nth(1).getByRole('link', { name: /Room 209/ }))
  const gap = step!.x + step!.width - 20
  expect(await roomAt(gap, first.y)).toContain('Room 208')
  expect(await roomAt(gap, second.y)).toContain('Room 209')
})

test('scrolls sideways on a phone', async ({ mount, page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const component = await mount('components/house/house-rooms/WithRooms')
  const viewport = component.locator('[data-slot=scroll-area-viewport]')

  await expect(component.getByText('Available now')).toBeVisible()
  expect(await viewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true)
})

test('says a fully booked house is', async ({ mount }) => {
  const component = await mount('components/house/house-rooms/FullyBooked')
  const section = component.getByRole('region', { name: 'Upcoming Vacancies' })

  await expect(section.getByText('Currently fully booked')).toBeVisible()
  await expect(section.getByRole('list')).toHaveCount(0)
})
