import type { HouseIdentifier } from '@/lib/types'

interface HouseColorVariants {
  divider: string
  accent: string
  text: string
  toggleSvg: string
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
