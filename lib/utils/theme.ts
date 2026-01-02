import type { HouseIdentifier } from '@/lib/types'

/**
 * Background color classes for each house theme
 * Includes both light and dark mode variants
 */
export const HOUSE_THEME_COLORS: Record<HouseIdentifier, string> = {
  apple: 'bg-red-600 dark:bg-red-500',
  lemon: 'bg-yellow-400 dark:bg-yellow-500',
  orange: 'bg-orange-500 dark:bg-orange-600'
}
