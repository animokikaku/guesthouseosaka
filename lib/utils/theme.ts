import type { HouseIdentifier } from '@/lib/types'

interface HouseColorVariants {
  divider: string
  accent: string
  text: string
  toggleSvg: string
}

export interface HouseCardStyles {
  text: string
  headerBg: string
  border: string
}

export const HOUSE_COLORS: Record<HouseIdentifier, HouseColorVariants> = {
  apple: {
    divider: 'bg-red-600 dark:bg-red-500',
    accent: 'bg-red-600/50',
    text: 'text-red-600',
    toggleSvg: 'data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500'
  },
  lemon: {
    divider: 'bg-yellow-400 dark:bg-yellow-500',
    accent: 'bg-yellow-600/50',
    text: 'text-yellow-600',
    toggleSvg: 'data-[state=on]:*:[svg]:fill-yellow-500 data-[state=on]:*:[svg]:stroke-yellow-500'
  },
  orange: {
    divider: 'bg-orange-500 dark:bg-orange-600',
    accent: 'bg-orange-600/50',
    text: 'text-orange-600',
    toggleSvg: 'data-[state=on]:*:[svg]:fill-orange-500 data-[state=on]:*:[svg]:stroke-orange-500'
  }
}

export const HOUSE_CARD_STYLES: Record<HouseIdentifier, HouseCardStyles> = {
  orange: {
    text: 'text-orange-700 dark:text-orange-400',
    headerBg:
      'bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800/50'
  },
  apple: {
    text: 'text-red-700 dark:text-red-400',
    headerBg: 'bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20',
    border: 'border-red-200 dark:border-red-800/50'
  },
  lemon: {
    text: 'text-yellow-700 dark:text-yellow-400',
    headerBg:
      'bg-gradient-to-r from-yellow-50 to-amber-100/50 dark:from-yellow-950/40 dark:to-amber-900/20',
    border: 'border-yellow-200 dark:border-yellow-800/50'
  }
}
