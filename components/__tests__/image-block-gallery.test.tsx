/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import { ImageBlockGallery } from '../image-block-gallery'
import { createGalleryItem, createSanityImage } from '@/lib/transforms/__tests__/mocks'

vi.mock('next-intl/server', () => ({
  getTranslations: () => (key: string) => {
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

vi.mock('@sanity/client/stega', () => ({
  stegaClean: (value: string | null | undefined) => value ?? ''
}))

vi.mock('@/components/gallery/gallery-image-button', () => ({
  GalleryImageFrame: ({
    imageProps,
    sizes,
    className
  }: {
    imageProps: { alt: string; priority?: boolean }
    sizes?: string
    className?: string
  }) => (
    <div
      data-testid="gallery-frame"
      data-alt={imageProps.alt}
      data-priority={imageProps.priority ? 'true' : 'false'}
      data-sizes={sizes}
      className={className}
    />
  )
}))

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children?: React.ReactNode; href: unknown }) => (
    <a href={typeof href === 'string' ? href : '/gallery'} {...props}>
      {children}
    </a>
  )
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button className={className}>{children}</button>
  )
}))

vi.mock('@/components/ui/empty', () => ({
  Empty: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  EmptyHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyMedia: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  EmptyTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>
}))

vi.mock('@/components/icons', () => ({
  Icons: {
    gallery: () => <svg data-testid="gallery-icon" />
  }
}))

vi.mock('lucide-react', () => ({
  ImageIcon: () => <svg data-testid="image-icon" />
}))

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
        href: '/en/orange/gallery',
        galleryImages
      })
    )

    const frames = screen.getAllByTestId('gallery-frame')
    expect(frames).toHaveLength(5)
    expect(frames[0]).toHaveAttribute('data-alt', 'Gallery image 1')
    expect(frames[0]).toHaveAttribute('data-priority', 'true')
    expect(frames[1]).toHaveAttribute('data-priority', 'false')
    expect(screen.getByText('View gallery')).toBeInTheDocument()
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
        href: '/en/orange/gallery',
        galleryImages,
        featuredImage: createSanityImage({ alt: 'Featured image' })
      })
    )

    const frames = screen.getAllByTestId('gallery-frame')
    expect(frames).toHaveLength(5)
    expect(frames[0]).toHaveAttribute('data-alt', 'Featured image')
    expect(frames[4]).toHaveAttribute('data-alt', 'Gallery image 4')
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
        href: '/en/orange/gallery',
        galleryImages
      })
    )

    expect(screen.queryAllByTestId('gallery-frame')).toHaveLength(0)
    expect(screen.getByText('No gallery images')).toBeInTheDocument()
    expect(screen.getByText('Gallery images are managed through Sanity CMS.')).toBeInTheDocument()
  })
})
