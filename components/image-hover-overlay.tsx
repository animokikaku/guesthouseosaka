export function ImageHoverOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-end bg-linear-to-t from-black/80 to-transparent p-3 opacity-0 transition duration-100 group-hover:translate-y-0 group-hover:opacity-100">
      <span aria-hidden className="text-sm font-medium text-white">
        {children}
      </span>
    </div>
  )
}
