import { HouseGallery } from '@/components/gallery/house-gallery'
import {
  createGalleryCategory,
  createGalleryItem,
  createSanityImage
} from '@/lib/transforms/__tests__/mocks'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="gallery-image" />
  )
}))

// Mock Sanity image utilities
vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        dpr: () => ({
          fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' })
        })
      })
    }),
    url: () => 'https://cdn.sanity.io/test.jpg'
  })
}))

vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string) => value
}))

// Mock GalleryImageButton
vi.mock('../gallery-image-button', () => ({
  GalleryImageButton: ({
    onClick,
    imageProps
  }: {
    onClick: () => void
    imageProps: { alt: string }
  }) => (
    <button data-testid="gallery-image-button" onClick={onClick}>
      {imageProps.alt}
    </button>
  )
}))

describe('HouseGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty gallery', () => {
    it('renders nothing for empty galleryCategories', () => {
      const { container } = render(<HouseGallery galleryCategories={[]} />)

      expect(container.querySelector('h3')).not.toBeInTheDocument()
    })

    it('renders nothing for null galleryCategories', () => {
      const { container } = render(
        <HouseGallery galleryCategories={null as unknown as []} />
      )

      expect(container.querySelector('h3')).not.toBeInTheDocument()
    })
  })

  describe('category rendering', () => {
    it('renders category headings', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', key: 'bedroom', label: 'Bedroom', orderRank: '0|a:' },
          items: [
            createGalleryItem({ _key: 'img1', image: createSanityImage({ alt: 'Image 1' }) }),
            createGalleryItem({ _key: 'img2', image: createSanityImage({ alt: 'Image 2' }) })
          ]
        })
      ]

      render(<HouseGallery galleryCategories={galleryCategories} />)

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Bedroom'
      )
    })

    it('renders multiple categories', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', key: 'bedroom', label: 'Bedroom', orderRank: '0|a00000:' },
          items: [createGalleryItem({ _key: 'img1' })]
        }),
        createGalleryCategory({
          _key: 'cat2',
          category: { _id: 'id2', key: 'kitchen', label: 'Kitchen', orderRank: '0|b00000:' },
          items: [createGalleryItem({ _key: 'img2' })]
        })
      ]

      render(<HouseGallery galleryCategories={galleryCategories} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings).toHaveLength(2)
    })

    it('sorts categories by orderRank (lexicographic)', () => {
      // Categories provided in reverse order to test sorting
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', key: 'kitchen', label: 'Kitchen', orderRank: '0|b00000:' },
          items: [createGalleryItem({ _key: 'img1' })]
        }),
        createGalleryCategory({
          _key: 'cat2',
          category: { _id: 'id2', key: 'bedroom', label: 'Bedroom', orderRank: '0|a00000:' },
          items: [createGalleryItem({ _key: 'img2' })]
        })
      ]

      render(<HouseGallery galleryCategories={galleryCategories} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings[0]).toHaveTextContent('Bedroom')
      expect(headings[1]).toHaveTextContent('Kitchen')
    })
  })

  describe('gallery grid', () => {
    it('renders image buttons for each gallery item', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', key: 'room', label: 'Room', orderRank: '0|a:' },
          items: [
            createGalleryItem({ _key: 'img1', image: createSanityImage({ alt: 'Image 1' }) }),
            createGalleryItem({ _key: 'img2', image: createSanityImage({ alt: 'Image 2' }) }),
            createGalleryItem({ _key: 'img3', image: createSanityImage({ alt: 'Image 3' }) })
          ]
        })
      ]

      render(<HouseGallery galleryCategories={galleryCategories} />)

      const buttons = screen.getAllByTestId('gallery-image-button')
      expect(buttons).toHaveLength(3)
    })
  })

  describe('category thumbnails', () => {
    it('renders category thumbnail buttons', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', key: 'room', label: 'Room', orderRank: '0|a:' },
          items: [createGalleryItem({ _key: 'img1' })]
        })
      ]

      render(<HouseGallery galleryCategories={galleryCategories} />)

      // Multiple buttons: thumbnail + grid item
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
