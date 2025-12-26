import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import {
  BookTextIcon,
  CalendarIcon,
  ExternalLinkIcon,
  type LucideIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon
} from 'lucide-react'

// Map icon names from Sanity to Lucide components
const iconMap: Record<string, LucideIcon> = {
  mail: MailIcon,
  phone: PhoneIcon,
  'book-text': BookTextIcon,
  'external-link': ExternalLinkIcon,
  'map-pin': MapPinIcon,
  calendar: CalendarIcon
}

// Map variant names from Sanity to Button variants
type ButtonVariant = 'default' | 'ghost' | 'outline' | 'secondary'

interface PageAction {
  _key: string
  icon: string | null
  label: string | null
  href: string | null
  variant: string | null
}

interface DynamicPageActionsProps {
  actions: PageAction[] | null
}

export function DynamicPageActions({ actions }: DynamicPageActionsProps) {
  if (!actions || actions.length === 0) return null

  return (
    <>
      {actions.map((action, index) => {
        if (!action.href || !action.label) return null

        const Icon = action.icon ? iconMap[action.icon] : null
        // First action defaults to 'default' variant, others to 'ghost'
        const variant = (action.variant ||
          (index === 0 ? 'default' : 'ghost')) as ButtonVariant

        // Check if href is external or internal
        const isExternal =
          action.href.startsWith('http://') ||
          action.href.startsWith('https://')

        // Parse href for internal links with hash
        const hasHash = action.href.includes('#')
        const [pathname, hash] = action.href.split('#')

        if (isExternal) {
          return (
            <Button
              key={action._key}
              asChild
              variant={variant}
              size="sm"
            >
              <a href={action.href} target="_blank" rel="noopener noreferrer">
                {Icon && <Icon />}
                {action.label}
              </a>
            </Button>
          )
        }

        return (
          <Button
            key={action._key}
            asChild
            variant={variant}
            size="sm"
          >
            <Link
              href={
                hasHash
                  ? { pathname: (pathname || '/') as '/', hash: `#${hash}` }
                  : (action.href as '/')
              }
            >
              {Icon && <Icon />}
              {action.label}
            </Link>
          </Button>
        )
      })}
    </>
  )
}
