'use client'

import type { GalleryImageProps } from '@/lib/gallery-image'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ComponentPropsWithoutRef } from 'react'

type GalleryImageContentProps = {
  imageClassName?: string
  containerClassName?: string
  sizes?: string
  imageProps: GalleryImageProps
}

type GalleryImageFrameProps = ComponentPropsWithoutRef<'div'> & GalleryImageContentProps
type GalleryImageButtonProps = ComponentPropsWithoutRef<'button'> & GalleryImageContentProps

function GalleryImageContent({
  imageClassName,
  containerClassName,
  sizes,
  imageProps
}: GalleryImageContentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { alt, height, width, ...restImageProps } = imageProps

  return (
    <div
      data-slot="gallery-image-media"
      className={cn('bg-muted/40 relative h-full w-full overflow-hidden', containerClassName)}
    >
      <Image
        fill
        alt={alt}
        className={cn(
          'object-cover transition-opacity duration-300 pointer-fine:group-hover:opacity-90 group-focus-visible:opacity-90',
          imageClassName
        )}
        sizes={sizes}
        {...restImageProps}
      />
      {alt && (
        <div
          data-slot="gallery-image-caption"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-end bg-linear-to-t from-black/70 to-transparent p-3 opacity-0 transition-[opacity,transform] duration-300 ease-out pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          <span className="text-sm font-medium text-white">{alt}</span>
        </div>
      )}
    </div>
  )
}

export function GalleryImageFrame({
  imageClassName,
  containerClassName,
  sizes,
  imageProps,
  className,
  children,
  ...divProps
}: GalleryImageFrameProps) {
  return (
    <div
      data-slot="gallery-image-frame"
      className={cn(
        'group relative cursor-pointer overflow-hidden ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...divProps}
    >
      <GalleryImageContent
        imageClassName={imageClassName}
        containerClassName={containerClassName}
        sizes={sizes}
        imageProps={imageProps}
      />
      {children}
    </div>
  )
}

export function GalleryImageButton({
  imageClassName,
  containerClassName,
  sizes,
  imageProps,
  className,
  children,
  ...buttonProps
}: GalleryImageButtonProps) {
  return (
    <button
      data-slot="gallery-image-button"
      className={cn(
        'group relative cursor-pointer overflow-hidden ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'appearance-none border-0 bg-transparent p-0 text-left',
        className
      )}
      {...buttonProps}
    >
      <GalleryImageContent
        imageClassName={imageClassName}
        containerClassName={containerClassName}
        sizes={sizes}
        imageProps={imageProps}
      />
      {children}
    </button>
  )
}
