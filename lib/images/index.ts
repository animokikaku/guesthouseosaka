import { HouseIdentifier } from '@/lib/types'
import { HouseImageStorage, RawImageData } from './storage'

// Static imports - each house's data is bundled separately
import appleData from './data/apple.json' with { type: 'json' }
import lemonData from './data/lemon.json' with { type: 'json' }
import orangeData from './data/orange.json' with { type: 'json' }

// Pre-built storage instances (lazy initialized and cached)
let _appleStorage: HouseImageStorage | null = null
let _lemonStorage: HouseImageStorage | null = null
let _orangeStorage: HouseImageStorage | null = null

/**
 * Get the image storage for Apple House
 */
function appleStorage(): HouseImageStorage {
  if (!_appleStorage) {
    _appleStorage = new HouseImageStorage(appleData as RawImageData[])
  }
  return _appleStorage
}

/**
 * Get the image storage for Lemon House
 */
function lemonStorage(): HouseImageStorage {
  if (!_lemonStorage) {
    _lemonStorage = new HouseImageStorage(lemonData as RawImageData[])
  }
  return _lemonStorage
}

/**
 * Get the image storage for Orange House
 */
function orangeStorage(): HouseImageStorage {
  if (!_orangeStorage) {
    _orangeStorage = new HouseImageStorage(orangeData as RawImageData[])
  }
  return _orangeStorage
}

/**
 * Get the image storage for a specific house
 * @param house - The house identifier
 */
export function getHouseStorage(house: HouseIdentifier): HouseImageStorage {
  switch (house) {
    case 'apple':
      return appleStorage()
    case 'lemon':
      return lemonStorage()
    case 'orange':
      return orangeStorage()
  }
}

// Re-export types and classes from storage
export {
  HouseImageStorage,
  type ImageCategory,
  type ImageCategoryGroup,
  type ImageWithProps,
  type RawImageData
} from './storage'

// Re-export labels types
export { type ImageWithAlt } from './labels'

// Re-export client utilities
export { ImagesProvider, useImages } from './client'
