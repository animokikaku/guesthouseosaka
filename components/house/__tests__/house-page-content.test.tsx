import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HousePageContent } from '../house-page-content'
import type { HouseQueryResult, HousesNavQueryResult } from '@/sanity.types'
import {
  createBuilding,
  createLocation,
  createMap,
  createAmenityCategory,
  createAmenityItem,
  createPricingRow,
  createGalleryItem,
  createSanityImage
} from '@/lib/transforms/__tests__/mocks'

// Mock all child components to focus on integration logic
vi.mock('@/components/house/house-about', () => ({
  HouseAbout: ({ title, slug }: { title: string; slug: string }) => (
    <div data-testid="house-about" data-title={title} data-slug={slug}>
      HouseAbout
    </div>
  )
}))

vi.mock('@/components/house/house-amenities', () => ({
  HouseAmenities: ({ amenityCategories }: { amenityCategories: unknown[] }) => (
    <div data-testid="house-amenities" data-count={amenityCategories?.length ?? 0}>
      HouseAmenities
    </div>
  )
}))

vi.mock('@/components/house/house-location', () => ({
  HouseLocation: () => <div data-testid="house-location">HouseLocation</div>
}))

vi.mock('@/components/house/house-pricing', () => ({
  HousePricing: ({ pricing }: { pricing: unknown[] }) => (
    <div data-testid="house-pricing" data-count={pricing?.length ?? 0}>
      HousePricing
    </div>
  )
}))

vi.mock('@/components/house/mobile-hero-image', () => ({
  MobileHeroImage: ({ images }: { images: unknown[] }) => (
    <div data-testid="mobile-hero" data-count={images?.length ?? 0}>
      MobileHeroImage
    </div>
  )
}))

vi.mock('@/components/houses-nav', () => ({
  HousesNav: ({ houses }: { houses: unknown[] }) => (
    <div data-testid="houses-nav" data-count={houses.length}>
      HousesNav
    </div>
  )
}))

vi.mock('@/components/image-block-gallery', () => ({
  ImageBlockGallery: () => <div data-testid="image-block-gallery">ImageBlockGallery</div>
}))

vi.mock('@/components/page-header', () => ({
  PageHeader: ({ children }: { children: React.ReactNode }) => (
    <header data-testid="page-header">{children}</header>
  ),
  PageHeaderHeading: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="page-heading">{children}</h1>
  ),
  PageHeaderDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="page-description">{children}</p>
  )
}))

vi.mock('@/components/page-nav', () => ({
  PageNav: ({ children }: { children: React.ReactNode }) => (
    <nav data-testid="page-nav">{children}</nav>
  )
}))

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: unknown }) => (
    <a data-testid="nav-link" data-href={JSON.stringify(href)}>
      {children}
    </a>
  )
}))

type HouseSlug = 'orange' | 'apple' | 'lemon'
type Props = NonNullable<HouseQueryResult> & { houses: HousesNavQueryResult }

// Create mock image with expanded asset structure expected by HouseQueryResult
const createMockImage = (alt: string) => ({
  asset: {
    _id: 'image-123',
    _ref: 'image-123',
    _type: 'reference' as const,
    url: 'https://cdn.sanity.io/test.jpg',
    dimensions: { width: 1920, height: 1080, aspectRatio: 16 / 9 },
    lqip: 'data:image/jpeg;base64,test'
  },
  hotspot: null,
  crop: null,
  alt,
  lqip: 'data:image/jpeg;base64,test'
})

const createBaseProps = (slugOverride?: HouseSlug): Props => {
  // Cast to satisfy complex generated Sanity types while testing behavior
  return {
    _id: 'house-123',
    _type: 'house',
    _createdAt: '2024-01-01',
    _updatedAt: '2024-01-01',
    _rev: 'rev-123',
    slug: slugOverride ?? 'orange',
    title: 'Orange House',
    description: 'A beautiful orange house',
    caption: 'Welcome to Orange House',
    phone: { domestic: '06-1234-5678', international: '+81-6-1234-5678' },
    image: createMockImage('House image'),
    gallery: [createGalleryItem({ _key: 'g1' }), createGalleryItem({ _key: 'g2' })],
    featuredImage: createSanityImage({ alt: 'Featured image' }),
    amenityCategories: [
      createAmenityCategory({
        _key: 'cat1',
        items: [createAmenityItem({ _key: 'a1' }), createAmenityItem({ _key: 'a2' })]
      })
    ],
    location: createLocation(),
    map: createMap(),
    pricing: [createPricingRow({ _key: 'p1' })],
    about: [{ _type: 'block', _key: 'b1', children: [], style: 'normal', markDefs: [] }],
    building: createBuilding(),
    houses: [
      { slug: 'orange', title: 'Orange House', description: null, caption: null, image: createMockImage('Orange') },
      { slug: 'apple', title: 'Apple House', description: null, caption: null, image: createMockImage('Apple') }
    ]
  } as unknown as Props
}

describe('HousePageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('page structure', () => {
    it('renders page header with title', () => {
      render(<HousePageContent {...createBaseProps()} />)

      expect(screen.getByTestId('page-heading')).toHaveTextContent('Orange House')
    })

    it('renders page header with description', () => {
      render(<HousePageContent {...createBaseProps()} />)

      expect(screen.getByTestId('page-description')).toHaveTextContent('A beautiful orange house')
    })

    it('renders article with correct id', () => {
      const { container } = render(<HousePageContent {...createBaseProps()} />)

      const article = container.querySelector('article#orange')
      expect(article).toBeInTheDocument()
    })

    it('renders article with aria-labelledby', () => {
      const { container } = render(<HousePageContent {...createBaseProps()} />)

      const article = container.querySelector('article[aria-labelledby="orange-title"]')
      expect(article).toBeInTheDocument()
    })
  })

  describe('theme colors', () => {
    it('applies orange theme color for orange house', () => {
      const { container } = render(<HousePageContent {...createBaseProps()} />)

      const colorBar = container.querySelector('[aria-hidden="true"]')
      expect(colorBar).toHaveClass('bg-orange-500')
    })

    it('applies red theme color for apple house', () => {
      const { container } = render(<HousePageContent {...createBaseProps('apple')} />)

      const colorBar = container.querySelector('[aria-hidden="true"]')
      expect(colorBar).toHaveClass('bg-red-600')
    })

    it('applies yellow theme color for lemon house', () => {
      const { container } = render(<HousePageContent {...createBaseProps('lemon')} />)

      const colorBar = container.querySelector('[aria-hidden="true"]')
      expect(colorBar).toHaveClass('bg-yellow-400')
    })
  })

  describe('child components', () => {
    it('renders HouseAbout with correct props', () => {
      render(<HousePageContent {...createBaseProps()} />)

      const about = screen.getByTestId('house-about')
      expect(about).toHaveAttribute('data-title', 'Orange House')
      expect(about).toHaveAttribute('data-slug', 'orange')
    })

    it('renders HouseAmenities with transformed amenity categories', () => {
      render(<HousePageContent {...createBaseProps()} />)

      const amenities = screen.getByTestId('house-amenities')
      // Count of categories, not individual items
      expect(amenities).toHaveAttribute('data-count', '1')
    })

    it('renders HousePricing with transformed pricing rows', () => {
      render(<HousePageContent {...createBaseProps()} />)

      const pricing = screen.getByTestId('house-pricing')
      expect(pricing).toHaveAttribute('data-count', '1')
    })

    it('renders ImageBlockGallery', () => {
      render(<HousePageContent {...createBaseProps()} />)

      expect(screen.getByTestId('image-block-gallery')).toBeInTheDocument()
    })
  })

  describe('mobile hero images', () => {
    it('includes featured image first when present', () => {
      render(<HousePageContent {...createBaseProps()} />)

      const mobileHero = screen.getByTestId('mobile-hero')
      // Featured + 2 gallery = 3 images
      expect(mobileHero).toHaveAttribute('data-count', '3')
    })

    it('uses only gallery images when featured is missing', () => {
      const props = createBaseProps()
      props.featuredImage = null as unknown as typeof props.featuredImage

      render(<HousePageContent {...props} />)

      const mobileHero = screen.getByTestId('mobile-hero')
      // Only 2 gallery images
      expect(mobileHero).toHaveAttribute('data-count', '2')
    })

    it('handles empty gallery with featured image', () => {
      const props = createBaseProps()
      props.gallery = null

      render(<HousePageContent {...props} />)

      const mobileHero = screen.getByTestId('mobile-hero')
      // Only featured image
      expect(mobileHero).toHaveAttribute('data-count', '1')
    })

    it('handles empty gallery without featured image', () => {
      const props = createBaseProps()
      props.gallery = null
      props.featuredImage = null as unknown as typeof props.featuredImage

      render(<HousePageContent {...props} />)

      const mobileHero = screen.getByTestId('mobile-hero')
      expect(mobileHero).toHaveAttribute('data-count', '0')
    })
  })

  describe('houses navigation', () => {
    it('renders HousesNav when houses exist', () => {
      render(<HousePageContent {...createBaseProps()} />)

      const nav = screen.getByTestId('houses-nav')
      expect(nav).toHaveAttribute('data-count', '2')
    })

    it('does not render HousesNav when houses is empty', () => {
      const props = createBaseProps()
      props.houses = []

      render(<HousePageContent {...props} />)

      expect(screen.queryByTestId('houses-nav')).not.toBeInTheDocument()
    })

    it('does not render HousesNav when houses is null', () => {
      const props = createBaseProps()
      props.houses = null as unknown as typeof props.houses

      render(<HousePageContent {...props} />)

      expect(screen.queryByTestId('houses-nav')).not.toBeInTheDocument()
    })
  })

  describe('HouseLocation conditional rendering', () => {
    it('renders HouseLocation when map data is valid', () => {
      render(<HousePageContent {...createBaseProps()} />)

      expect(screen.getByTestId('house-location')).toBeInTheDocument()
    })

    it('renders HouseLocation even when map is null', () => {
      const props = createBaseProps()
      props.map = null as unknown as typeof props.map

      render(<HousePageContent {...props} />)

      // HouseLocation is always rendered, map handling is internal
      expect(screen.getByTestId('house-location')).toBeInTheDocument()
    })

    it('renders HouseLocation even when map coordinates are missing', () => {
      const props = createBaseProps()
      props.map = {
        ...props.map,
        coordinates: null
      } as unknown as typeof props.map

      render(<HousePageContent {...props} />)

      // HouseLocation is always rendered, map handling is internal
      expect(screen.getByTestId('house-location')).toBeInTheDocument()
    })
  })
})
