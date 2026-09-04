import { render, screen } from '@testing-library/react'
import { GalleryImageFrame } from '../gallery-image-button'

vi.mock('next/image', () => import('@/components/__tests__/mocks/next-image'))

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
