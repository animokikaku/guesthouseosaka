import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { HouseIdentifier, HouseIdentifierValues } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useFormatter, useTranslations } from 'next-intl'

type AnswerValue = string | string[]

const renderAnswer = (value: AnswerValue) => {
  const lines = Array.isArray(value) ? value : [value]

  return (
    <div className="space-y-1">
      {lines.map((line, index) => (
        <p key={index} className="leading-relaxed text-wrap">
          {line}
        </p>
      ))}
    </div>
  )
}

const ACCENT_CLASSES = {
  orange: 'text-orange-600',
  apple: 'text-red-600',
  lemon: 'text-yellow-600'
}

function FAQExtraCostsTableHeader() {
  const houseLabel = useHouseLabels()

  const headers = HouseIdentifierValues.map((house) => ({
    name: houseLabel(house).name,
    accentClass: ACCENT_CLASSES[house]
  }))

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="bg-secondary text-foreground font-semibold" />
        {headers.map(({ name, accentClass }) => (
          <TableHead
            key={name}
            className={cn('bg-secondary font-semibold capitalize', accentClass)}
          >
            {name}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}

export function FAQExtraCostsTable() {
  const t = useTranslations('FAQExtraCostsTable')
  const formatter = useFormatter()

  const rows: {
    id: string
    label: string
    answers: Record<HouseIdentifier, AnswerValue>
  }[] = [
    {
      id: 'deposit',
      label: t('deposit'),
      answers: {
        orange: formatter.number(30000, 'currency'),
        lemon: formatter.number(30000, 'currency'),
        apple: formatter.number(30000, 'currency')
      }
    },
    {
      id: 'service-fees',
      label: t('common_fees'),
      answers: {
        orange: t('price_per_month', {
          price: formatter.number(12000, 'currency')
        }),
        lemon: t('price_per_month', {
          price: formatter.number(10000, 'currency')
        }),
        apple: t('price_per_month', {
          price: formatter.number(10000, 'currency')
        })
      }
    },
    {
      id: 'utility-fees',
      label: t('utility_fees'),
      answers: {
        orange: [
          t('seasonal_rates.summer_winter', {
            min: formatter.number(3000, 'currency'),
            max: formatter.number(6000, 'currency')
          }),
          t('seasonal_rates.spring_autumn', {
            min: formatter.number(2000, 'currency'),
            max: formatter.number(3000, 'currency')
          })
        ],
        lemon: [
          t('seasonal_rates.summer_winter', {
            min: formatter.number(3000, 'currency'),
            max: formatter.number(7000, 'currency')
          }),
          t('seasonal_rates.spring_autumn', {
            min: formatter.number(2000, 'currency'),
            max: formatter.number(4000, 'currency')
          })
        ],
        apple: [
          t('seasonal_rates.summer_winter', {
            min: formatter.number(3000, 'currency'),
            max: formatter.number(7000, 'currency')
          }),
          t('seasonal_rates.spring_autumn', {
            min: formatter.number(2000, 'currency'),
            max: formatter.number(4000, 'currency')
          })
        ]
      }
    },
    {
      id: 'water-bill',
      label: t('water_bill'),
      answers: {
        orange: t('free'),
        lemon: t('free'),
        apple: t('free')
      }
    },
    {
      id: 'laundromat',
      label: t('laundromat'),
      answers: {
        orange: t('free'),
        lemon: t('free'),
        apple: t('private_washer')
      }
    },
    {
      id: 'drying-machine',
      label: t('drying_machine'),
      answers: {
        orange: t('price_per_minutes', {
          price: formatter.number(100, 'currency'),
          minutes: formatter.number(30, 'minute')
        }),
        lemon: t('price_per_minutes', {
          price: formatter.number(100, 'currency'),
          minutes: formatter.number(20, 'minute')
        }),
        apple: '–'
      }
    },
    {
      id: 'internet',
      label: t('internet'),
      answers: {
        orange: t('free_wifi_lan'),
        lemon: t('free_wifi'),
        apple: t('free_wifi')
      }
    }
  ]

  return (
    <div className="space-y-2">
      <div className="border-border overflow-hidden rounded-xs border">
        <Table className="w-full">
          <FAQExtraCostsTableHeader />
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-foreground font-medium">
                  <span>{row.label}</span>
                </TableCell>
                {HouseIdentifierValues.map((house) => (
                  <TableCell key={house}>
                    {renderAnswer(row.answers[house])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
