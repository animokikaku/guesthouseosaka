import {
  HouseSection,
  HouseSectionContent,
  HouseSectionHeading
} from '@/components/house/house-section'
import type { PricingRowData } from '@/lib/types/components'
import type { PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import { useTranslations } from 'next-intl'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-muted-foreground text-sm whitespace-pre-line">
        {children}
      </p>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-muted-foreground list-disc space-y-1 pl-3 text-sm">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="text-muted-foreground list-decimal space-y-1 pl-3 text-sm">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>
  }
}

interface HousePricingProps {
  pricing: PricingRowData[]
}

export function HousePricing({ pricing }: HousePricingProps) {
  const t = useTranslations('HousePricing')

  if (pricing.length === 0) {
    return null
  }

  return (
    <HouseSection id="pricing" aria-labelledby="pricing-title" className="pb-8">
      <HouseSectionHeading id="pricing-title">
        {t('heading')}
      </HouseSectionHeading>
      <HouseSectionContent>
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
                  <PortableText
                    value={row.content}
                    components={portableTextComponents}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </HouseSectionContent>
    </HouseSection>
  )
}
