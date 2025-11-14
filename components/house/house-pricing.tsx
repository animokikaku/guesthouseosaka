import { HouseIdentifier } from '@/lib/types'
import { getExtracted } from 'next-intl/server'

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
  const t = await getExtracted()

  const { rows, notes } = {
    apple: {
      rows: [
        {
          label: t('Rent'),
          value: t('¥50,000 ~ ¥70,000 per month (up to 2 people per room)')
        },
        {
          label: t('Short Stay'),
          value: [
            t('¥80,000 ~ ¥95,000 per month.'),
            t('Stays under 3 months: All fees included.'),
            t('Minimum stay: 1 month.')
          ]
        }
      ],
      notes: [
        {
          title: t('Long Stay Discount'),
          items: [t('Discounts for 3-month and 6-month stays.')]
        },
        {
          title: t('Other Fees'),
          items: [
            t('Service fee: ¥10,000 per month'),
            t('Utilities: About ¥3,000 per month (you pay what you use)'),
            t('Deposit: ¥30,000 (returned when you leave, if no damage)')
          ]
        }
      ]
    },
    lemon: {
      rows: [
        {
          label: t('Rent'),
          value: t('¥50,000 ~ ¥70,000 per month (up to 2 people per room)')
        },
        {
          label: t('Short Stay'),
          value: [
            t('¥80,000 ~ ¥95,000 per month.'),
            t('Stays under 3 months: All fees included.'),
            t('Minimum stay: 1 month.')
          ]
        },
        {
          label: t('Dormitory Plan'),
          value: [
            t('¥45,000 per month (includes utilities and service fee)'),
            t('Co-ed, 3 beds per room, shared bathroom and kitchen.'),
            t('Minimum stay: 1 month.')
          ]
        }
      ],
      notes: [
        {
          title: t('Long Stay Discount'),
          items: [t('Discounts for 3-month and 6-month stays.')]
        },
        {
          title: t('Other Fees'),
          items: [
            t('Service fee: ¥10,000 per month'),
            t('Utilities: About ¥3,000 per month (you pay what you use)'),
            t('Deposit: ¥30,000 (returned when you leave, if no damage)'),
            t('Washing machine: Free (on rooftop)'),
            t('Dryer: ¥100 per 20 minutes')
          ]
        }
      ]
    },
    orange: {
      rows: [
        {
          label: t('Rent'),
          value: [
            t('¥40,000 ~ ¥48,000 per month (1 person)'),
            t('+¥5,000 per month for second person')
          ]
        }
      ],
      notes: [
        {
          title: t('Long Stay Discount'),
          items: [
            t('2nd month: Save ¥1,000'),
            t('3rd month: Save ¥2,000'),
            t('After 6 months: Save ¥5,000 every month')
          ]
        },
        {
          title: t('Other Fees'),
          items: [
            t('Service fee: ¥12,000 per month'),
            t(
              'Utilities: About ¥3,000 ~ ¥4,000 per month (you pay what you use)'
            ),
            t('Washing machine: Free'),
            t('Dryer: ¥100'),
            t('Deposit: ¥30,000 (returned when you leave, if no damage)')
          ]
        }
      ]
    }
  }[id]

  return (
    <section className="pb-8" id="pricing">
      <h2 className="mb-6 text-2xl font-semibold">{t('Pricing')}</h2>
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
