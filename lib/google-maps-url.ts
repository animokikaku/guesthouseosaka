const googleMapsHostnames = new Set(['maps.app.goo.gl', 'maps.google.com'])

export function getGoogleMapsUrl(value: string | undefined) {
  if (!value) return undefined

  try {
    const url = new URL(value)

    if (
      url.protocol !== 'https:' ||
      !googleMapsHostnames.has(url.hostname) ||
      url.username ||
      url.password ||
      url.port
    ) {
      return undefined
    }

    return url.href
  } catch {
    return undefined
  }
}
