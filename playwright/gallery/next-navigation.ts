// Stub for the story sandbox, which runs outside Next.js's app router: no
// route params and no selected segment, as on the site's root page.
export function useParams() {
  return {}
}

export function useSelectedLayoutSegment() {
  return null
}
