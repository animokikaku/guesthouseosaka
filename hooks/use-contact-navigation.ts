import { useTranslations } from 'next-intl'

export type ContactNavigationKey = 'tour' | 'move-in' | 'general'

export function useContactNavigation() {
  const t = useTranslations('useContactNavigation')

  function label(key: ContactNavigationKey) {
    return {
      tour: {
        title: t('tour.title'),
        description: t('tour.description'),
        href: { pathname: '/contact/tour', hash: '#tabs' } as const
      },
      'move-in': {
        title: t('moveIn.title'),
        description: t('moveIn.description'),
        href: { pathname: '/contact/move-in', hash: '#tabs' } as const
      },
      general: {
        title: t('general.title'),
        description: t('general.description'),
        href: { pathname: '/contact/other', hash: '#tabs' } as const
      }
    }[key]
  }
  return label
}
