import { render, screen } from '@testing-library/react'

vi.mock('next/image', () => import('@/components/__tests__/mocks/next-image'))

import { Lightbox } from '@/components/lightbox'
import { CategoryGrid } from '../gallery-category-grid'
import {
  createGalleryCategory,
  createGalleryItem,
  createSanityImage
} from '@/lib/transforms/__tests__/mocks'
import type { GalleryCategory } from '@/lib/gallery'

function toCategory(raw: ReturnType<typeof createGalleryCategory>): GalleryCategory {
  return {
    _key: raw._key,
    _id: raw.category._id,
    label: raw.category.label,
    thumbnail: raw.items?.[0]?.image ?? null,
    items: raw.items ?? []
  }
}

function indexByKeyFor(category: GalleryCategory) {
  return new Map(category.items.map((item, index) => [item._key, index]))
}

describe('CategoryGrid', () => {
  it('renders category with items', () => {
    const raw = createGalleryCategory({
      _key: 'cat1',
      category: { _id: 'c1', label: 'Bedroom', orderRank: '0|a:' },
      items: [
        createGalleryItem({ _key: 'img1', image: createSanityImage({ alt: 'Bed' }) }),
        createGalleryItem({ _key: 'img2', image: createSanityImage({ alt: 'Desk' }) })
      ]
    })
    const category = toCategory(raw)

    render(
      <Lightbox.Root>
        <CategoryGrid category={category} indexByKey={indexByKeyFor(category)} />
      </Lightbox.Root>
    )

    expect(screen.getByText('Bedroom')).toBeInTheDocument()
    // The visible count is decorative; the localized plural carries the unit
    expect(screen.getByText('2')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText('photo_count')).toHaveClass('sr-only')
    expect(screen.getByAltText('Bed')).toBeInTheDocument()
    expect(screen.getByAltText('Desk')).toBeInTheDocument()
  })

  it('returns null for empty category', () => {
    const raw = createGalleryCategory({
      _key: 'empty',
      category: { _id: 'c1', label: 'Empty', orderRank: '0|a:' },
      items: []
    })
    const category = toCategory(raw)

    const { container } = render(
      <Lightbox.Root>
        <CategoryGrid category={category} indexByKey={indexByKeyFor(category)} />
      </Lightbox.Root>
    )

    expect(container.firstChild).toBeNull()
  })
})
