import type { assets } from '@/lib/assets'
import type { Locale } from 'use-intl'

export const HouseIdentifierValues = ['orange', 'apple', 'lemon'] as const
export type HouseIdentifier = (typeof HouseIdentifierValues)[number]

export function isHouseIdentifier(value: unknown): value is HouseIdentifier {
  return typeof value === 'string' && HouseIdentifierValues.some((house) => house === value)
}

export const ContactTypeValues = ['tour', 'move-in', 'other'] as const
export type ContactType = (typeof ContactTypeValues)[number]

export function isContactType(value: unknown): value is ContactType {
  return typeof value === 'string' && ContactTypeValues.some((type) => type === value)
}

/**
 * A navigation target, spread into `Link`. Spelled out rather than typed with
 * the router's `LinkOptions`: layout loaders return these, and route types
 * can't depend on themselves.
 */
export type NavLink =
  | { to: '/$locale' | '/$locale/faq' | '/$locale/contact'; params: { locale: Locale } }
  | { to: '/$locale/$house'; params: { locale: Locale; house: HouseIdentifier } }

export type NavItem = {
  key: string
  link: NavLink
  label: string
}

export type NavListItem = {
  key: string
  label: string
  items: NavGroupItem[]
}

export type NavGroupItem = NavItem & {
  key: HouseIdentifier
  background: {
    src: string
    alt: string
    blurDataURL?: string
  }
  icon: (typeof assets)[HouseIdentifier]['icon']
  caption?: string
  description?: string
}

export type NavItems = Array<NavItem | NavListItem>
