'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '@/lib/utils'

function GalleryDialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="gallery-dialog" {...props} />
}

function GalleryDialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="gallery-dialog-portal" {...props} />
}

function GalleryDialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="gallery-dialog-overlay"
      className={cn(
        'fixed inset-0 z-60 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
        className
      )}
      {...props}
    />
  )
}

function GalleryDialogContent({
  className,
  overlayClassName,
  children,
  ...props
}: DialogPrimitive.Popup.Props & {
  overlayClassName?: string
}) {
  return (
    <GalleryDialogPortal>
      <GalleryDialogOverlay className={overlayClassName} />
      <DialogPrimitive.Popup
        data-slot="gallery-dialog-content"
        className={cn(
          'fixed inset-0 z-60 bg-background text-foreground outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Popup>
    </GalleryDialogPortal>
  )
}

function GalleryDialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="gallery-dialog-close" {...props} />
}

function GalleryDialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="gallery-dialog-title"
      className={cn('font-heading leading-none font-medium', className)}
      {...props}
    />
  )
}

function GalleryDialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="gallery-dialog-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  GalleryDialog,
  GalleryDialogClose,
  GalleryDialogContent,
  GalleryDialogDescription,
  GalleryDialogTitle
}
