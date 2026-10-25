import { galleryLink } from '@/components/house/gallery-link'
import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { render, screen } from '@testing-library/react'
import { ImageBlockGallery } from '../image-block-gallery'

vi.mock('@/components/image', () => import('@/components/__tests__/mocks/image'))

const href = galleryLink('en', 'orange')

function photos(count: number) {
  return Array.from({ length: count }, (_, index) =>
    createGalleryItem({
      _key: `photo-${index}`,
      image: createSanityImage({ alt: `Photo ${index + 1}` })
    })
  )
}

function renderGallery(props: Partial<Parameters<typeof ImageBlockGallery>[0]> = {}) {
  const galleryPreview = props.galleryPreview ?? photos(5)
  return render(
    <ImageBlockGallery
      href={href}
      galleryPreview={galleryPreview}
      galleryImageCount={galleryPreview.length}
      {...props}
    />
  )
}

const tiles = () => screen.getAllByRole('img').map((image) => image.getAttribute('alt'))

describe('ImageBlockGallery', () => {
  it('shows five photos behind a single gallery link', async () => {
    renderGallery()

    expect(tiles()).toEqual(['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5'])
    expect(screen.getByRole('link')).toHaveAttribute('href', '/en/orange/gallery')
  })

  // Desktop LCP candidate: loaded eagerly at high priority, the rest lazily.
  it('prioritizes the large leading photo', async () => {
    renderGallery()

    const [first, second] = screen.getAllByRole('img')
    expect(first).toHaveAttribute('fetchpriority', 'high')
    expect(first).toHaveAttribute('loading', 'eager')
    expect(second).not.toHaveAttribute('fetchpriority')
  })

  it('leads with the featured image', async () => {
    renderGallery({ featuredImage: createSanityImage({ alt: 'Featured' }) })

    expect(tiles()).toEqual(['Featured', 'Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'])
  })

  // The badge is decorative, so the link label carries the total.
  it('counts the photos beyond the grid on the last tile and in the link', async () => {
    renderGallery({
      galleryImageCount: 59,
      featuredImage: createSanityImage({ alt: 'Featured' })
    })

    expect(screen.getByText('+55')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAccessibleName(/\b60\b/)
  })

  it('fills the grid past photos that have no file yet', async () => {
    const draft = createGalleryItem({ image: createSanityImage({ asset: null }) })

    renderGallery({ galleryPreview: [draft, ...photos(6)], galleryImageCount: 6 })

    expect(tiles()).toEqual(['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5'])
    expect(screen.getByText('+1')).toBeInTheDocument()
  })

  it('shows the empty state when fewer than five photos can be shown', async () => {
    renderGallery({ galleryPreview: photos(4) })

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/\bno gallery images\b/i)).toBeInTheDocument()
  })
})
