import type { Link } from '@/i18n/navigation'
import type { assets } from '@/lib/assets'
import type { ComponentProps } from 'react'

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

export type NavItem = {
  key: string
  href: ComponentProps<typeof Link>['href']
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
