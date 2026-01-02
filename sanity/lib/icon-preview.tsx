import { iconMap } from './icon-map'

interface IconPreviewProps {
  icon?: string
}

export function IconPreview({ icon }: IconPreviewProps) {
  if (!icon) return null

  const IconComponent = iconMap[icon]
  if (!IconComponent) return null

  return <IconComponent />
}
