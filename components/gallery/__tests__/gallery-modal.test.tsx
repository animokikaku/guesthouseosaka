/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { store } from '@/lib/store'
import {
  type CarouselMockState,
  type MockCarouselApi,
  createMockCarouselApi,
  resetCarouselMockState
} from '@/lib/__tests__/utils/carousel-mock'

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

// Use vi.hoisted to create state that can be used in vi.mock
const { carouselState } = vi.hoisted(() => {
  const state: CarouselMockState = {
    mockApi: null,
    apiCallbacks: new Map(),
    setApiCallback: null,
    currentSelectedIndex: 0
  }
  return { carouselState: state }
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

// Mock carousel with state capture
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({
    children,
    setApi
  }: {
    children: React.ReactNode
    setApi?: (api: MockCarouselApi) => void
  }) => {
    if (setApi) {
      carouselState.setApiCallback = setApi
    }
    return <div data-testid="carousel">{children}</div>
  },
  CarouselContent: ({
    children,
    onTouchStart,
    onTouchEnd
  }: {
    children: React.ReactNode
    onTouchStart?: React.TouchEventHandler
    onTouchEnd?: React.TouchEventHandler
  }) => (
    <div
      data-testid="carousel-content"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
  CarouselNext: () => <button data-testid="carousel-next">Next</button>,
  CarouselPrevious: () => <button data-testid="carousel-prev">Previous</button>
}))

// Import component after mocks
import { GalleryModal } from '../gallery-modal'
import { createGalleryCategory, createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'

describe('GalleryModal', () => {
  const galleryCategories = [
    createGalleryCategory({
      _key: 'cat1',
      items: [
        createGalleryItem({ _key: 'img1', image: createSanityImage({ alt: 'First image' }) }),
        createGalleryItem({ _key: 'img2', image: createSanityImage({ alt: 'Second image' }) }),
        createGalleryItem({ _key: 'img3', image: createSanityImage({ alt: 'Third image' }) })
      ]
    })
  ]

  // Suppress React act() warnings from Radix Dialog internal state updates
  // These warnings come from third-party library internals (FocusScope, Presence, DismissableLayer)
  const originalError = console.error
  beforeEach(() => {
    vi.clearAllMocks()
    store.setState({ photoId: null })
    resetCarouselMockState(carouselState)
    console.error = (...args: unknown[]) => {
      const message = args[0]
      if (typeof message === 'string' && message.includes('was not wrapped in act')) {
        return
      }
      originalError.apply(console, args)
    }
  })

  afterEach(() => {
    console.error = originalError
  })

  describe('open/close state', () => {
    it('renders nothing when photoId is null', () => {
      store.setState({ photoId: null })

      const { container } = render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument()
    })

    it('renders dialog when photoId is set', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('closes dialog when close button is clicked', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      expect(store.state.photoId).toBe(null)
    })
  })

  describe('accessibility', () => {
    it('has accessible dialog title', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // The title is sr-only but present
      expect(screen.getByText('title')).toBeInTheDocument()
    })

    it('has accessible dialog description', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // The description uses translation key with title param
      expect(screen.getByText('description')).toBeInTheDocument()
    })

    it('has accessible close button', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })

  describe('dialog content', () => {
    it('renders close button with icon', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Close button should have the arrow icon
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
      expect(closeButton.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('keyboard navigation', () => {
    it('calls scrollPrev on ArrowLeft key press', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API and wrap in act to ensure React processes state update
      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      // Dispatch ArrowLeft key event
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      document.dispatchEvent(event)

      expect(carouselState.mockApi.scrollPrev).toHaveBeenCalled()
    })

    it('calls scrollNext on ArrowRight key press', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API and wrap in act to ensure React processes state update
      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      // Dispatch ArrowRight key event
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      document.dispatchEvent(event)

      expect(carouselState.mockApi.scrollNext).toHaveBeenCalled()
    })

    it('does not scroll on other key presses', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API and wrap in act to ensure React processes state update
      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      // Dispatch other key events
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }))

      expect(carouselState.mockApi.scrollPrev).not.toHaveBeenCalled()
      expect(carouselState.mockApi.scrollNext).not.toHaveBeenCalled()
    })

    it('removes keyboard event listener on unmount', () => {
      store.setState({ photoId: 'img1' })

      const { unmount } = render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API
      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      unmount()

      // Reset call counts after unmount
      carouselState.mockApi.scrollPrev.mockClear()
      carouselState.mockApi.scrollNext.mockClear()

      // Dispatch key events after unmount - should not trigger scroll
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

      expect(carouselState.mockApi.scrollPrev).not.toHaveBeenCalled()
      expect(carouselState.mockApi.scrollNext).not.toHaveBeenCalled()
    })
  })

  describe('carousel API integration', () => {
    it('registers select event handler when API is set', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      expect(carouselState.mockApi.on).toHaveBeenCalledWith('select', expect.any(Function))
    })

    it('cleans up select event handler on unmount', () => {
      store.setState({ photoId: 'img1' })

      const { unmount } = render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      unmount()

      expect(carouselState.mockApi.off).toHaveBeenCalledWith('select', expect.any(Function))
    })
  })
})
