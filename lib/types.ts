import { assets } from '@/lib/assets'
import { z } from 'zod'

export const HouseIdentifierValues = ['orange', 'lemon', 'apple'] as const
export const HouseIdentifierSchema = z.enum(HouseIdentifierValues)
export type HouseIdentifier = z.infer<typeof HouseIdentifierSchema>

export const routes = [
  '/',
  '/orange',
  '/apple',
  '/lemon',
  '/faq',
  '/contact',
  '/contact/tour',
  '/contact/move-in',
  '/contact/other'
] as const

export type Routes = (typeof routes)[number]

export type NavItem = {
  key: string
  href: Routes
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
