import { allowedIcons } from '@/sanity/lib/allowed-icons'
import { iconMap } from '@/sanity/lib/icon-map'

// Type-safe icon names derived from allowedIcons
export type IconName = (typeof allowedIcons)[number]

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
}

/**
 * Renders an icon by name from the allowed icons list.
 * Falls back to null for unknown icons.
 */
export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name]
  if (!IconComponent) return null
  return <IconComponent {...props} />
}
