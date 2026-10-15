import { HouseGallery } from '@/components/gallery/house-gallery'
import { Lightbox } from '@/components/lightbox'
import type { GalleryCategory } from '@/lib/gallery'
import {
  createGalleryCategory,
  createGalleryItem,
  createSanityImage
} from '@/lib/transforms/__tests__/mocks'
import { toGalleryCategories } from '@/lib/transforms/gallery'
import { render, screen, within } from '@testing-library/react'

vi.mock('next/image', () => import('@/components/__tests__/mocks/next-image'))

function renderGallery(categories: GalleryCategory[], dataAttribute?: (path: string) => string) {
  // Same lookup GalleryPageContent builds for the lightbox.
  const indexByKey = new Map(
    categories.flatMap((category) => category.items).map((item, index) => [item._key, index])
  )

  return render(
    <Lightbox.Root>
      <HouseGallery categories={categories} indexByKey={indexByKey} dataAttribute={dataAttribute} />
    </Lightbox.Root>
  )
}

const photo = (key: string, alt: string | null, preview: string | null = null) =>
  createGalleryItem({ _key: key, image: createSanityImage({ alt, preview }) })

const bedroom = createGalleryCategory({
  _key: 'bedroom',
  category: { _id: 'cat-bedroom', label: 'Bedroom', orderRank: '0|a:' },
  items: [photo('bed', 'Bed'), photo('desk', 'Desk')]
})

const kitchen = createGalleryCategory({
  _key: 'kitchen',
  category: { _id: 'cat-kitchen', label: 'Kitchen', orderRank: '0|b:' },
  items: [photo('stove', 'Stove')]
})

describe('HouseGallery', () => {
  it('shows each category in order with a photo count', () => {
    renderGallery(toGalleryCategories([bedroom, kitchen]))

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((heading) => heading.firstChild?.textContent)).toEqual([
      'Bedroom',
      'Kitchen'
    ])
    // The visible number is decorative; screen readers hear the localized plural.
    expect(within(headings[0]).getByText('2')).toHaveAttribute('aria-hidden', 'true')
    expect(within(headings[0]).getByText('2 photos')).toHaveClass('sr-only')
    expect(within(headings[1]).getByText('1 photo')).toHaveClass('sr-only')
  })

  it('anchors each category for the sticky nav to jump to', () => {
    const { container } = renderGallery(toGalleryCategories([bedroom, kitchen]))

    expect(container.querySelector('section#cat-kitchen')).toHaveTextContent('Kitchen')
  })

  it('opens each photo from a button named after it', () => {
    renderGallery(toGalleryCategories([bedroom]))

    expect(screen.getByRole('button', { name: 'Bed' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Desk' })).toBeInTheDocument()
  })

  it('names a photo without alt text generically', () => {
    renderGallery(toGalleryCategories([createGalleryCategory({ items: [photo('x', null)] })]))

    expect(screen.getByRole('button', { name: /\bopen\b/i })).toBeInTheDocument()
  })

  // Tiles are square through CSS only: the lightbox morphs from this very image,
  // so it has to be the full photo, not a cropped file.
  it('loads the uncropped photo into each tile', () => {
    renderGallery(toGalleryCategories([bedroom]))

    const { searchParams } = new URL(screen.getByAltText('Bed').getAttribute('src')!)
    expect(searchParams.get('fit')).toBe('max')
    expect(searchParams.has('h')).toBe(false)
  })

  it('blurs a tile in only when the photo has a preview', () => {
    renderGallery(
      toGalleryCategories([
        createGalleryCategory({
          items: [photo('a', 'With', 'data:image/jpeg;base64,abc'), photo('b', 'Without')]
        })
      ])
    )

    expect(screen.getByAltText('With')).toHaveAttribute('data-placeholder', 'blur')
    expect(screen.getByAltText('Without')).not.toHaveAttribute('data-placeholder')
  })

  it('skips items whose image is not uploaded yet', () => {
    const draft = createGalleryItem({ _key: 'draft', image: createSanityImage({ asset: null }) })

    renderGallery(
      toGalleryCategories([createGalleryCategory({ items: [draft, photo('bed', 'Bed')] })])
    )

    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('tags categories and photos for visual editing', () => {
    renderGallery(toGalleryCategories([bedroom]), (path) => `edit:${path}`)

    expect(screen.getByRole('button', { name: 'Bed' })).toHaveAttribute(
      'data-sanity',
      'edit:galleryCategories[_key=="bedroom"].items[_key=="bed"]'
    )
  })

  it('renders nothing for an empty gallery', () => {
    const { container } = renderGallery([])

    expect(container).toBeEmptyDOMElement()
  })
})
