"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import * as React from "react";

import { cn } from "@/lib/utils";

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
        "transition-opacity duration-300 ease-out data-swiping:duration-0",
        "data-starting-style:opacity-0 data-ending-style:opacity-0",
        "data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)]",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Viewport className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
        <DrawerPrimitive.Popup
          data-slot="drawer-content"
          className={cn(
            "group/drawer-content z-50 flex h-auto w-full max-h-[80vh] flex-col rounded-t-xl rounded-b-none border-t bg-popover text-sm text-popover-foreground outline-none",
            "transform-[translateY(var(--drawer-swipe-movement-y,0px))] transition-transform duration-300 ease-out data-swiping:duration-0",
            "data-starting-style:translate-y-full data-ending-style:translate-y-full",
            "data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)]",
            className
          )}
          {...props}
        >
          <div className="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted" />
          <DrawerPrimitive.Content className="contents">
            {children}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-heading font-medium text-foreground", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger
};
