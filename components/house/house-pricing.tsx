import { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'

type PricingValue = string | string[]

const renderValue = (value: PricingValue) => {
  const lines = Array.isArray(value) ? value : [value]

  return (
    <div className="text-muted-foreground space-y-1 text-sm">
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  )
}

export function HousePricing({ id }: { id: HouseIdentifier }) {
  const t = useTranslations('HousePricing')
  const labels = {
    rent: t('labels.rent'),
    shortStay: t('labels.short_stay'),
    dormitoryPlan: t('labels.dormitory_plan'),
    otherFees: t('labels.other_fees'),
    longStay: t('labels.long_stay')
  }

  const { rows, notes } = {
    apple: {
      rows: [
        {
          label: labels.rent,
          value: t('apple.rent')
        },
        {
          label: labels.shortStay,
          value: [
            t('apple.short_stay.rate'),
            t('apple.short_stay.all_fees'),
            t('apple.short_stay.minimum')
          ]
        }
      ],
      notes: [
        {
          title: labels.longStay,
          items: [t('apple.long_stay')]
        },
        {
          title: labels.otherFees,
          items: [
            t('apple.other_fees.common_fee'),
            t('apple.other_fees.utilities'),
            t('apple.other_fees.deposit')
          ]
        }
      ]
    },
    lemon: {
      rows: [
        {
          label: labels.rent,
          value: t('lemon.rent')
        },
        {
          label: labels.shortStay,
          value: [
            t('lemon.short_stay.rate'),
            t('lemon.short_stay.all_fees'),
            t('lemon.short_stay.minimum')
          ]
        },
        {
          label: labels.dormitoryPlan,
          value: [
            t('lemon.dormitory.rate'),
            t('lemon.dormitory.details'),
            t('lemon.dormitory.minimum')
          ]
        }
      ],
      notes: [
        {
          title: labels.longStay,
          items: [t('lemon.long_stay')]
        },
        {
          title: labels.otherFees,
          items: [
            t('lemon.other_fees.service_fee'),
            t('lemon.other_fees.utilities'),
            t('lemon.other_fees.deposit'),
            t('lemon.other_fees.washing_machine'),
          ]
        }
      ]
    },
    orange: {
      rows: [
        {
          label: labels.rent,
          value: [t('orange.rent.base'), t('orange.rent.second_person')]
        }
      ],
      notes: [
        {
          title: labels.longStay,
          items: [
            t('orange.long_stay.second_month'),
            t('orange.long_stay.third_month'),
            t('orange.long_stay.after_six_months')
          ]
        },
        {
          title: labels.otherFees,
          items: [
            t('orange.other_fees.service_fee'),
            t('orange.other_fees.utilities'),
            t('orange.other_fees.washing_machine'),
            t('orange.other_fees.dryer'),
            t('orange.other_fees.deposit')
          ]
        }
      ]
    }
  }[id]

  return (
    <section className="pb-8" id="pricing">
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="w-full">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className={`border-border/50 border-b`}>
                <td className="border-border bg-muted/50 border-r px-6 py-4 align-top">
                  <h4 className="text-foreground font-medium">{label}</h4>
                </td>
                <td className="px-6 py-4 align-top">{renderValue(value)}</td>
              </tr>
            ))}
            {notes.map(({ title, items }) => (
              <tr
                key={title}
                className={`border-border/50 border-b last:border-b-0`}
              >
                <td className="border-border bg-muted/50 border-r px-6 py-4 align-top">
                  <h4 className="text-foreground font-medium">{title}</h4>
                </td>
                <td className="px-6 py-4 align-top">
                  {items.length > 1 ? (
                    <ul className="text-muted-foreground list-disc space-y-1 pl-3 text-sm">
                      {items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">{items[0]}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
