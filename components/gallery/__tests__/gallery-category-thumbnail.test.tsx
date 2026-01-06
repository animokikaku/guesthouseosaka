/* eslint-disable @next/next/no-img-element */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryThumbnail } from '../gallery-category-thumbnail'
import type { GalleryCategory } from '@/lib/gallery'

// Mock Sanity image utilities
vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        dpr: () => ({
          fit: () => ({
            url: () => 'https://cdn.sanity.io/images/test/thumbnail.jpg'
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
    fill,
    placeholder,
    blurDataURL,
    className,
    sizes
  }: {
    src: string
    alt: string
    fill?: boolean
    placeholder?: string
    blurDataURL?: string
    className?: string
    sizes?: string
  }) {
    return (
      <img
        src={src}
        alt={alt}
        data-fill={fill}
        data-placeholder={placeholder}
        data-blur-url={blurDataURL}
        data-sizes={sizes}
        className={className}
        data-testid="thumbnail-image"
      />
    )
  }
}))

function createCategory(
  overrides: Partial<GalleryCategory> = {}
): GalleryCategory {
  return {
    _key: 'cat1',
    _id: 'category-1',
    label: 'Living Room',
    thumbnail: {
      asset: { _ref: 'image-test-123', _type: 'reference' },
      hotspot: null,
      crop: null,
      alt: 'Living room thumbnail',
      preview: 'data:image/jpeg;base64,abc123'
    },
    items: [
      {
        _key: 'item1',
        image: {
          asset: { _ref: 'image-1', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: 'Image 1',
          preview: null
        }
      }
    ],
    ...overrides
  }
}

describe('CategoryThumbnail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty states', () => {
    it('returns null when items array is empty', () => {
      const category = createCategory({ items: [] })

      const { container } = render(<CategoryThumbnail category={category} />)

      expect(container.firstChild).toBeNull()
    })

    it('returns null when thumbnail is null', () => {
      const category = createCategory({ thumbnail: null })

      const { container } = render(<CategoryThumbnail category={category} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('rendering', () => {
    it('renders thumbnail image', () => {
      const category = createCategory()

      render(<CategoryThumbnail category={category} />)

      const image = screen.getByTestId('thumbnail-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'Living room thumbnail')
    })

    it('renders category label', () => {
      const category = createCategory({ label: 'Kitchen' })

      render(<CategoryThumbnail category={category} />)

      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    it('renders item count badge', () => {
      const category = createCategory({
        items: [
          {
            _key: 'item1',
            image: {
              asset: { _ref: 'image-1', _type: 'reference' },
              hotspot: null,
              crop: null,
              alt: 'Image 1',
              preview: null
            }
          },
          {
            _key: 'item2',
            image: {
              asset: { _ref: 'image-2', _type: 'reference' },
              hotspot: null,
              crop: null,
              alt: 'Image 2',
              preview: null
            }
          },
          {
            _key: 'item3',
            image: {
              asset: { _ref: 'image-3', _type: 'reference' },
              hotspot: null,
              crop: null,
              alt: 'Image 3',
              preview: null
            }
          }
        ]
      })

      render(<CategoryThumbnail category={category} />)

      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('uses blur placeholder when preview is available', () => {
      const category = createCategory({
        thumbnail: {
          asset: { _ref: 'image-test', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: 'Test',
          preview: 'data:image/jpeg;base64,preview123'
        }
      })

      render(<CategoryThumbnail category={category} />)

      const image = screen.getByTestId('thumbnail-image')
      expect(image).toHaveAttribute('data-placeholder', 'blur')
      expect(image).toHaveAttribute(
        'data-blur-url',
        'data:image/jpeg;base64,preview123'
      )
    })

    it('does not use blur placeholder when preview is null', () => {
      const category = createCategory({
        thumbnail: {
          asset: { _ref: 'image-test', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: 'Test',
          preview: null
        }
      })

      render(<CategoryThumbnail category={category} />)

      const image = screen.getByTestId('thumbnail-image')
      expect(image.getAttribute('data-placeholder')).toBeNull()
    })
  })

  describe('click handler', () => {
    it('scrolls to category element on click', () => {
      const category = createCategory()

      // Create a mock element that getElementById will return
      const mockElement = {
        scrollIntoView: vi.fn()
      }
      vi.spyOn(document, 'getElementById').mockReturnValue(
        mockElement as unknown as HTMLElement
      )

      render(<CategoryThumbnail category={category} />)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(document.getElementById).toHaveBeenCalledWith('category-1')
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth'
      })
    })

    it('does nothing if target element is not found', () => {
      const category = createCategory()

      vi.spyOn(document, 'getElementById').mockReturnValue(null)

      render(<CategoryThumbnail category={category} />)

      const button = screen.getByRole('button')
      // Should not throw when element is not found
      expect(() => fireEvent.click(button)).not.toThrow()
    })
  })

  describe('accessibility', () => {
    it('renders as a button', () => {
      const category = createCategory()

      render(<CategoryThumbnail category={category} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
