import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/lib/types/components'
import Image from 'next/image'

/**
 * Pre-computed gallery layout for 6 images
 * Percentages calculated relative to content bounds (634×452)
 * Layout fills full container width while maintaining masonry proportions
 */
const SLOTS = [
  { left: 0, top: 28.76, size: 22.4, overlay: 'from-amber-200/80 to-amber-400/40' },
  { left: 24.6, top: 0, size: 42.9, overlay: 'from-slate-500/70 to-slate-800/60' },
  { left: 69.4, top: 11.5, size: 19.4, overlay: 'from-stone-400/70 to-stone-700/60' },
  { left: 18.5, top: 62.83, size: 26.5, overlay: 'from-emerald-400/70 to-emerald-700/50' },
  { left: 47, top: 62.83, size: 20.4, overlay: 'from-indigo-500/70 to-indigo-800/60' },
  { left: 69.4, top: 41.37, size: 30.6, overlay: 'from-rose-400/70 to-rose-700/50' }
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
      <div className="relative aspect-634/452 w-full">
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
