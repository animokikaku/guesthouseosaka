import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic'

type IconName = keyof typeof dynamicIconImports

interface IconPreviewProps {
  icon?: string
}

export function IconPreview({ icon }: IconPreviewProps) {
  if (!icon) return null

  return <DynamicIcon name={icon as IconName} />
}
