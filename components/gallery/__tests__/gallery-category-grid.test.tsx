/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        dpr: () => ({
          fit: () => ({
            url: () => 'https://cdn.sanity.io/images/test/image.jpg'
          })
        })
      })
    })
  })
}))

vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string) => value
}))

vi.mock('next/image', () => ({
  default: function MockImage({ alt }: { alt: string }) {
    return <img alt={alt} />
  }
}))

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

    render(<CategoryGrid category={toCategory(raw)} />)

    expect(screen.getByText('Bedroom')).toBeInTheDocument()
    expect(screen.getByAltText('Bed')).toBeInTheDocument()
    expect(screen.getByAltText('Desk')).toBeInTheDocument()
  })

  it('returns null for empty category', () => {
    const raw = createGalleryCategory({
      _key: 'empty',
      category: { _id: 'c1', label: 'Empty', orderRank: '0|a:' },
      items: []
    })

    const { container } = render(<CategoryGrid category={toCategory(raw)} />)

    expect(container.firstChild).toBeNull()
  })
})
