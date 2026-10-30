// @vitest-environment node

import { GALLERY_WALL_SLOTS, slotPixelSize } from '@/lib/gallery-wall'
import { createSanityImage } from './mocks'
import { toGalleryImages } from '../gallery'

type WallImage = Parameters<typeof toGalleryImages>[0][number]

function wallImages(count: number): WallImage[] {
  return Array.from({ length: count }, (_, index) => {
    const { asset, ...image } = createSanityImage({ alt: `Tile ${index}` })
    if (!asset) throw new Error('createSanityImage always builds an asset by default')
    return { _key: `tile-${index}`, ...image, asset }
  })
}

describe('toGalleryImages', () => {
  it('crops each tile square at the size of the slot it fills', () => {
    const tiles = toGalleryImages(wallImages(6))

    tiles.forEach((tile, index) => {
      const size = slotPixelSize(GALLERY_WALL_SLOTS[index])
      const { searchParams } = new URL(tile.src)

      expect(tile).toMatchObject({ width: size, height: size })
      expect(searchParams.get('w')).toBe(String(size))
      expect(searchParams.get('h')).toBe(String(size))
      expect(searchParams.get('fit')).toBe('crop')
    })
  })

  it('keeps each tile’s key, alt text and blur preview', () => {
    const [image] = wallImages(1)

    expect(toGalleryImages([image])[0]).toMatchObject({
      _key: image._key,
      alt: image.alt,
      blurHash: image.blurHash
    })
  })

  it('prioritizes only the tile in the largest slot', () => {
    const tiles = toGalleryImages(wallImages(6))
    const largest = GALLERY_WALL_SLOTS.findIndex((slot) => slot.priority)

    expect(tiles.map((tile) => tile.priority)).toEqual(tiles.map((_, index) => index === largest))
  })

  it('drops images beyond the six slots', () => {
    expect(toGalleryImages(wallImages(8))).toHaveLength(6)
  })
})
