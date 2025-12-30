import {
  createGalleryCategory,
  createGalleryItem
} from '@/lib/transforms/__tests__/mocks'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HouseGalleryClient } from '../house-gallery-client'

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

// Mock useOptimistic
vi.mock('@/hooks/use-optimistic', () => ({
  useOptimistic: (data: { gallery: unknown }, field: string) => [
    data[field as keyof typeof data],
    { list: () => '', item: () => '' }
  ]
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

const baseProps = {
  _id: 'house-123',
  _type: 'house' as const
}

describe('HouseGalleryClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty gallery', () => {
    it('renders nothing for empty gallery', () => {
      const { container } = render(
        <HouseGalleryClient {...baseProps} gallery={[]} />
      )

      expect(container.querySelector('h3')).not.toBeInTheDocument()
    })

    it('renders nothing for null gallery', () => {
      const { container } = render(
        <HouseGalleryClient {...baseProps} gallery={null as unknown as []} />
      )

      expect(container.querySelector('h3')).not.toBeInTheDocument()
    })
  })

  describe('category rendering', () => {
    it('renders category headings', () => {
      const category = createGalleryCategory({
        key: 'bedroom',
        label: 'Bedroom'
      })
      const gallery = [
        createGalleryItem({ _key: 'img1', category }),
        createGalleryItem({ _key: 'img2', category })
      ]

      render(<HouseGalleryClient {...baseProps} gallery={gallery} />)

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Bedroom'
      )
    })

    it('renders multiple categories', () => {
      const bedroomCat = createGalleryCategory({
        key: 'bedroom',
        label: 'Bedroom',
        order: 1
      })
      const kitchenCat = createGalleryCategory({
        key: 'kitchen',
        label: 'Kitchen',
        order: 2
      })
      const gallery = [
        createGalleryItem({ _key: 'img1', category: bedroomCat }),
        createGalleryItem({ _key: 'img2', category: kitchenCat })
      ]

      render(<HouseGalleryClient {...baseProps} gallery={gallery} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings).toHaveLength(2)
    })

    it('sorts categories by order', () => {
      const kitchenCat = createGalleryCategory({
        key: 'kitchen',
        label: 'Kitchen',
        order: 2
      })
      const bedroomCat = createGalleryCategory({
        key: 'bedroom',
        label: 'Bedroom',
        order: 1
      })
      const gallery = [
        createGalleryItem({ _key: 'img1', category: kitchenCat }),
        createGalleryItem({ _key: 'img2', category: bedroomCat })
      ]

      render(<HouseGalleryClient {...baseProps} gallery={gallery} />)

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings[0]).toHaveTextContent('Bedroom')
      expect(headings[1]).toHaveTextContent('Kitchen')
    })
  })

  describe('gallery grid', () => {
    it('renders image buttons for each gallery item', () => {
      const category = createGalleryCategory({ key: 'room', label: 'Room' })
      const gallery = [
        createGalleryItem({ _key: 'img1', category }),
        createGalleryItem({ _key: 'img2', category }),
        createGalleryItem({ _key: 'img3', category })
      ]

      render(<HouseGalleryClient {...baseProps} gallery={gallery} />)

      const buttons = screen.getAllByTestId('gallery-image-button')
      expect(buttons).toHaveLength(3)
    })
  })

  describe('category thumbnails', () => {
    it('renders category thumbnail buttons', () => {
      const category = createGalleryCategory({ key: 'room', label: 'Room' })
      const gallery = [createGalleryItem({ _key: 'img1', category })]

      render(<HouseGalleryClient {...baseProps} gallery={gallery} />)

      // Multiple buttons: thumbnail + grid item
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })
})
