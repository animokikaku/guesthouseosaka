import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GalleryWall } from '../gallery-wall'
import type { GalleryImage } from '@/lib/types/components'

const createMockImages = (count: number): GalleryImage[] =>
  Array.from({ length: count }, (_, index) => ({
    _key: `image-${index + 1}`,
    src: `https://example.com/image-${index + 1}.jpg`,
    alt: `Gallery image ${index + 1}`,
    blurDataURL: `data:image/jpeg;base64,blur${index + 1}`,
    width: 200,
    height: 150
  }))

describe('GalleryWall', () => {
  it('renders all 6 images when provided', () => {
    const images = createMockImages(6)
    render(<GalleryWall images={images} />)

    const imgElements = screen.getAllByRole('img', { hidden: true })
    expect(imgElements).toHaveLength(6)
  })

  it('renders fewer images when provided less than 6', () => {
    const images = createMockImages(3)
    render(<GalleryWall images={images} />)

    const imgElements = screen.getAllByRole('img', { hidden: true })
    expect(imgElements).toHaveLength(3)
  })

  it('renders no images when array is empty', () => {
    render(<GalleryWall images={[]} />)

    const imgElements = screen.queryAllByRole('img', { hidden: true })
    expect(imgElements).toHaveLength(0)
  })

  it('renders correct alt text for each image', () => {
    const images = createMockImages(6)
    render(<GalleryWall images={images} />)

    images.forEach((image) => {
      expect(screen.getByAltText(image.alt!)).toBeInTheDocument()
    })
  })

  it('applies custom className to container', () => {
    const images = createMockImages(1)
    const { container } = render(<GalleryWall images={images} className="custom-class" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-class')
  })
})
