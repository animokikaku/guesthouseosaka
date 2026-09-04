import { brandIconMap, type IconComponent } from '@/lib/icons/brand'
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

/**
 * Shared icon registry for frontend rendering and the Sanity Studio picker.
 * Keys are persisted in Sanity and must remain stable.
 */
export const iconMap: Record<string, IconComponent> = {
  ...brandIconMap,
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
  flower: Flower,
  'house-plug': HousePlug,
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

export type IconName = string

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
}

/**
 * Renders an icon by its persisted Sanity name.
 * Falls back to null for unknown icons.
 */
export function Icon({ name, ...props }: IconProps) {
  // Own-property check, not a truthiness check: `iconMap['toString']` resolves
  // up the prototype chain to a function, which React would then try to render
  // as a component. Reachable here — pageAction has no `allowedIcons`.
  if (!Object.hasOwn(iconMap, name)) return null

  const IconComponent = iconMap[name]
  if (!IconComponent) return null
  return <IconComponent {...props} />
}
