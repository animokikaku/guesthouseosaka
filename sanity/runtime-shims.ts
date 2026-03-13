const globalWithDomConstructors = globalThis as typeof globalThis & {
  DocumentFragment?: typeof DocumentFragment
  Element?: typeof Element
  HTMLElement?: typeof HTMLElement
  Node?: typeof Node
  SVGElement?: typeof SVGElement
  window?: Window & typeof globalThis
}

const domConstructors = [
  'Element',
  'HTMLElement',
  'Node',
  'DocumentFragment',
  'SVGElement'
] as const

for (const key of domConstructors) {
  if (
    typeof globalWithDomConstructors[key] === 'undefined' &&
    globalWithDomConstructors.window?.[key]
  ) {
    globalWithDomConstructors[key] = globalWithDomConstructors.window[key]
  }
}
