import type { GalleryItem } from '@/lib/gallery'
import { render, screen } from '@testing-library/react'
import { Lightbox } from '@/components/lightbox'
import { GalleryGridItem } from '../gallery-grid-item'

vi.mock('next/image', () => import('@/components/__tests__/mocks/next-image'))

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

      const trigger = screen.getByTestId('gallery-grid-image')
      const image = screen.getByTestId('next-image')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toContainElement(image)
      expect(image).toHaveAttribute('alt', 'Test gallery image')
    })

    it('uses a full-aspect Sanity URL; the square crop is CSS only', () => {
      renderItem(createGalleryItem())

      const trigger = screen.getByTestId('gallery-grid-image')
      const image = screen.getByTestId('next-image')
      const src = image.getAttribute('src') ?? ''

      expect(trigger).toContainElement(image)
      expect(trigger).toHaveClass('aspect-square', 'overflow-hidden')
      expect(image).toHaveClass('object-cover')
      expect(src).toContain('fit=max')
      expect(src).not.toMatch(/[?&]w=/)
      expect(src).not.toMatch(/[?&]h=/)
      expect(src).not.toContain('fit=crop')
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

      const image = screen.getByTestId('next-image')
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

      const image = screen.getByTestId('next-image')
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

      const image = screen.getByTestId('next-image')
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
