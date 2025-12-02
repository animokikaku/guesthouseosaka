import { useTranslations } from 'next-intl'

export type ContactNavigationKey = 'tour' | 'move-in' | 'general'

export function useContactNavigation() {
  const t = useTranslations('useContactNavigation')

  function label(key: ContactNavigationKey) {
    return {
      tour: {
        title: t('tour.title'),
        description: t('tour.description'),
        href: '/contact/tour#tabs'
      },
      'move-in': {
        title: t('moveIn.title'),
        description: t('moveIn.description'),
        href: '/contact/move-in#tabs'
      },
      general: {
        title: t('general.title'),
        description: t('general.description'),
        href: '/contact/other#tabs'
      }
    }[key]
  }
  return label
}
