import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { ComponentProps } from 'react'
import { z } from 'zod'

export const HouseIdentifierValues = ['orange', 'lemon', 'apple'] as const
export const HouseIdentifierSchema = z.enum(HouseIdentifierValues)
export type HouseIdentifier = z.infer<typeof HouseIdentifierSchema>

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
  background: (typeof assets)[HouseIdentifier]['background']
  icon: (typeof assets)[HouseIdentifier]['icon']
  caption: string
  description: string
}

export type NavItems = Array<NavItem | NavListItem>
