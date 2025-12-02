import { assets } from '@/lib/assets'
import { HouseIdentifier, NavGroupItem, NavItems } from '@/lib/types'
import { useTranslations } from 'next-intl'

import { useHouseLabels } from './use-house-labels'

export function useNavigationItems(): NavItems {
  const t = useTranslations('useNavigationItems')
  const houseLabel = useHouseLabels()
  const houseIdentifiers: HouseIdentifier[] = ['orange', 'apple', 'lemon']

  const items: NavGroupItem[] = houseIdentifiers.map((house) => {
    const { name, summary, caption } = houseLabel(house)
    const { icon, background } = assets[house]
    return {
      key: house,
      href: `/${house}`,
      label: name,
      description: summary,
      caption,
      icon,
      background
    }
  })

  return [
    {
      key: 'share-houses',
      items,
      label: t('share_houses')
    },
    {
      key: 'faq',
      href: '/faq',
      label: t('faq')
    },
    {
      key: 'contact',
      href: '/contact',
      label: t('contact')
    }
  ]
}
