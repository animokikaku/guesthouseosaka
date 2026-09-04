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

// Every child is stubbed down to the props this component is responsible for
// choosing, so the suite covers composition rather than the children themselves.
vi.mock('@/components/house/house-about', () => ({
  HouseAbout: ({ title }: { title: string }) => <div data-testid="house-about" data-title={title} />
}))

vi.mock('@/components/house/house-amenities', () => ({
  HouseAmenities: ({ amenityCategories }: { amenityCategories: unknown[] }) => (
    <div data-testid="house-amenities" data-count={amenityCategories?.length ?? 0} />
  )
}))

vi.mock('@/components/house/house-location', () => ({
  HouseLocation: () => <div data-testid="house-location" />
}))

vi.mock('@/components/house/house-pricing', () => ({
  HousePricing: ({ pricing }: { pricing: unknown[] }) => (
    <div data-testid="house-pricing" data-count={pricing?.length ?? 0} />
  )
}))

vi.mock('@/components/house/mobile-hero-image', () => ({
  MobileHeroImage: ({ images }: { images: unknown[] }) => (
    <div data-testid="mobile-hero" data-count={images?.length ?? 0} />
  )
}))

vi.mock('@/components/houses-nav', () => ({
  HousesNav: ({ houses }: { houses: unknown[] }) => (
    <div data-testid="houses-nav" data-count={houses.length} />
  )
}))

vi.mock('@/components/image-block-gallery', () => ({
  ImageBlockGallery: () => <div data-testid="image-block-gallery" />
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
    <span data-testid="nav-link" data-href={JSON.stringify(href)}>
      {children}
    </span>
  )
}))

type HouseSlug = 'orange' | 'apple' | 'lemon'
type Props = NonNullable<HouseQueryResult> & { houses: HousesNavQueryResult }

// Mock image with the expanded asset structure HouseQueryResult carries
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

const createBaseProps = (overrides: Partial<Props> = {}): Props => {
  // Cast to satisfy complex generated Sanity types while testing behavior
  return {
    _id: 'house-123',
    _type: 'house',
    _createdAt: '2024-01-01',
    _updatedAt: '2024-01-01',
    _rev: 'rev-123',
    slug: 'orange',
    title: 'Orange House',
    description: 'A beautiful orange house',
    caption: 'Welcome to Orange House',
    phone: { domestic: '06-1234-5678', international: '+81-6-1234-5678' },
    image: createMockImage('House image'),
    galleryImages: [createGalleryItem({ _key: 'g1' }), createGalleryItem({ _key: 'g2' })],
    galleryPreview: [createGalleryItem({ _key: 'g1' }), createGalleryItem({ _key: 'g2' })],
    galleryImageCount: 2,
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
      {
        slug: 'orange',
        title: 'Orange House',
        description: null,
        caption: null,
        image: createMockImage('Orange')
      },
      {
        slug: 'apple',
        title: 'Apple House',
        description: null,
        caption: null,
        image: createMockImage('Apple')
      }
    ],
    ...overrides
  } as unknown as Props
}

describe('HousePageContent', () => {
  it('renders the header and article landmark for the house', () => {
    const { container } = render(<HousePageContent {...createBaseProps()} />)

    expect(screen.getByTestId('page-heading')).toHaveTextContent('Orange House')
    expect(screen.getByTestId('page-description')).toHaveTextContent('A beautiful orange house')
    expect(container.querySelector('article#orange')).toHaveAttribute(
      'aria-labelledby',
      'orange-title'
    )
  })

  it('hands each child the slice of the document it owns', () => {
    render(<HousePageContent {...createBaseProps()} />)

    expect(screen.getByTestId('house-about')).toHaveAttribute('data-title', 'Orange House')
    // Categories, not the individual amenities inside them
    expect(screen.getByTestId('house-amenities')).toHaveAttribute('data-count', '1')
    expect(screen.getByTestId('house-pricing')).toHaveAttribute('data-count', '1')
    expect(screen.getByTestId('image-block-gallery')).toBeInTheDocument()
    expect(screen.getByTestId('houses-nav')).toHaveAttribute('data-count', '2')
  })

  it.each([
    ['orange', 'bg-orange-500'],
    ['apple', 'bg-red-600'],
    ['lemon', 'bg-yellow-400']
  ] as const)('paints the %s house color bar', (slug: HouseSlug, className) => {
    const { container } = render(<HousePageContent {...createBaseProps({ slug })} />)

    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass(className)
  })

  it.each([
    ['the featured image first, then the gallery', {}, '3'],
    ['only gallery images when featured is missing', { featuredImage: null }, '2'],
    ['only the featured image when the gallery is empty', { galleryImages: null }, '1'],
    ['nothing when both are missing', { featuredImage: null, galleryImages: null }, '0']
  ] as const)('stacks the mobile hero with %s', (_name, overrides, count) => {
    render(<HousePageContent {...createBaseProps(overrides)} />)

    expect(screen.getByTestId('mobile-hero')).toHaveAttribute('data-count', count)
  })

  // HouseLocation owns its own empty states, so it renders whatever the map holds.
  it.each([
    ['a full map', {}],
    ['no map', { map: null }],
    ['a map without coordinates', { map: { ...createMap(), coordinates: null } }]
  ] as const)('always renders HouseLocation, given %s', (_name, overrides) => {
    render(<HousePageContent {...createBaseProps(overrides as Partial<Props>)} />)

    expect(screen.getByTestId('house-location')).toBeInTheDocument()
  })

  it('still renders the houses nav when there are no other houses', () => {
    render(<HousePageContent {...createBaseProps({ houses: [] })} />)

    expect(screen.getByTestId('houses-nav')).toHaveAttribute('data-count', '0')
  })
})
