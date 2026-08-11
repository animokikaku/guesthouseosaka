import { Lightbox } from '@/components/lightbox'
import { HouseGallery } from '@/components/gallery/house-gallery'
import type { GalleryCategory } from '@/lib/gallery'
import {
  createGalleryCategory,
  createGalleryItem,
  createSanityImage
} from '@/lib/transforms/__tests__/mocks'
import { toGalleryCategories } from '@/lib/transforms/gallery'
import { render, screen } from '@testing-library/react'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }): React.ReactElement => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="gallery-image" />
  )
}))

vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string) => value
}))

function indexByKeyFor(categories: GalleryCategory[]) {
  return new Map(
    categories.flatMap((category) => category.items).map((item, index) => [item._key, index])
  )
}

function renderGallery(categories: GalleryCategory[]) {
  return render(
    <Lightbox.Root>
      <HouseGallery categories={categories} indexByKey={indexByKeyFor(categories)} />
    </Lightbox.Root>
  )
}

describe('HouseGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty gallery', () => {
    it('renders nothing for empty galleryCategories', () => {
      const { container } = renderGallery([])

      expect(container).toBeEmptyDOMElement()
    })

    it('renders nothing for null galleryCategories', () => {
      const { container } = renderGallery([])

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe('category rendering', () => {
    it('renders category headings', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', label: 'Bedroom', orderRank: '0|a:' },
          items: [
            createGalleryItem({
              _key: 'img1',
              image: createSanityImage({ alt: 'Image 1' })
            }),
            createGalleryItem({
              _key: 'img2',
              image: createSanityImage({ alt: 'Image 2' })
            })
          ]
        })
      ]

      renderGallery(toGalleryCategories(galleryCategories))

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Bedroom')
    })

    it('renders multiple categories', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', label: 'Bedroom', orderRank: '0|a00000:' },
          items: [createGalleryItem({ _key: 'img1' })]
        }),
        createGalleryCategory({
          _key: 'cat2',
          category: { _id: 'id2', label: 'Kitchen', orderRank: '0|b00000:' },
          items: [createGalleryItem({ _key: 'img2' })]
        })
      ]

      renderGallery(toGalleryCategories(galleryCategories))

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings).toHaveLength(2)
    })

    it('preserves category order from GROQ query', () => {
      // Categories come pre-sorted by orderRank from GROQ
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', label: 'Bedroom', orderRank: '0|a00000:' },
          items: [createGalleryItem({ _key: 'img1' })]
        }),
        createGalleryCategory({
          _key: 'cat2',
          category: { _id: 'id2', label: 'Kitchen', orderRank: '0|b00000:' },
          items: [createGalleryItem({ _key: 'img2' })]
        })
      ]

      renderGallery(toGalleryCategories(galleryCategories))

      const headings = screen.getAllByRole('heading', { level: 3 })
      expect(headings[0]).toHaveTextContent('Bedroom')
      expect(headings[1]).toHaveTextContent('Kitchen')
    })
  })

  describe('gallery grid', () => {
    it('renders a trigger for each gallery item', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', label: 'Room', orderRank: '0|a:' },
          items: [
            createGalleryItem({
              _key: 'img1',
              image: createSanityImage({ alt: 'Image 1' })
            }),
            createGalleryItem({
              _key: 'img2',
              image: createSanityImage({ alt: 'Image 2' })
            }),
            createGalleryItem({
              _key: 'img3',
              image: createSanityImage({ alt: 'Image 3' })
            })
          ]
        })
      ]

      renderGallery(toGalleryCategories(galleryCategories))

      const triggers = screen.getAllByTestId('gallery-grid-image')
      expect(triggers).toHaveLength(3)
    })
  })

  describe('category thumbnails', () => {
    it('renders only grid item buttons (no thumbnail row)', () => {
      const galleryCategories = [
        createGalleryCategory({
          _key: 'cat1',
          category: { _id: 'id1', label: 'Room', orderRank: '0|a:' },
          items: [createGalleryItem({ _key: 'img1' })]
        })
      ]

      renderGallery(toGalleryCategories(galleryCategories))

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(1)
    })
  })
})
