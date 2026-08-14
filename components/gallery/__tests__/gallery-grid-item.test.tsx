/* eslint-disable @next/next/no-img-element */
import type { GalleryItem } from '@/lib/gallery'
import { render, screen } from '@testing-library/react'
import { Lightbox } from '@/components/lightbox'
import { GalleryGridItem } from '../gallery-grid-item'

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

function renderItem(item: GalleryItem, props: Partial<Parameters<typeof GalleryGridItem>[0]> = {}) {
  return render(
    <Lightbox.Root>
      <GalleryGridItem item={item} categoryKey="cat1" index={0} {...props} />
    </Lightbox.Root>
  )
}

describe('GalleryGridItem', () => {
  describe('empty states', () => {
    it('returns null when image is null', () => {
      const item = {
        ...createGalleryItem(),
        image: null
      } as unknown as GalleryItem

      const { container } = renderItem(item)

      expect(container.firstChild).toBeNull()
    })

    it('returns null when index is undefined', () => {
      const { container } = renderItem(createGalleryItem(), { index: undefined })

      expect(container.firstChild).toBeNull()
    })
  })

  describe('rendering', () => {
    it('renders gallery image', () => {
      const item = createGalleryItem()

      renderItem(item)

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

      renderItem(item)

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

      renderItem(item)

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

      renderItem(item)

      const image = screen.getByTestId('gallery-image')
      expect(image.getAttribute('data-placeholder')).toBeNull()
    })
  })

  describe('data attributes', () => {
    it('sets data-sanity attribute when dataAttribute function is provided', () => {
      const item = createGalleryItem({ _key: 'item-123' })
      const dataAttribute = vi.fn((path: string) => `encoded-path:${path}`)

      renderItem(item, { dataAttribute })

      expect(dataAttribute).toHaveBeenCalledWith(
        'galleryCategories[_key=="cat1"].items[_key=="item-123"]'
      )

      expect(screen.getByTestId('gallery-grid-image')).toHaveAttribute(
        'data-sanity',
        'encoded-path:galleryCategories[_key=="cat1"].items[_key=="item-123"]'
      )
    })

    it('does not set data-sanity attribute when dataAttribute is undefined', () => {
      renderItem(createGalleryItem())
      expect(screen.getByTestId('gallery-grid-image')).not.toHaveAttribute('data-sanity')
    })
  })
})
