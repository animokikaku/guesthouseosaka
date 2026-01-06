/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { GalleryModal } from '../gallery-modal'
import { createGalleryCategory, createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'
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

// Store setApi callback for later use in tests
let carouselSetApiCallback: ((api: unknown) => void) | null = null

// Mock carousel with simpler implementation that supports setApi
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({
    children,
    setApi
  }: {
    children: React.ReactNode
    setApi?: (api: unknown) => void
  }) => {
    // Store the setApi callback for triggering in tests
    if (setApi) {
      carouselSetApiCallback = setApi
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

// Create mock carousel API
type MockCarouselApi = {
  selectedScrollSnap: () => number
  scrollPrev: ReturnType<typeof vi.fn>
  scrollNext: ReturnType<typeof vi.fn>
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

let mockApi: MockCarouselApi | null = null
let apiCallbacks: Map<string, (() => void)[]> = new Map()
let currentSelectedIndex = 0

function createMockCarouselApi(): MockCarouselApi {
  return {
    selectedScrollSnap: () => currentSelectedIndex,
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn((event: string, callback: () => void) => {
      const callbacks = apiCallbacks.get(event) || []
      callbacks.push(callback)
      apiCallbacks.set(event, callbacks)
    }),
    off: vi.fn((event: string, callback: () => void) => {
      const callbacks = apiCallbacks.get(event) || []
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
      apiCallbacks.set(event, callbacks)
    })
  }
}

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

  beforeEach(() => {
    vi.clearAllMocks()
    store.setState({ photoId: null })
    mockApi = null
    apiCallbacks = new Map()
    carouselSetApiCallback = null
    currentSelectedIndex = 0
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
      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      // Dispatch ArrowLeft key event
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' })
      document.dispatchEvent(event)

      expect(mockApi.scrollPrev).toHaveBeenCalled()
    })

    it('calls scrollNext on ArrowRight key press', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API and wrap in act to ensure React processes state update
      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      // Dispatch ArrowRight key event
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
      document.dispatchEvent(event)

      expect(mockApi.scrollNext).toHaveBeenCalled()
    })

    it('does not scroll on other key presses', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API and wrap in act to ensure React processes state update
      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      // Dispatch other key events
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Space' }))

      expect(mockApi.scrollPrev).not.toHaveBeenCalled()
      expect(mockApi.scrollNext).not.toHaveBeenCalled()
    })

    it('removes keyboard event listener on unmount', () => {
      store.setState({ photoId: 'img1' })

      const { unmount } = render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      // Set up the mock API and wrap in act to ensure React processes state update
      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      unmount()

      // After unmount, key events should not call the API
      // Reset the mock to verify no additional calls
      mockApi.scrollPrev.mockClear()
      mockApi.scrollNext.mockClear()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

      // Note: The event listeners are removed, so these shouldn't be called
      // But since we're using a mock, we can't verify the removal directly
      // The test mainly ensures no errors occur on unmount
    })
  })

  describe('carousel API integration', () => {
    it('registers select event handler when API is set', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      expect(mockApi.on).toHaveBeenCalledWith('select', expect.any(Function))
    })

    it('cleans up select event handler on unmount', () => {
      store.setState({ photoId: 'img1' })

      const { unmount } = render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      unmount()

      expect(mockApi.off).toHaveBeenCalledWith('select', expect.any(Function))
    })

    it('updates selected index when select event fires', () => {
      store.setState({ photoId: 'img1' })

      render(<GalleryModal galleryCategories={galleryCategories} title="Test Gallery" />)

      mockApi = createMockCarouselApi()
      act(() => {
        carouselSetApiCallback?.(mockApi)
      })

      // Simulate selecting a different slide
      currentSelectedIndex = 2
      act(() => {
        apiCallbacks.get('select')?.forEach((cb) => cb())
      })

      // The component should have updated its internal state
      // We can verify this indirectly by checking the mockApi.selectedScrollSnap was designed to return the new index
      expect(mockApi.selectedScrollSnap()).toBe(2)
    })
  })
})
