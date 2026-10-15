// @vitest-environment node

import type { HousesNavQueryResult } from '@/sanity.types'
import { createSanityImage } from './mocks'
import { toContactNavItems, toHouseNavItems } from '../nav'

type NavHouse = NonNullable<HousesNavQueryResult>[number]

function house(overrides: Partial<NavHouse> = {}): NavHouse {
  return {
    slug: 'apple',
    title: 'Apple House',
    description: 'Near the station',
    caption: 'Quiet street',
    image: createSanityImage({ alt: 'Apple House front' }),
    ...overrides
  }
}

describe('toContactNavItems', () => {
  it('turns each titled contact type into a tab, dropping untitled ones', () => {
    expect(
      toContactNavItems([
        { _id: 'ct1', slug: 'tour', title: 'Book a tour' },
        { _id: 'ct2', slug: 'move-in', title: null },
        { _id: 'ct3', slug: 'other', title: 'Other' }
      ])
    ).toEqual([
      { id: 'ct1', slug: 'tour', title: 'Book a tour' },
      { id: 'ct3', slug: 'other', title: 'Other' }
    ])
  })
})

describe('toHouseNavItems', () => {
  it('links each house to its page with its icon and a cropped preview', () => {
    const image = createSanityImage({ alt: 'Apple House front' })

    const [item] = toHouseNavItems([house({ image })])
    const { searchParams } = new URL(item.background.src)

    expect(item).toMatchObject({
      key: 'apple',
      href: { pathname: '/[house]', params: { house: 'apple' } },
      label: 'Apple House',
      description: 'Near the station',
      caption: 'Quiet street',
      icon: { alt: 'Apple house icon' },
      background: { alt: 'Apple House front', blurDataURL: image.preview }
    })
    expect([searchParams.get('w'), searchParams.get('h'), searchParams.get('fit')]).toEqual([
      '250',
      '150',
      'crop'
    ])
  })

  it('falls back to the slug, and leaves out missing copy', () => {
    const [item] = toHouseNavItems([
      house({
        slug: 'orange',
        title: null,
        description: null,
        caption: null,
        image: createSanityImage({ alt: null })
      })
    ])

    expect(item).toMatchObject({ label: 'orange', background: { alt: 'orange' } })
    expect(item.description).toBeUndefined()
    expect(item.caption).toBeUndefined()
  })

  it('drops, and reports, a house whose slug the site does not know', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const items = toHouseNavItems([house(), house({ slug: 'banana' as 'apple' })])

    expect(items.map((item) => item.key)).toEqual(['apple'])
    expect(warn).toHaveBeenCalledWith('Unknown house slug: banana')
    warn.mockRestore()
  })
})
