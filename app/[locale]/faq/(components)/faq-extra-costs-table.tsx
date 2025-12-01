import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { HouseIdentifier, HouseIdentifierSchema } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

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
  const houses = useHouseLabels()

  const headers = HouseIdentifierSchema.options.map((house) => ({
    name: houses[house].name,
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

  const rows: {
    id: string
    label: string
    answers: Record<HouseIdentifier, AnswerValue>
  }[] = [
    {
      id: 'deposit',
      label: t('deposit'),
      answers: {
        orange: t('deposit_amount', { amount: '30000' }),
        lemon: t('deposit_amount', { amount: '30000' }),
        apple: t('deposit_amount', { amount: '30000' })
      }
    },
    {
      id: 'service-fees',
      label: t('common_fees'),
      answers: {
        orange: t('price_per_month', { price: '12000' }),
        lemon: t('price_per_month', { price: '10000' }),
        apple: t('price_per_month', { price: '10000' })
      }
    },
    {
      id: 'utility-fees',
      label: t('utility_fees'),
      answers: {
        orange: [
          t('seasonal_rates.summer_winter', {
            min: '3000',
            max: '6000'
          }),
          t('seasonal_rates.spring_autumn', {
            min: '2000',
            max: '3000'
          })
        ],
        lemon: [
          t('seasonal_rates.summer_winter', {
            min: '3000',
            max: '7000'
          }),
          t('seasonal_rates.spring_autumn', {
            min: '2000',
            max: '4000'
          })
        ],
        apple: [
          t('seasonal_rates.summer_winter', {
            min: '3000',
            max: '7000'
          }),
          t('seasonal_rates.spring_autumn', {
            min: '2000',
            max: '4000'
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
          price: '100',
          minutes: '30'
        }),
        lemon: t('price_per_minutes', {
          price: '100',
          minutes: '20'
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
                {HouseIdentifierSchema.options.map((house) => (
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
