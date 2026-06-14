/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import { GalleryImageButton, GalleryImageFrame } from '../gallery-image-button'

vi.mock('next/image', () => ({
  default: function MockImage({
    src,
    alt,
    className,
    sizes
  }: {
    src: string
    alt: string
    className?: string
    sizes?: string
  }) {
    return <img src={src} alt={alt} className={className} data-sizes={sizes} />
  }
}))

const imageProps = {
  src: 'https://cdn.sanity.io/images/test/gallery.jpg',
  alt: 'Gallery image',
  width: 400,
  height: 400
}

describe('GalleryImageFrame', () => {
  it('renders non-interactive gallery image content', () => {
    render(<GalleryImageFrame imageProps={imageProps} className="aspect-square" sizes="400px" />)

    expect(screen.getByRole('img', { name: 'Gallery image' })).toHaveAttribute(
      'data-sizes',
      '400px'
    )
    expect(screen.getByText('Gallery image')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveClass('object-cover')
  })
})

describe('GalleryImageButton', () => {
  it('renders gallery image content as a native button', () => {
    render(
      <GalleryImageButton type="button" imageProps={imageProps}>
        <span>Open image</span>
      </GalleryImageButton>
    )

    const button = screen.getByRole('button', { name: /gallery image open image/i })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('appearance-none')
    expect(screen.getByText('Open image')).toBeInTheDocument()
  })

  it('omits the visual caption for decorative images', () => {
    render(<GalleryImageButton type="button" imageProps={{ ...imageProps, alt: '' }} />)

    expect(screen.queryByText('Gallery image')).not.toBeInTheDocument()
  })
})
