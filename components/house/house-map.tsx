import { GoogleMaps, MapProvider } from '@/components/map/google-maps'
import { HouseMarker } from '@/components/map/house-marker'
import { PlaceDetails } from '@/components/map/place-details'
import type { MapData } from '@/lib/types/components'

export function HouseMap({ map }: { map: MapData }) {
  const { coordinates, placeId, placeImage, googleMapsUrl } = map

  return (
    <MapProvider>
      <div className="md:border-border flex min-h-120 flex-col gap-6 overflow-hidden md:flex-row md:gap-0 md:rounded-lg md:border">
        <div className="border-border flex min-h-120 flex-col overflow-hidden rounded-lg border bg-white md:w-1/3 md:shrink-0 md:rounded-none md:border-0 md:border-r dark:bg-[#131314]">
          <PlaceDetails placeId={placeId} placeImage={placeImage} />
        </div>
        <div className="md:w-2/3">
          <div className="border-border h-100 w-full overflow-hidden rounded-lg border md:h-full md:rounded-none md:border-0">
            <GoogleMaps
              id="house-detail-map"
              className="h-full w-full"
              defaultZoom={15}
              defaultCenter={coordinates}
            >
              <HouseMarker center={coordinates} mapsUrl={googleMapsUrl} />
            </GoogleMaps>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}
