import type { NavGroupItem, NavItems } from '@/lib/types'

/** The header's navigation as `SiteHeader` builds it, for the desktop and mobile menu stories. */

const photo = (color: string) =>
  `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22250%22 height=%22150%22%3E%3Crect width=%22250%22 height=%22150%22 fill=%22%23${color}%22/%3E%3C/svg%3E`

const icon = (color: string) =>
  `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2220%22 fill=%22%23${color}%22/%3E%3C/svg%3E`

const houses: NavGroupItem[] = [
  {
    key: 'orange',
    link: { to: '/$locale/$house', params: { locale: 'en', house: 'orange' } },
    label: 'Orange House',
    description: 'Lively house near Tsuruhashi',
    caption: 'Rooftop terrace',
    icon: { src: icon('f97316'), width: 76, height: 76, alt: 'Orange house icon' },
    background: { src: photo('fdba74'), alt: 'Orange House living room' }
  },
  {
    key: 'apple',
    link: { to: '/$locale/$house', params: { locale: 'en', house: 'apple' } },
    label: 'Apple House',
    description: 'Quiet rooms by the park',
    icon: { src: icon('ef4444'), width: 66, height: 83, alt: 'Apple house icon' },
    background: { src: photo('fca5a5'), alt: 'Apple House garden' }
  },
  {
    key: 'lemon',
    link: { to: '/$locale/$house', params: { locale: 'en', house: 'lemon' } },
    label: 'Lemon House',
    icon: { src: icon('eab308'), width: 71, height: 69, alt: 'Lemon house icon' },
    background: { src: photo('fde047'), alt: 'Lemon House kitchen' }
  }
]

export function navItems(houseItems: NavGroupItem[] = houses): NavItems {
  return [
    { key: 'share-houses', items: houseItems, label: 'Share Houses' },
    { key: 'faq', link: { to: '/$locale/faq', params: { locale: 'en' } }, label: 'FAQ' },
    {
      key: 'contact',
      link: { to: '/$locale/contact', params: { locale: 'en' } },
      label: 'Contact'
    }
  ]
}
