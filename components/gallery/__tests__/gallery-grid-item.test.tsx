/* eslint-disable @next/next/no-img-element */
import type { GalleryItem } from '@/lib/gallery'
import { store } from '@/lib/store'
import { fireEvent, render, screen } from '@testing-library/react'
import { GalleryGridItem } from '../gallery-grid-item'

// Mock Sanity image utilities
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

// Mock stegaClean
vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string) => value
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: function MockImage({
    src,
    alt,
    width,
    height,
    blurDataURL,
    placeholder,
    className,
    sizes
  }: {
    src: string
    alt: string
    width: number
    height: number
    blurDataURL?: string
    placeholder?: string
    className?: string
    sizes?: string
  }) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        data-blur-url={blurDataURL}
        data-placeholder={placeholder}
        data-sizes={sizes}
        className={className}
        data-testid="gallery-image"
      />
    )
  }
}))

function createGalleryItem(overrides: Partial<GalleryItem> = {}): GalleryItem {
  return {
    _key: 'item1',
    image: {
      asset: { _ref: 'image-test-123', _type: 'reference' },
      hotspot: null,
      crop: null,
      alt: 'Test gallery image',
      preview: 'data:image/jpeg;base64,abc123'
    },
    ...overrides
  }
}

describe('GalleryGridItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    store.setState((prev) => ({ ...prev, photoId: null }))
  })

  describe('empty states', () => {
    it('returns null when image is null', () => {
      const item = {
        ...createGalleryItem(),
        image: null
      } as unknown as GalleryItem

      const { container } = render(<GalleryGridItem item={item} categoryKey="cat1" />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('rendering', () => {
    it('renders gallery image', () => {
      const item = createGalleryItem()

      render(<GalleryGridItem item={item} categoryKey="cat1" />)

      expect(screen.getByTestId('gallery-grid-image')).toBeInTheDocument()
      const image = screen.getByTestId('gallery-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'Test gallery image')
    })

    it('renders with empty alt when alt is null', () => {
      const item = createGalleryItem({
        image: {
          asset: { _ref: 'image-test', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: null,
          preview: null
        }
      })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)

      const image = screen.getByTestId('gallery-image')
      expect(image).toHaveAttribute('alt', '')
    })

    it('uses blur placeholder when preview is available', () => {
      const item = createGalleryItem({
        image: {
          asset: { _ref: 'image-test', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: 'Test',
          preview: 'data:image/jpeg;base64,preview123'
        }
      })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)

      const image = screen.getByTestId('gallery-image')
      expect(image).toHaveAttribute('data-placeholder', 'blur')
      expect(image).toHaveAttribute('data-blur-url', 'data:image/jpeg;base64,preview123')
    })

    it('does not use blur placeholder when preview is null', () => {
      const item = createGalleryItem({
        image: {
          asset: { _ref: 'image-test', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: 'Test',
          preview: null
        }
      })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)

      const image = screen.getByTestId('gallery-image')
      expect(image.getAttribute('data-placeholder')).toBeNull()
    })
  })

  describe('click handler', () => {
    it('sets photoId in store when clicked', () => {
      const item = createGalleryItem({ _key: 'photo-123' })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)
      fireEvent.click(screen.getByTestId('gallery-grid-image'))

      expect(store.state.photoId).toBe('photo-123')
    })

    it('sets correct photoId for different items', () => {
      const item1 = createGalleryItem({ _key: 'photo-1' })
      const item2 = createGalleryItem({ _key: 'photo-2' })

      const { rerender } = render(<GalleryGridItem item={item1} categoryKey="cat1" />)
      fireEvent.click(screen.getByTestId('gallery-grid-image'))
      expect(store.state.photoId).toBe('photo-1')

      store.setState((prev) => ({ ...prev, photoId: null }))

      rerender(<GalleryGridItem item={item2} categoryKey="cat1" />)
      fireEvent.click(screen.getByTestId('gallery-grid-image'))
      expect(store.state.photoId).toBe('photo-2')
    })
  })

  describe('keyboard handler', () => {
    it('sets photoId when Enter key is pressed', () => {
      const item = createGalleryItem({ _key: 'photo-enter' })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)
      fireEvent.keyDown(screen.getByTestId('gallery-grid-image'), { key: 'Enter' })

      expect(store.state.photoId).toBe('photo-enter')
    })

    it('sets photoId when Space key is pressed', () => {
      const item = createGalleryItem({ _key: 'photo-space' })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)
      fireEvent.keyDown(screen.getByTestId('gallery-grid-image'), { key: ' ' })

      expect(store.state.photoId).toBe('photo-space')
    })

    it('prevents default behavior on Enter key', () => {
      const item = createGalleryItem({ _key: 'photo-123' })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)
      const event = fireEvent.keyDown(screen.getByTestId('gallery-grid-image'), { key: 'Enter' })

      // fireEvent.keyDown returns false if preventDefault was called
      expect(event).toBe(false)
    })

    it('prevents default behavior on Space key', () => {
      const item = createGalleryItem({ _key: 'photo-123' })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)
      const event = fireEvent.keyDown(screen.getByTestId('gallery-grid-image'), { key: ' ' })

      expect(event).toBe(false)
    })

    it('does not set photoId for other keys', () => {
      const item = createGalleryItem({ _key: 'photo-123' })

      render(<GalleryGridItem item={item} categoryKey="cat1" />)
      fireEvent.keyDown(screen.getByTestId('gallery-grid-image'), { key: 'Tab' })

      expect(store.state.photoId).toBeNull()
    })
  })

  describe('data attributes', () => {
    it('sets data-sanity attribute when dataAttribute function is provided', () => {
      const item = createGalleryItem({ _key: 'item-123' })
      const dataAttribute = vi.fn((path: string) => `encoded-path:${path}`)

      render(<GalleryGridItem item={item} categoryKey="cat-abc" dataAttribute={dataAttribute} />)

      expect(dataAttribute).toHaveBeenCalledWith(
        'galleryCategories[_key=="cat-abc"].items[_key=="item-123"]'
      )

      expect(screen.getByTestId('gallery-grid-image')).toHaveAttribute(
        'data-sanity',
        'encoded-path:galleryCategories[_key=="cat-abc"].items[_key=="item-123"]'
      )
    })

    it('does not set data-sanity attribute when dataAttribute is undefined', () => {
      render(<GalleryGridItem item={createGalleryItem()} categoryKey="cat1" />)
      expect(screen.getByTestId('gallery-grid-image')).not.toHaveAttribute('data-sanity')
    })
  })
})
