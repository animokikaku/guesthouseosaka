// @vitest-environment node

import { GALLERY_WALL_SLOTS, slotPixelSize, slotSizes } from '../gallery-wall'

/** Height over width of the collage's design bound (634×452). */
const ASPECT = 452 / 634

describe('GALLERY_WALL_SLOTS', () => {
  it('lays out the six tiles the home page query asks for', () => {
    expect(GALLERY_WALL_SLOTS).toHaveLength(6)
  })

  it.each(GALLERY_WALL_SLOTS.map((slot, index) => [index, slot] as const))(
    'keeps tile %i inside the collage',
    (_index, { left, top, size }) => {
      expect(left + size).toBeLessThanOrEqual(100)
      // Tiles are square, so their height in percent of the collage is scaled by its aspect.
      expect(top + size / ASPECT).toBeLessThanOrEqual(100.5)
    }
  )

  it('flags the largest tile, and only that one, as the LCP candidate', () => {
    const largest = GALLERY_WALL_SLOTS.reduce((a, b) => (b.size > a.size ? b : a))

    expect(GALLERY_WALL_SLOTS.filter((slot) => slot.priority)).toEqual([largest])
  })
})

describe('slotPixelSize', () => {
  it('crops larger tiles to larger images', () => {
    const bySize = GALLERY_WALL_SLOTS.toSorted((a, b) => a.size - b.size)

    expect(bySize.map(slotPixelSize)).toEqual(bySize.map(slotPixelSize).toSorted((a, b) => a - b))
  })
})

describe('slotSizes', () => {
  /** `sizes` entries as [media query or null, width] pairs. */
  function parse(sizes: string) {
    return sizes.split(', ').map((entry) => {
      const [, query, width] = entry.match(/^(?:(\(min-width: \d+px\)) )?(.+)$/)!
      return [query ?? null, width] as const
    })
  }

  it('lists breakpoints from widest to narrowest and ends with a default', () => {
    const entries = parse(slotSizes(GALLERY_WALL_SLOTS[0]))
    const widths = entries.slice(0, -1).map(([query]) => Number(query?.match(/\d+/)?.[0]))

    expect(widths).toEqual(widths.toSorted((a, b) => b - a))
    expect(entries.at(-1)?.[0]).toBeNull()
  })

  // max-w-7xl caps the collage, so above it every tile has a fixed size.
  it('uses a fixed width at the widest breakpoint and viewport units below it', () => {
    const [[, widest], ...rest] = parse(slotSizes(GALLERY_WALL_SLOTS[0]))

    expect(widest).toMatch(/^\d+px$/)
    for (const [, width] of rest) expect(width).toMatch(/vw/)
  })

  it('asks for more pixels for a bigger tile at the capped width', () => {
    const fixedWidth = (slot: (typeof GALLERY_WALL_SLOTS)[number]) =>
      Number(parse(slotSizes(slot))[0][1].replace('px', ''))
    const bySize = GALLERY_WALL_SLOTS.toSorted((a, b) => a.size - b.size)

    expect(bySize.map(fixedWidth)).toEqual(bySize.map(fixedWidth).toSorted((a, b) => a - b))
  })
})
