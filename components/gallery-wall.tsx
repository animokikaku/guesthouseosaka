import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/lib/types/components'
import Image from 'next/image'

const BASE_WIDTH = 750
const BASE_HEIGHT = 452

/**
 * Fixed layout positions for the 6 gallery images
 * Defines x/y coordinates for percentage-based positioning
 */
const GALLERY_POSITIONS = [
  { x: 56, y: 130 },
  { x: 212, y: 0 },
  { x: 496, y: 52 },
  { x: 173, y: 284 },
  { x: 354, y: 284 },
  { x: 496, y: 187 }
] as const

/**
 * Color overlays for visual variety
 */
const OVERLAYS = [
  'from-amber-200/80 to-amber-400/40',
  'from-slate-500/70 to-slate-800/60',
  'from-stone-400/70 to-stone-700/60',
  'from-emerald-400/70 to-emerald-700/50',
  'from-indigo-500/70 to-indigo-800/60',
  'from-rose-400/70 to-rose-700/50'
] as const

export function GalleryWall({
  images,
  className
}: {
  images: GalleryImage[]
  className?: string
}) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative ml-auto aspect-750/452 w-full">
        {images.map((image, index) => {
          const position = GALLERY_POSITIONS[index]
          const overlay = OVERLAYS[index]

          const widthPercent = (image.width / BASE_WIDTH) * 100
          const heightPercent = (image.height / BASE_HEIGHT) * 100
          const leftPercent = (position.x / BASE_WIDTH) * 100
          const topPercent = (position.y / BASE_HEIGHT) * 100

          return (
            <div
              key={image._key}
              role="presentation"
              aria-hidden
              className="group bg-muted absolute overflow-hidden rounded-[18%] shadow-sm transition-shadow hover:shadow-xl"
              style={{
                width: `${widthPercent}%`,
                height: `${heightPercent}%`,
                left: `${leftPercent}%`,
                top: `${topPercent}%`
              }}
            >
              <Image
                src={image.src}
                alt={image.alt || ''}
                width={image.width}
                height={image.height}
                blurDataURL={image.blurDataURL || undefined}
                placeholder={image.blurDataURL ? 'blur' : undefined}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {overlay ? (
                <div
                  className={`pointer-events-none absolute inset-0 bg-linear-to-br ${overlay} opacity-40`}
                />
              ) : null}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
