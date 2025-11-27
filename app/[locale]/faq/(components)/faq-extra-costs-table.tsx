import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { HouseIdentifier } from '@/lib/types'
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

export function FAQExtraCostsTable() {
  const t = useTranslations()

  const rows: {
    id: string
    label: string
    answers: Record<HouseIdentifier, AnswerValue>
  }[] = [
    {
      id: 'deposit',
      label: t('faq.costs.deposit'),
      answers: {
        orange: '¥30,000',
        lemon: '¥30,000',
        apple: '¥30,000'
      }
    },
    {
      id: 'service-fees',
      label: t('faq.costs.commonFees'),
      answers: {
        orange: t('faq.costs.pricePerMonth', { price: '12000' }),
        lemon: t('faq.costs.pricePerMonth', { price: '10000' }),
        apple: t('faq.costs.pricePerMonth', { price: '10000' })
      }
    },
    {
      id: 'utility-fees',
      label: t('faq.costs.utilityFees'),
      answers: {
        orange: [
          t('faq.costs.seasonalRates.summerWinter', {
            min: '3000',
            max: '6000'
          }),
          t('faq.costs.seasonalRates.springAutumn', {
            min: '2000',
            max: '3000'
          })
        ],
        lemon: [
          t('faq.costs.seasonalRates.summerWinter', {
            min: '3000',
            max: '7000'
          }),
          t('faq.costs.seasonalRates.springAutumn', {
            min: '2000',
            max: '4000'
          })
        ],
        apple: [
          t('faq.costs.seasonalRates.summerWinter', {
            min: '3000',
            max: '7000'
          }),
          t('faq.costs.seasonalRates.springAutumn', {
            min: '2000',
            max: '4000'
          })
        ]
      }
    },
    {
      id: 'water-bill',
      label: t('faq.costs.waterBill'),
      answers: {
        orange: t('faq.costs.free'),
        lemon: t('faq.costs.free'),
        apple: t('faq.costs.free')
      }
    },
    {
      id: 'laundromat',
      label: t('faq.costs.laundromat'),
      answers: {
        orange: t('faq.costs.free'),
        lemon: t('faq.costs.free'),
        apple: t('faq.costs.privateWasher')
      }
    },
    {
      id: 'drying-machine',
      label: t('faq.costs.dryingMachine'),
      answers: {
        orange: t('faq.costs.pricePerMinutes', {
          price: '100',
          minutes: '30'
        }),
        lemon: t('faq.costs.pricePerMinutes', {
          price: '100',
          minutes: '20'
        }),
        apple: t('faq.costs.dash')
      }
    },
    {
      id: 'internet',
      label: t('faq.costs.internet'),
      answers: {
        orange: t('faq.costs.freeWifiLan'),
        lemon: t('faq.costs.freeWifi'),
        apple: t('faq.costs.freeWifi')
      }
    }
  ]

  return (
    <div className="space-y-2">
      <div className="border-border overflow-hidden rounded-xs border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-secondary text-foreground font-semibold" />
              <TableHead
                key="orange"
                className="bg-secondary font-semibold text-orange-600 capitalize"
              >
                {t('houses.orange.name')}
              </TableHead>
              <TableHead
                key="apple"
                className="bg-secondary font-semibold text-red-600 capitalize"
              >
                {t('houses.apple.name')}
              </TableHead>
              <TableHead
                key="lemon"
                className="bg-secondary font-semibold text-yellow-600 capitalize"
              >
                {t('houses.lemon.name')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="text-foreground font-medium">
                  <span>{row.label}</span>
                </TableCell>
                <TableCell key="orange">
                  {renderAnswer(row.answers.orange)}
                </TableCell>
                <TableCell key="apple">
                  {renderAnswer(row.answers.apple)}
                </TableCell>
                <TableCell key="lemon">
                  {renderAnswer(row.answers.lemon)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
