'use client'

import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

type GalleryImageButtonProps = ComponentPropsWithoutRef<'div'> & {
  imageClassName?: string
  containerClassName?: string
  sizes?: string
  imageProps: Omit<ImageProps, 'fill' | 'className'>
}

export const GalleryImageButton = forwardRef<
  HTMLDivElement,
  GalleryImageButtonProps
>(
  (
    {
      imageClassName,
      containerClassName,
      sizes,
      imageProps,
      className,
      children,
      ...divProps
    },
    ref
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { alt, height, width, ...restImageProps } = imageProps

    return (
      <div
        ref={ref}
        className={cn(
          'group relative cursor-pointer overflow-hidden ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...divProps}
      >
        <div
          className={cn(
            'bg-muted/40 relative h-full w-full overflow-hidden',
            containerClassName
          )}
        >
          <Image
            fill
            alt={alt}
            className={cn(
              'object-cover transition-opacity duration-300 group-hover:opacity-90 group-focus-visible:opacity-90',
              imageClassName
            )}
            sizes={sizes}
            {...restImageProps}
          />
          {alt && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-end bg-linear-to-t from-black/70 to-transparent p-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              aria-hidden="true"
            >
              <span className="text-sm font-medium text-white">{alt}</span>
            </div>
          )}
        </div>
        {children}
      </div>
    )
  }
)

GalleryImageButton.displayName = 'GalleryImageButton'
