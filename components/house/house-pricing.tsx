import { compactPortableText } from '@/lib/portable-text'
import type { PricingRowData } from '@/lib/types/components'
import { PortableText } from '@portabletext/react'
import { useTranslations } from 'next-intl'

interface HousePricingProps {
  pricing: PricingRowData[]
}

export function HousePricing({ pricing }: HousePricingProps) {
  const t = useTranslations('HousePricing')

  if (pricing.length === 0) {
    return null
  }

  return (
    <section className="pb-8" id="pricing">
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="border-border overflow-hidden rounded-lg border">
        {pricing.map((row) => (
          <div
            key={row._key}
            className="border-border/50 flex flex-col border-b last:border-b-0 md:flex-row"
          >
            <div className="bg-muted/50 border-border/50 border-b px-6 py-4 md:w-1/3 md:shrink-0 md:border-r md:border-b-0">
              <h4 className="text-foreground font-medium">{row.label}</h4>
            </div>
            <div className="space-y-1 px-6 py-4 md:flex-1">
              {row.content && (
                <PortableText value={row.content} components={compactPortableText} />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
