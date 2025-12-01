import { HouseIdentifier } from '@/lib/types'
import { PostalAddress } from 'schema-dts'

export const HOUSE_ADDRESS: Record<HouseIdentifier, PostalAddress> = {
  orange: {
    '@type': 'PostalAddress',
    streetAddress: '阪南町１丁目２１−１９',
    addressLocality: '大阪市阿倍野区',
    postalCode: '545-0021',
    addressCountry: 'JP'
  },
  apple: {
    '@type': 'PostalAddress',
    streetAddress: '敷津西２丁目８−４ クリオコート82',
    addressLocality: '大阪市浪速区',
    postalCode: '556-0015',
    addressCountry: 'JP'
  },
  lemon: {
    '@type': 'PostalAddress',
    streetAddress: '日本橋東１丁目２−２',
    addressLocality: '大阪市浪速区',
    postalCode: '556-0006',
    addressCountry: 'JP'
  }
}

export const NUMBER_OF_ROOMS: Record<HouseIdentifier, number> = {
  orange: 28,
  apple: 24,
  lemon: 12
}

export const DEFAULT_ZOOM = 14
export const MIN_ZOOM = 10
export const BOUNDS = {
  north: 34.752207,
  south: 34.552207,
  east: 135.646402,
  west: 135.366402
}
export const DEFAULT_CENTER = { lat: 34.652207, lng: 135.506402 } as const
export const HOUSE_CENTERS: Record<
  HouseIdentifier,
  { lat: number; lng: number }
> = {
  orange: { lat: 34.636772583794695, lng: 135.51341794050208 },
  apple: { lat: 34.65724262764905, lng: 135.49675448283273 },
  lemon: { lat: 34.66261679180666, lng: 135.50903415399767 }
}

export const GOOGLE_MAPS_URLS = {
  orange: 'https://maps.app.goo.gl/ytgDe4xcD5PbDnP79',
  apple: 'https://maps.app.goo.gl/DDJLSvn13o8giwRh7',
  lemon: 'https://maps.app.goo.gl/B9zckRuVixcqorrNA'
}
