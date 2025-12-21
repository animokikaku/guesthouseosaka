import type { HouseQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'

type HousePricingProps = {
  pricing: NonNullable<HouseQueryResult>['pricing']
}

export function HousePricing({ pricing }: HousePricingProps) {
  const t = useTranslations('HousePricing')
  const rows = pricing?.rows ?? []
  const notes = pricing?.notes ?? []

  if (rows.length === 0 && notes.length === 0) {
    return null
  }

  return (
    <section className="pb-8" id="pricing">
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="w-full">
          <tbody>
            {rows.map((row) => (
              <tr key={row._key} className="border-border/50 border-b">
                <td className="border-border bg-muted/50 border-r px-6 py-4 align-top">
                  <h4 className="text-foreground font-medium">{row.label}</h4>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="text-muted-foreground whitespace-pre-line text-sm">
                    {row.values}
                  </div>
                </td>
              </tr>
            ))}
            {notes.map((note) => {
              const items = note.items ?? []
              return (
                <tr
                  key={note._key}
                  className="border-border/50 border-b last:border-b-0"
                >
                  <td className="border-border bg-muted/50 border-r px-6 py-4 align-top">
                    <h4 className="text-foreground font-medium">{note.title}</h4>
                  </td>
                  <td className="px-6 py-4 align-top">
                    {items.length > 1 ? (
                      <ul className="text-muted-foreground list-disc space-y-1 pl-3 text-sm">
                        {items.map((item) => (
                          <li key={item._key}>{item.text}</li>
                        ))}
                      </ul>
                    ) : items.length === 1 ? (
                      <p className="text-muted-foreground text-sm">
                        {items[0].text}
                      </p>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
