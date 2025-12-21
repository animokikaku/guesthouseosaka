import {
  GoogleMaps,
  HouseMarker,
  MapProvider,
  PlaceDetails
} from '@/components/map'
import { HOUSE_CENTERS } from '@/components/map/location-map-constants'
import { HouseIdentifier } from '@/lib/types'
import type { HouseQueryResult } from '@/sanity.types'

type HouseMapProps = {
  id: HouseIdentifier
  location: NonNullable<HouseQueryResult>['location']
}

export function HouseMap({ id, location }: HouseMapProps) {
  // Use Sanity coordinates if available, fallback to constants
  const center = location?.coordinates
    ? { lat: location.coordinates.lat!, lng: location.coordinates.lng! }
    : HOUSE_CENTERS[id]

  return (
    <MapProvider>
      <div className="md:border-border flex min-h-[480px] flex-col gap-6 overflow-hidden md:flex-row md:gap-0 md:rounded-lg md:border">
        <div className="border-border flex min-h-[480px] flex-col overflow-hidden rounded-lg border bg-white md:w-1/3 md:shrink-0 md:rounded-none md:border-0 md:border-r dark:bg-[#131314]">
          <PlaceDetails id={id} placeId={location?.placeId} />
        </div>
        <div className="md:w-2/3">
          <div className="border-border h-[400px] w-full overflow-hidden rounded-lg border md:h-full md:rounded-none md:border-0">
            <GoogleMaps
              id="house-detail-map"
              className="h-full w-full"
              defaultZoom={15}
              defaultCenter={center}
            >
              <HouseMarker id={id} center={center} />
            </GoogleMaps>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}
