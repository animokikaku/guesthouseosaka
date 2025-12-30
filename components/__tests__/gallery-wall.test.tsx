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

const createMockImagesWithNullAlt = (): GalleryImage[] => [
  {
    _key: 'image-1',
    src: 'https://example.com/image-1.jpg',
    alt: null,
    blurDataURL: null,
    width: 200,
    height: 150
  },
  {
    _key: 'image-2',
    src: 'https://example.com/image-2.jpg',
    alt: 'Image with alt',
    blurDataURL: null,
    width: 200,
    height: 150
  }
]

describe('GalleryWall', () => {
  describe('rendering', () => {
    it('renders all 6 images when provided', () => {
      const images = createMockImages(6)
      render(<GalleryWall images={images} />)

      // Images are inside aria-hidden containers, so we use hidden: true
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

    it('applies custom className to container', () => {
      const images = createMockImages(1)
      const { container } = render(<GalleryWall images={images} className="custom-class" />)

      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('custom-class')
      expect(wrapper).toHaveClass('w-full')
    })
  })

  describe('alt text', () => {
    it('renders correct alt text for each image', () => {
      const images = createMockImages(6)
      render(<GalleryWall images={images} />)

      images.forEach((image) => {
        expect(screen.getByAltText(image.alt!)).toBeInTheDocument()
      })
    })

    it('handles null alt text by rendering empty string', () => {
      const images = createMockImagesWithNullAlt()
      const { container } = render(<GalleryWall images={images} />)

      // Image with alt should be found by alt text
      expect(screen.getByAltText('Image with alt')).toBeInTheDocument()

      // Image with null alt should render with empty alt attribute
      // Using container query since images with empty alt are not returned by role query
      const imgElements = container.querySelectorAll('img')
      expect(imgElements).toHaveLength(2)

      // Verify one image has empty alt (null converted to empty string)
      const altValues = Array.from(imgElements).map((img) => img.getAttribute('alt'))
      expect(altValues).toContain('')
      expect(altValues).toContain('Image with alt')
    })
  })

  describe('layout and positioning', () => {
    it('renders images in presentation containers', () => {
      const images = createMockImages(6)
      render(<GalleryWall images={images} />)

      const presentationDivs = screen.getAllByRole('presentation', { hidden: true })
      expect(presentationDivs).toHaveLength(6)
    })

    it('applies positioning styles to image containers', () => {
      const images = createMockImages(1)
      render(<GalleryWall images={images} />)

      const container = screen.getByRole('presentation', { hidden: true })
      const style = container.getAttribute('style')

      // Check that percentage-based positioning is applied
      expect(style).toContain('width:')
      expect(style).toContain('height:')
      expect(style).toContain('left:')
      expect(style).toContain('top:')
    })

    it('applies correct positioning classes to containers', () => {
      const images = createMockImages(1)
      render(<GalleryWall images={images} />)

      const container = screen.getByRole('presentation', { hidden: true })
      expect(container).toHaveClass('absolute')
      expect(container).toHaveClass('overflow-hidden')
      expect(container).toHaveClass('rounded-[18%]')
    })

    it('calculates positioning based on image dimensions', () => {
      const customImage: GalleryImage[] = [
        {
          _key: 'custom-1',
          src: 'https://example.com/custom.jpg',
          alt: 'Custom image',
          blurDataURL: null,
          width: 150,
          height: 100
        }
      ]
      render(<GalleryWall images={customImage} />)

      const container = screen.getByRole('presentation', { hidden: true })
      const style = container.getAttribute('style')

      // Width percentage: (150 / 750) * 100 = 20%
      expect(style).toContain('width: 20%')
      // Height percentage: (100 / 452) * 100 ≈ 22.12%
      expect(style).toContain('height: 22.')
    })
  })

  describe('image attributes', () => {
    it('renders images with correct src attribute', () => {
      const images = createMockImages(1)
      render(<GalleryWall images={images} />)

      const img = screen.getByRole('img', { hidden: true })
      // Next.js Image component modifies the src, but we can check it's a valid img
      expect(img).toHaveAttribute('src')
    })

    it('renders images with object-cover styling', () => {
      const images = createMockImages(1)
      render(<GalleryWall images={images} />)

      const img = screen.getByRole('img', { hidden: true })
      expect(img).toHaveClass('object-cover')
    })

    it('renders images with transition classes for hover effect', () => {
      const images = createMockImages(1)
      render(<GalleryWall images={images} />)

      const img = screen.getByRole('img', { hidden: true })
      expect(img).toHaveClass('transition-transform')
      expect(img).toHaveClass('group-hover:scale-105')
    })
  })

  describe('overlay elements', () => {
    it('renders color overlay divs for each image', () => {
      const images = createMockImages(6)
      const { container } = render(<GalleryWall images={images} />)

      // Each image container should have overlay divs
      const overlayDivs = container.querySelectorAll('.bg-linear-to-br')
      expect(overlayDivs.length).toBe(6)
    })

    it('renders hover overlay divs for each image', () => {
      const images = createMockImages(6)
      const { container } = render(<GalleryWall images={images} />)

      // Each image has a hover overlay
      const hoverOverlays = container.querySelectorAll('.bg-linear-to-b')
      expect(hoverOverlays.length).toBe(6)
    })
  })

  describe('accessibility', () => {
    it('marks image containers as presentation and aria-hidden', () => {
      const images = createMockImages(6)
      render(<GalleryWall images={images} />)

      const containers = screen.getAllByRole('presentation', { hidden: true })
      containers.forEach((container) => {
        expect(container).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })
})
