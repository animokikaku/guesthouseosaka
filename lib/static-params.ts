export function staticParamsForLocales<T extends string>(
  locales: readonly string[],
  items: { slug: string }[],
  slugKey: T
): Array<Record<'locale' | T, string>> {
  // The computed property and locale exhaustively initialize the returned record.
  // oxlint-disable typescript/no-unsafe-type-assertion
  return locales.flatMap((locale) =>
    items.map(({ slug }) => ({ locale, [slugKey]: slug }) as Record<'locale' | T, string>)
  )
}
// oxlint-enable typescript/no-unsafe-type-assertion
