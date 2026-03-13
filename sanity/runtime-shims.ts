const globalWithDomConstructors = globalThis as typeof globalThis & {
  DocumentFragment?: typeof DocumentFragment
  Element?: typeof Element
  HTMLElement?: typeof HTMLElement
  Node?: typeof Node
  SVGElement?: typeof SVGElement
  window?: Window & typeof globalThis
}

if (
  typeof globalWithDomConstructors.Element === 'undefined' &&
  globalWithDomConstructors.window?.Element
) {
  globalWithDomConstructors.Element = globalWithDomConstructors.window.Element
}

if (
  typeof globalWithDomConstructors.HTMLElement === 'undefined' &&
  globalWithDomConstructors.window?.HTMLElement
) {
  globalWithDomConstructors.HTMLElement = globalWithDomConstructors.window.HTMLElement
}

if (
  typeof globalWithDomConstructors.Node === 'undefined' &&
  globalWithDomConstructors.window?.Node
) {
  globalWithDomConstructors.Node = globalWithDomConstructors.window.Node
}

if (
  typeof globalWithDomConstructors.DocumentFragment === 'undefined' &&
  globalWithDomConstructors.window?.DocumentFragment
) {
  globalWithDomConstructors.DocumentFragment = globalWithDomConstructors.window.DocumentFragment
}

if (
  typeof globalWithDomConstructors.SVGElement === 'undefined' &&
  globalWithDomConstructors.window?.SVGElement
) {
  globalWithDomConstructors.SVGElement = globalWithDomConstructors.window.SVGElement
}
