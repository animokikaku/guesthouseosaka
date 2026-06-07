"use client"

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import * as React from "react";

import { cn } from "@/lib/utils";

function resolveClassName<S>(
  className: string | ((state: S) => string | undefined) | undefined,
  state: S
): string | undefined {
  return typeof className === "function" ? className(state) : className
}

const drawerPopupClassName = cn(
  "group/popup relative flex w-full max-h-[calc(80vh+var(--bleed))] flex-col overflow-hidden text-sm",
  "[--bleed:3rem] border-border border-t bg-popover text-popover-foreground overscroll-contain data-swiping:select-none",
  "rounded-t-xl -mb-(--bleed) pb-[calc(1.5rem+env(safe-area-inset-bottom,0)+var(--bleed))]",
  "h-(--drawer-height,auto) shadow-[0_2px_10px_rgb(0_0_0/0.1)]",
  "origin-[50%_calc(100%-var(--bleed))]",
  "transform-[translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)))]",
  "data-swiping:duration-0 data-ending-style:shadow-[0_2px_10px_rgb(0_0_0/0)]",
  "data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]",
  "data-ending-style:transform-[translateY(calc(100%-var(--bleed)))]",
  "data-starting-style:transform-[translateY(calc(100%-var(--bleed)))]",
  "[transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),height_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)]"
)

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return (
    <DrawerPrimitive.Root data-slot="drawer" swipeDirection="down" {...props} />
  )
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ className, ...props }: DrawerPrimitive.Portal.Props) {
  return (
    <DrawerPrimitive.Portal
      data-slot="drawer-portal"
      className={(state) =>
        cn("fixed inset-0 z-50", resolveClassName(className, state))
      }
      {...props}
    />
  )
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
      className={(state) =>
        cn(
          "[--backdrop-opacity:0.1] [--bleed:3rem] dark:[--backdrop-opacity:0.5] fixed inset-0 z-50 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute supports-backdrop-filter:backdrop-blur-xs",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  container,
  ...props
}: DrawerPrimitive.Popup.Props & {
  container?: DrawerPrimitive.Portal.Props["container"]
}) {
  return (
    <DrawerPortal container={container}>
      <DrawerOverlay />
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        className="fixed inset-0 z-50 flex items-end justify-center"
      >
        <DrawerPrimitive.Popup
          data-slot="drawer-popup"
          className={(state) =>
            cn(drawerPopupClassName, resolveClassName(className, state))
          }
          {...props}
        >
          <div className="mx-auto mt-4 h-1 w-[100px] shrink-0 rounded-full bg-muted" />
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            className="flex min-h-0 flex-1 flex-col outline-none"
          >
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
        "flex shrink-0 flex-col gap-0.5 p-4 text-center md:gap-1.5 md:text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn(
        "no-scrollbar min-h-0 flex-1 touch-auto overflow-y-auto overscroll-contain px-4",
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
      className={cn("mt-auto flex shrink-0 flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={(state) =>
        cn(
          "font-heading font-medium text-foreground",
          resolveClassName(className, state)
        )
      }
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
      className={(state) =>
        cn(
          "text-sm text-muted-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

export {
    Drawer,
    DrawerBody,
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
