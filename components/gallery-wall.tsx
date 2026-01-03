import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/lib/types/components'
import Image from 'next/image'

/**
 * Pre-computed gallery layout for 6 images
 * All values are percentages relative to 750×452 base dimensions
 * Images are squares with varied sizes creating an organic scattered layout
 */
const SLOTS = [
  { left: 7.47, top: 28.76, size: 18.93, overlay: 'from-amber-200/80 to-amber-400/40' },
  { left: 28.27, top: 0, size: 36.27, overlay: 'from-slate-500/70 to-slate-800/60' },
  { left: 66.13, top: 11.5, size: 16.4, overlay: 'from-stone-400/70 to-stone-700/60' },
  { left: 23.07, top: 62.83, size: 22.4, overlay: 'from-emerald-400/70 to-emerald-700/50' },
  { left: 47.2, top: 62.83, size: 17.2, overlay: 'from-indigo-500/70 to-indigo-800/60' },
  { left: 66.13, top: 41.37, size: 25.87, overlay: 'from-rose-400/70 to-rose-700/50' }
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
          const slot = SLOTS[index]
          if (!slot) return null

          return (
            <div
              key={image._key}
              role="presentation"
              aria-hidden
              className="group bg-muted absolute overflow-hidden rounded-[18%] shadow-sm transition-shadow hover:shadow-xl"
              style={{
                width: `${slot.size}%`,
                aspectRatio: 1,
                left: `${slot.left}%`,
                top: `${slot.top}%`
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
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 bg-linear-to-br opacity-40',
                  slot.overlay
                )}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
