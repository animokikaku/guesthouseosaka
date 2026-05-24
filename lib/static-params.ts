export function staticParamsForLocales<T extends string>(
  locales: readonly string[],
  items: { slug: string }[],
  slugKey: T
): Array<Record<'locale' | T, string>> {
  return locales.flatMap((locale) =>
    items.map(({ slug }) => ({ locale, [slugKey]: slug }) as Record<'locale' | T, string>)
  )
}
