import { GoogleMaps, HouseMarker, MapProvider, PlaceDetails } from '@/components/map'
import type { SanityImage } from '@/lib/types/components'

interface HouseMapProps {
  placeId: string
  placeImage: SanityImage
  mapsUrl?: string
  center: { lat: number; lng: number }
}

export function HouseMap({ center, placeId, placeImage, mapsUrl }: HouseMapProps) {
  return (
    <MapProvider>
      <div className="md:border-border flex min-h-[480px] flex-col gap-6 overflow-hidden md:flex-row md:gap-0 md:rounded-lg md:border">
        <div className="border-border flex min-h-[480px] flex-col overflow-hidden rounded-lg border bg-white md:w-1/3 md:shrink-0 md:rounded-none md:border-0 md:border-r dark:bg-[#131314]">
          <PlaceDetails placeId={placeId} placeImage={placeImage} />
        </div>
        <div className="md:w-2/3">
          <div className="border-border h-[400px] w-full overflow-hidden rounded-lg border md:h-full md:rounded-none md:border-0">
            <GoogleMaps
              id="house-detail-map"
              className="h-full w-full"
              defaultZoom={15}
              defaultCenter={center}
            >
              <HouseMarker center={center} mapsUrl={mapsUrl} />
            </GoogleMaps>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}
