import { message } from '@/lib/__tests__/utils/messages'
import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'
import { render, screen } from '@testing-library/react'
import { ImageBlockGallery } from '../image-block-gallery'

vi.mock('next/image', () => import('@/components/__tests__/mocks/next-image'))

vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode
    href: { params: { house: string } }
  }) => (
    <a href={`/${href.params.house}/gallery`} {...props}>
      {children}
    </a>
  )
}))

const href = { pathname: '/[house]/gallery', params: { house: 'orange' } } as const

function photos(count: number) {
  return Array.from({ length: count }, (_, index) =>
    createGalleryItem({
      _key: `photo-${index}`,
      image: createSanityImage({ alt: `Photo ${index + 1}` })
    })
  )
}

async function renderGallery(props: Partial<Parameters<typeof ImageBlockGallery>[0]> = {}) {
  const galleryPreview = props.galleryPreview ?? photos(5)
  return render(
    await ImageBlockGallery({
      href,
      galleryPreview,
      galleryImageCount: galleryPreview.length,
      ...props
    })
  )
}

const tiles = () => screen.getAllByRole('img').map((image) => image.getAttribute('alt'))

describe('ImageBlockGallery', () => {
  it('shows five photos behind a single gallery link', async () => {
    await renderGallery()

    expect(tiles()).toEqual(['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5'])
    expect(
      screen.getByRole('link', { name: message('ImageBlockGallery.view_gallery') })
    ).toBeInTheDocument()
  })

  // Desktop LCP candidate: loaded eagerly at high priority, the rest lazily.
  it('prioritizes the large leading photo', async () => {
    await renderGallery()

    const [first, second] = screen.getAllByRole('img')
    expect(first).toHaveAttribute('fetchpriority', 'high')
    expect(first).toHaveAttribute('loading', 'eager')
    expect(second).not.toHaveAttribute('fetchpriority')
  })

  it('leads with the featured image', async () => {
    await renderGallery({ featuredImage: createSanityImage({ alt: 'Featured' }) })

    expect(tiles()).toEqual(['Featured', 'Photo 1', 'Photo 2', 'Photo 3', 'Photo 4'])
  })

  // The badge is decorative, so the link label carries the total.
  it('counts the photos beyond the grid on the last tile and in the link', async () => {
    await renderGallery({
      galleryImageCount: 59,
      featuredImage: createSanityImage({ alt: 'Featured' })
    })

    expect(
      screen.getByText(message('ImageBlockGallery.overflow_count', { count: 55 }))
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: message('ImageBlockGallery.view_gallery_count', { count: 60 })
      })
    ).toBeInTheDocument()
  })

  it('fills the grid past photos that have no file yet', async () => {
    const draft = createGalleryItem({ image: createSanityImage({ asset: null }) })

    await renderGallery({ galleryPreview: [draft, ...photos(6)], galleryImageCount: 6 })

    expect(tiles()).toEqual(['Photo 1', 'Photo 2', 'Photo 3', 'Photo 4', 'Photo 5'])
    expect(
      screen.getByText(message('ImageBlockGallery.overflow_count', { count: 1 }))
    ).toBeInTheDocument()
  })

  it('shows the empty state when fewer than five photos can be shown', async () => {
    await renderGallery({ galleryPreview: photos(4) })

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(message('GalleryEmptyState.title'))).toBeInTheDocument()
  })
})
