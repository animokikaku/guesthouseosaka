/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GalleryModal } from '../gallery-modal'
import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { store } from '@/lib/store'

// Mock matchMedia for carousel
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

// Mock next-sanity
vi.mock('next-sanity', () => ({
  stegaClean: (value: string) => value
}))

// Mock Sanity image utilities
vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    url: () => 'https://cdn.sanity.io/images/test/image.jpg'
  })
}))

vi.mock('@sanity/asset-utils', () => ({
  getImageDimensions: () => ({ width: 1920, height: 1080 })
}))

// Mock next/image with simple img element for testing
vi.mock('next/image', () => ({
  default: function MockImage({ src, alt }: { src: string; alt: string }) {
    return <img src={src} alt={alt} data-testid="gallery-image" />
  }
}))

// Mock Radix Dialog portals
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children
  }
})

// Mock carousel with simpler implementation
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
  CarouselContent: ({
    children,
    onTouchStart,
    onTouchEnd
  }: {
    children: React.ReactNode
    onTouchStart?: React.TouchEventHandler
    onTouchEnd?: React.TouchEventHandler
  }) => (
    <div data-testid="carousel-content" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="carousel-prev">Previous</button>
}))

describe('GalleryModal', () => {
  const gallery = [
    createGalleryItem({ _key: 'img1', image: createSanityImage({ alt: 'First image' }) }),
    createGalleryItem({ _key: 'img2', image: createSanityImage({ alt: 'Second image' }) }),
    createGalleryItem({ _key: 'img3', image: createSanityImage({ alt: 'Third image' }) })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    store.setState({ photoId: null })
  })

  describe('open/close state', () => {
    it('renders nothing when photoId is null', () => {
      store.setState({ photoId: null })

      const { container } = render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
    })

    it('renders dialog when photoId is set', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes dialog when close button is clicked', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      expect(store.state.photoId).toBe(null)
    })
  })

  describe('accessibility', () => {
    it('has accessible dialog title', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      // The title is sr-only but present
      expect(screen.getByText('title')).toBeInTheDocument()
    })

    it('has accessible dialog description', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      // The description uses translation key with title param
      expect(screen.getByText('description')).toBeInTheDocument()
    })

    it('has accessible close button', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })

  describe('dialog content', () => {
    it('renders close button with icon', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal gallery={gallery} title="Test Gallery" />)

      // Close button should have the arrow icon
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton.querySelector('svg')).toBeInTheDocument()
    })
  })
})
