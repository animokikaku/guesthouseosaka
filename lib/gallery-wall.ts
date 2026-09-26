/**
 * The homepage hero collage: six square tiles scattered across a fixed
 * 634×452 design bound, positioned as percentages so the whole thing scales
 * with its container.
 *
 * One config rather than two: the CDN crop width each tile needs is just its
 * share of `CONTENT_WIDTH`, so `toGalleryImages` derives it here instead of
 * keeping a second, hand-maintained array of pixel sizes in index lockstep
 * with this one.
 */

/** Design-space width the percentages below were measured against. */
const CONTENT_WIDTH = 634

export type GalleryWallSlot = {
  /** Offset from the left edge of the collage, in percent. */
  left: number
  /** Offset from the top edge of the collage, in percent. */
  top: number
  /** Tile width, in percent. Tiles are square. */
  size: number
  /** Tailwind gradient stops tinting this tile. */
  overlay: string
  /**
   * Eagerly loaded and flagged to the browser as the likely LCP element. Only
   * the largest tile carries this — the rest lazy-load.
   */
  priority?: boolean
}

export const GALLERY_WALL_SLOTS: readonly GalleryWallSlot[] = [
  {
    left: 0,
    top: 28.76,
    size: 22.4,
    overlay: 'from-amber-200/80 to-amber-400/40'
  },
  {
    left: 24.6,
    top: 0,
    size: 42.9,
    overlay: 'from-slate-500/70 to-slate-800/60',
    priority: true
  },
  {
    left: 69.4,
    top: 11.5,
    size: 19.4,
    overlay: 'from-stone-400/70 to-stone-700/60'
  },
  {
    left: 18.5,
    top: 62.83,
    size: 26.5,
    overlay: 'from-emerald-400/70 to-emerald-700/50'
  },
  {
    left: 47,
    top: 62.83,
    size: 20.4,
    overlay: 'from-indigo-500/70 to-indigo-800/60'
  },
  {
    left: 69.4,
    top: 41.37,
    size: 30.6,
    overlay: 'from-rose-400/70 to-rose-700/50'
  }
]

/** Intrinsic pixel size to crop a tile to, from its share of the design bound. */
export function slotPixelSize(slot: GalleryWallSlot): number {
  return Math.round((slot.size / 100) * CONTENT_WIDTH)
}

/**
 * Rendered collage width per breakpoint, mirroring the home hero layout in
 * `app/[locale]/page.tsx`: `container-wrapper` (px-2, max-w-7xl) around
 * `container` (px-4, lg:px-8), with the collage full width below md and
 * `md:w-3/5` beside the header above it. Keep in sync with those classes.
 *
 * Each entry is `[minViewportWidth, vwFraction, fixedPx]`, for a width of
 * `vwFraction * 100vw + fixedPx`; the first matching entry wins.
 */
const COLLAGE_WIDTHS: readonly (readonly [minWidth: number, vw: number, px: number])[] = [
  // max-w-7xl caps the wrapper at 1280px: (1280 - 16 - 64) * 0.6
  [1280, 0, 720],
  // lg: (100vw - 16 - 64) * 0.6
  [1024, 0.6, -48],
  // md: (100vw - 16 - 32) * 0.6
  [768, 0.6, -28.8],
  // (100vw - 16 - 32)
  [0, 1, -48]
]

/** `sizes` for a tile, so the browser picks a srcset width by its rendered size. */
export function slotSizes(slot: GalleryWallSlot): string {
  const ratio = slot.size / 100
  return COLLAGE_WIDTHS.map(([minWidth, vw, px]) => {
    const fixed = Math.round(px * ratio)
    const width =
      vw === 0 ? `${fixed}px` : `calc(${+(vw * ratio * 100).toFixed(2)}vw - ${-fixed}px)`
    return minWidth === 0 ? width : `(min-width: ${minWidth}px) ${width}`
  }).join(', ')
}
