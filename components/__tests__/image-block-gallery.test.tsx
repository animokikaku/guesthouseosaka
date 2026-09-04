import { render, screen } from '@testing-library/react'
import { ImageBlockGallery } from '../image-block-gallery'
import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'

vi.mock('next-intl/server', () => ({
  getTranslations: () => (key: string, values?: Record<string, number>) => {
    if (key === 'overflow_count') return `+${values?.count}`
    if (key === 'view_gallery_count') return `Show all ${values?.count} photos`

    const messages: Record<string, string> = {
      view_gallery: 'View gallery',
      empty_title: 'No gallery images',
      empty_description: 'Gallery images are managed through Sanity CMS.'
    }
    return messages[key] ?? key
  }
}))

vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => {
    const builder = {
      width: () => builder,
      height: () => builder,
      dpr: () => builder,
      fit: () => builder,
      url: () => 'https://cdn.sanity.io/images/test/gallery.jpg'
    }
    return builder
  }
}))

vi.mock('@/components/gallery/gallery-image-button', () => ({
  GalleryImageFrame: ({
    imageProps,
    sizes,
    className,
    children
  }: {
    imageProps: { alt: string; priority?: boolean }
    sizes?: string
    className?: string
    children?: React.ReactNode
  }) => (
    <div
      data-testid="gallery-frame"
      data-alt={imageProps.alt}
      data-priority={imageProps.priority ? 'true' : 'false'}
      data-sizes={sizes}
      className={className}
    >
      {children}
    </div>
  )
}))

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children?: React.ReactNode; href: unknown }) => (
    <a href={typeof href === 'string' ? href : '/gallery'} {...props}>
      {children}
    </a>
  )
}))

vi.mock('@/components/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyMedia: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>
}))

vi.mock('lucide-react', () => ({
  ImageIcon: () => <svg data-testid="image-icon" />
}))

const galleryHref = {
  pathname: '/[house]/gallery',
  params: { house: 'orange' }
} as const

describe('ImageBlockGallery', () => {
  it('renders five gallery images with the first image prioritized', async () => {
    const galleryImages = Array.from({ length: 5 }, (_, index) =>
      createGalleryItem({
        _key: `image-${index}`,
        image: createSanityImage({ alt: `Gallery image ${index + 1}` })
      })
    )

    render(
      await ImageBlockGallery({
        href: galleryHref,
        galleryImages
      })
    )

    const frames = screen.getAllByTestId('gallery-frame')
    expect(frames).toHaveLength(5)
    expect(frames[0]).toHaveAttribute('data-alt', 'Gallery image 1')
    expect(frames[0]).toHaveAttribute('data-priority', 'true')
    expect(frames[1]).toHaveAttribute('data-priority', 'false')
    expect(screen.getByRole('link', { name: 'View gallery' })).toBeInTheDocument()
  })

  it('prepends the featured image and limits the grid to five images', async () => {
    const galleryImages = Array.from({ length: 5 }, (_, index) =>
      createGalleryItem({
        _key: `image-${index}`,
        image: createSanityImage({ alt: `Gallery image ${index + 1}` })
      })
    )

    render(
      await ImageBlockGallery({
        href: galleryHref,
        galleryImages,
        featuredImage: createSanityImage({ alt: 'Featured image' })
      })
    )

    const frames = screen.getAllByTestId('gallery-frame')
    expect(frames).toHaveLength(5)
    expect(frames[0]).toHaveAttribute('data-alt', 'Featured image')
    expect(frames[4]).toHaveAttribute('data-alt', 'Gallery image 4')
  })

  it('skips slides without an image asset when filling the grid and the overflow count', async () => {
    const galleryImages = [
      createGalleryItem({ _key: 'missing-asset', image: createSanityImage({ asset: null }) }),
      ...Array.from({ length: 6 }, (_, index) =>
        createGalleryItem({
          _key: `image-${index}`,
          image: createSanityImage({ alt: `Gallery image ${index + 1}` })
        })
      )
    ]

    render(
      await ImageBlockGallery({
        href: galleryHref,
        galleryImages
      })
    )

    const frames = screen.getAllByTestId('gallery-frame')
    expect(frames).toHaveLength(5)
    expect(frames[0]).toHaveAttribute('data-alt', 'Gallery image 1')
    expect(screen.getByText('+1')).toBeInTheDocument()
    // The overflow badge is aria-hidden, so the link label carries the total
    expect(screen.getByRole('link', { name: 'Show all 6 photos' })).toBeInTheDocument()
  })

  it('renders the empty state when fewer than five images can be rendered', async () => {
    const galleryImages = [
      ...Array.from({ length: 4 }, (_, index) =>
        createGalleryItem({
          _key: `image-${index}`,
          image: createSanityImage({ alt: `Gallery image ${index + 1}` })
        })
      ),
      createGalleryItem({
        _key: 'missing-asset',
        image: createSanityImage({ asset: null })
      })
    ]

    render(
      await ImageBlockGallery({
        href: galleryHref,
        galleryImages
      })
    )

    expect(screen.queryAllByTestId('gallery-frame')).toHaveLength(0)
    expect(screen.getByText('No gallery images')).toBeInTheDocument()
    expect(screen.getByText('Gallery images are managed through Sanity CMS.')).toBeInTheDocument()
  })
})
