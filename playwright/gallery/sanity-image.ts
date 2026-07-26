const image =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22800%22 viewBox=%220 0 1200 800%22%3E%3Crect width=%221200%22 height=%22800%22 fill=%22%23d6d3d1%22/%3E%3C/svg%3E'

export function urlFor() {
  const builder = {
    auto: () => builder,
    dpr: () => builder,
    fit: () => builder,
    height: () => builder,
    quality: () => builder,
    url: () => image,
    width: () => builder
  }

  return builder
}
