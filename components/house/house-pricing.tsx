import { HouseIdentifier } from '@/lib/types'
import { getTranslations } from 'next-intl/server'

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

export async function HousePricing({ id }: { id: HouseIdentifier }) {
  const t = await getTranslations('pricing')
  const labels = {
    rent: t('labels.rent'),
    shortStay: t('labels.shortStay'),
    dormitoryPlan: t('labels.dormitoryPlan'),
    otherFees: t('labels.otherFees'),
    longStay: t('labels.longStay')
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
            t('apple.shortStay.rate'),
            t('apple.shortStay.allFees'),
            t('apple.shortStay.minimum')
          ]
        }
      ],
      notes: [
        {
          title: labels.longStay,
          items: [t('apple.longStay')]
        },
        {
          title: labels.otherFees,
          items: [
            t('apple.otherFees.serviceFee'),
            t('apple.otherFees.utilities'),
            t('apple.otherFees.deposit')
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
            t('lemon.shortStay.rate'),
            t('lemon.shortStay.allFees'),
            t('lemon.shortStay.minimum')
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
          items: [t('lemon.longStay')]
        },
        {
          title: labels.otherFees,
          items: [
            t('lemon.otherFees.serviceFee'),
            t('lemon.otherFees.utilities'),
            t('lemon.otherFees.deposit'),
            t('lemon.otherFees.washingMachine'),
            t('lemon.otherFees.dryer')
          ]
        }
      ]
    },
    orange: {
      rows: [
        {
          label: labels.rent,
          value: [t('orange.rent.base'), t('orange.rent.secondPerson')]
        }
      ],
      notes: [
        {
          title: labels.longStay,
          items: [
            t('orange.longStay.secondMonth'),
            t('orange.longStay.thirdMonth'),
            t('orange.longStay.afterSixMonths')
          ]
        },
        {
          title: labels.otherFees,
          items: [
            t('orange.otherFees.serviceFee'),
            t('orange.otherFees.utilities'),
            t('orange.otherFees.washingMachine'),
            t('orange.otherFees.dryer'),
            t('orange.otherFees.deposit')
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
