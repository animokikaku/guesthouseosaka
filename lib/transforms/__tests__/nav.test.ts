import { describe, expect, it, vi } from 'vitest'
import { faker } from '@faker-js/faker'

vi.mock('@/sanity/lib/image', () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        dpr: () => ({
          fit: () => ({
            url: () => 'https://cdn.sanity.io/images/test/nav.jpg'
          })
        })
      })
    })
  })
}))

vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_BLOB_STORAGE_URL: 'https://test.public.blob.vercel-storage.com'
  }
}))

import { toContactNavItems, toHouseNavItems } from '../nav'
import type { ContactPageQueryResult, HousesNavQueryResult } from '@/sanity.types'

type ContactTypes = NonNullable<ContactPageQueryResult>['contactTypes']

function createContactType(overrides: Partial<ContactTypes[number]> = {}): ContactTypes[number] {
  return {
    _id: faker.string.uuid(),
    _type: 'contactType',
    slug: faker.helpers.arrayElement(['tour', 'move-in', 'other'] as const),
    title: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    fields: {} as ContactTypes[number]['fields'],
    ...overrides
  }
}

function createHouseNavItem(
  overrides: Partial<NonNullable<HousesNavQueryResult>[number]> = {}
): NonNullable<HousesNavQueryResult>[number] {
  return {
    slug: faker.helpers.arrayElement(['apple', 'lemon', 'orange'] as const),
    title: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    caption: faker.lorem.words(3),
    image: {
      asset: { _ref: `image-${faker.string.nanoid()}`, _type: 'reference' },
      hotspot: null,
      crop: null,
      alt: faker.lorem.words(3),
      preview: `data:image/jpeg;base64,${faker.string.alphanumeric(20)}`
    },
    ...overrides
  }
}

describe('toContactNavItems', () => {
  it('transforms contact types to nav items', () => {
    const contactTypes: ContactTypes = [
      createContactType({ _id: 'ct1', slug: 'tour', title: 'Book a Tour' }),
      createContactType({ _id: 'ct2', slug: 'move-in', title: 'Move In' })
    ]

    const result = toContactNavItems(contactTypes)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 'ct1', slug: 'tour', title: 'Book a Tour' })
    expect(result[1]).toEqual({ id: 'ct2', slug: 'move-in', title: 'Move In' })
  })

  it('filters out items without title', () => {
    const contactTypes: ContactTypes = [
      createContactType({ title: 'Valid' }),
      createContactType({ title: null }),
      createContactType({ title: 'Also Valid' })
    ]

    const result = toContactNavItems(contactTypes)

    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('Valid')
    expect(result[1].title).toBe('Also Valid')
  })

  it('returns empty array for empty input', () => {
    const result = toContactNavItems([])

    expect(result).toEqual([])
  })
})

describe('toHouseNavItems', () => {
  it('transforms houses to nav group items', () => {
    const houses: HousesNavQueryResult = [
      createHouseNavItem({ slug: 'apple', title: 'Apple House' })
    ]

    const result = toHouseNavItems(houses)

    expect(result).toHaveLength(1)
    expect(result[0].key).toBe('apple')
    expect(result[0].label).toBe('Apple House')
    expect(result[0].background.src).toBe('https://cdn.sanity.io/images/test/nav.jpg')
  })

  it('uses slug as label fallback when title is null', () => {
    const houses: HousesNavQueryResult = [createHouseNavItem({ slug: 'orange', title: null })]

    const result = toHouseNavItems(houses)

    expect(result[0].label).toBe('orange')
  })

  it('converts null description and caption to undefined', () => {
    const houses: HousesNavQueryResult = [
      createHouseNavItem({ slug: 'lemon', description: null, caption: null })
    ]

    const result = toHouseNavItems(houses)

    expect(result[0].description).toBeUndefined()
    expect(result[0].caption).toBeUndefined()
  })

  it('builds correct href with house slug', () => {
    const houses: HousesNavQueryResult = [createHouseNavItem({ slug: 'apple' })]

    const result = toHouseNavItems(houses)

    expect(result[0].href).toEqual({
      pathname: '/[house]',
      params: { house: 'apple' }
    })
  })

  it('includes icon from assets', () => {
    const houses: HousesNavQueryResult = [createHouseNavItem({ slug: 'apple' })]

    const result = toHouseNavItems(houses)

    expect(result[0].icon).toBeDefined()
    expect(result[0].icon.alt).toBe('Apple house icon')
  })

  it('includes blurDataURL in background', () => {
    const preview = 'data:image/jpeg;base64,blur123'
    const houses: HousesNavQueryResult = [
      createHouseNavItem({
        slug: 'apple',
        image: {
          asset: { _ref: 'image-ref', _type: 'reference' },
          hotspot: null,
          crop: null,
          alt: 'Apple',
          preview
        }
      })
    ]

    const result = toHouseNavItems(houses)

    expect(result[0].background.blurDataURL).toBe(preview)
  })

  it('filters out houses with invalid slugs', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const houses: HousesNavQueryResult = [
      createHouseNavItem({ slug: 'apple' }),
      createHouseNavItem({ slug: 'invalid-slug' as 'apple' })
    ]

    const result = toHouseNavItems(houses)

    expect(result).toHaveLength(1)
    expect(result[0].key).toBe('apple')
    expect(consoleSpy).toHaveBeenCalledWith('Missing asset for house slug: invalid-slug')

    consoleSpy.mockRestore()
  })

  it('returns empty array for empty input', () => {
    const result = toHouseNavItems([])

    expect(result).toEqual([])
  })
})
