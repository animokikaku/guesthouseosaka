import { GALLERY_WALL_SLOTS } from '@/lib/gallery-wall'
import { cn } from '@/lib/utils'
import type { GalleryImage } from '@/lib/types/components'
import Image from 'next/image'

export function GalleryWall({ images, className }: { images: GalleryImage[]; className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative aspect-634/452 w-full">
        {images.map((image, index) => {
          const slot = GALLERY_WALL_SLOTS[index]
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
                // The collage sits in the hero, so its largest tile is the
                // likely LCP element; the rest stay lazy.
                priority={image.priority}
                fetchPriority={image.priority ? 'high' : undefined}
                className="ease-out-ui h-full w-full object-cover transition-transform duration-300 pointer-fine:group-hover:scale-[1.03]"
              />
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 bg-linear-to-br opacity-40',
                  slot.overlay
                )}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/0 via-black/10 to-black/30 opacity-0 transition-opacity duration-300 pointer-fine:group-hover:opacity-100" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
