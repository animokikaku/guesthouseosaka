import { allowedIcons } from '@/sanity/lib/allowed-icons'
import { iconMap } from '@/sanity/lib/icon-map'
import type { LucideIcon } from 'lucide-react'

// Type-safe icon names derived from allowedIcons
export type IconName = (typeof allowedIcons)[number]

export interface IconProps extends React.ComponentProps<LucideIcon> {
  name: string
}

/**
 * Renders a Lucide icon by name from the allowed icons list.
 * Falls back to null for unknown icons.
 */
export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name]
  if (!IconComponent) return null
  return <IconComponent {...props} />
}
