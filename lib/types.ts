import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { ComponentProps } from 'react'
import { z } from 'zod'

export const HouseIdentifierValues = ['orange', 'apple', 'lemon'] as const
export const HouseIdentifierSchema = z.enum(HouseIdentifierValues)
export type HouseIdentifier = z.infer<typeof HouseIdentifierSchema>

export const ContactTypeValues = ['tour', 'move-in', 'other'] as const
export const ContactTypeSchema = z.enum(ContactTypeValues)
export type ContactType = z.infer<typeof ContactTypeSchema>

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
