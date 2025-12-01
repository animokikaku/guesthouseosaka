import { useTranslations } from 'next-intl'

type ContactFormKey = 'tour' | 'moveIn' | 'general'

type UseContactFormContent = Record<
  ContactFormKey,
  { title: string; description: string; href: string }
>

export function useContactNavigationItem(key: ContactFormKey): {
  title: string
  description: string
  href: string
} {
  const nav = useContactNavigation()
  return nav[key]
}

export function useContactNavigation(): UseContactFormContent {
  const t = useTranslations('useContactNavigation')

  return {
    tour: {
      title: t('tour.title'),
      description: t('tour.description'),
      href: '/contact/tour#tabs'
    },
    moveIn: {
      title: t('moveIn.title'),
      description: t('moveIn.description'),
      href: '/contact/move-in#tabs'
    },
    general: {
      title: t('general.title'),
      description: t('general.description'),
      href: '/contact/other#tabs'
    }
  }
}
