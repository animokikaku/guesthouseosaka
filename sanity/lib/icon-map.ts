import { createElement } from 'react'
import {
  ArrowUpDown,
  Bath,
  Bed,
  Bike,
  BookText,
  Building,
  Cable,
  ChefHat,
  Cigarette,
  Coffee,
  Flower,
  HousePlug,
  Lock,
  Mail,
  Mailbox,
  Map,
  MapPin,
  Microwave,
  PartyPopper,
  PencilRuler,
  Phone,
  Plug,
  Refrigerator,
  ShowerHead,
  Sofa,
  Sun,
  ThermometerSnowflake,
  Toilet,
  Tv,
  Utensils,
  UtensilsCrossed,
  WashingMachine,
  Wifi,
  Wind
} from 'lucide-react'
import { siFacebook, siInstagram } from 'simple-icons'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

function createSimpleIcon(icon: { path: string; title: string }): IconComponent {
  return function SimpleIcon(props) {
    return createElement(
      'svg',
      {
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        role: 'img',
        'aria-label': icon.title,
        ...props
      },
      createElement('path', { d: icon.path })
    )
  }
}

const FacebookIcon = createSimpleIcon(siFacebook)
const InstagramIcon = createSimpleIcon(siInstagram)

/**
 * Static icon map - only includes icons from allowedIcons.
 * Shared between frontend and Sanity Studio for tree-shaking.
 */
export const iconMap: Record<string, IconComponent> = {
  'arrow-up-down': ArrowUpDown,
  bath: Bath,
  bed: Bed,
  bike: Bike,
  'book-text': BookText,
  building: Building,
  cable: Cable,
  'chef-hat': ChefHat,
  cigarette: Cigarette,
  coffee: Coffee,
  facebook: FacebookIcon,
  flower: Flower,
  'house-plug': HousePlug,
  instagram: InstagramIcon,
  lock: Lock,
  mail: Mail,
  mailbox: Mailbox,
  map: Map,
  'map-pin': MapPin,
  microwave: Microwave,
  'party-popper': PartyPopper,
  'pencil-ruler': PencilRuler,
  phone: Phone,
  plug: Plug,
  refrigerator: Refrigerator,
  'shower-head': ShowerHead,
  sofa: Sofa,
  sun: Sun,
  'thermometer-snowflake': ThermometerSnowflake,
  toilet: Toilet,
  tv: Tv,
  utensils: Utensils,
  'utensils-crossed': UtensilsCrossed,
  'washing-machine': WashingMachine,
  wifi: Wifi,
  wind: Wind
}
