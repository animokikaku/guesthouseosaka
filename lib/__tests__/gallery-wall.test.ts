// @vitest-environment node

import { GALLERY_WALL_SLOTS, slotPixelSize, slotSizes } from '../gallery-wall'

describe('GALLERY_WALL_SLOTS', () => {
  it('describes exactly the six tiles GalleryWall lays out', () => {
    expect(GALLERY_WALL_SLOTS).toHaveLength(6)
  })

  it('marks the largest tile, and only that one, as the LCP candidate', () => {
    const prioritized = GALLERY_WALL_SLOTS.filter((slot) => slot.priority)
    const largest = GALLERY_WALL_SLOTS.reduce((a, b) => (b.size > a.size ? b : a))

    expect(prioritized).toEqual([largest])
  })
})

describe('slotPixelSize', () => {
  // Guards the derivation against the sizes that used to live in a second,
  // hand-maintained array in lib/transforms/gallery.ts.
  it('derives the crop widths the collage was designed with', () => {
    expect(GALLERY_WALL_SLOTS.map(slotPixelSize)).toEqual([142, 272, 123, 168, 129, 194])
  })
})

describe('slotSizes', () => {
  it('scales the collage width at each breakpoint by the tile share', () => {
    const hero = GALLERY_WALL_SLOTS.find((slot) => slot.priority)!

    expect(slotSizes(hero)).toBe(
      '(min-width: 1280px) 309px, (min-width: 1024px) calc(25.74vw - 21px), ' +
        '(min-width: 768px) calc(25.74vw - 12px), calc(42.9vw - 21px)'
    )
  })
})
