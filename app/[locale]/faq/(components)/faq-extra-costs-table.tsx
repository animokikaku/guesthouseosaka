import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { HouseIdentifier } from '@/lib/types'
import { useExtracted } from 'next-intl'

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
  const t = useExtracted()

  const rows: {
    id: string
    label: string
    answers: Record<HouseIdentifier, AnswerValue>
  }[] = [
    {
      id: 'deposit',
      label: t('Deposit'),
      answers: {
        orange: '¥30,000',
        lemon: '¥30,000',
        apple: '¥30,000'
      }
    },
    {
      id: 'service-fees',
      label: t('Common fees'),
      answers: {
        orange: t('¥{price}/month', { price: '12000' }),
        lemon: t('¥{price}/month', { price: '10000' }),
        apple: t('¥{price}/month', { price: '10000' })
      }
    },
    {
      id: 'utility-fees',
      label: t('Utility fees'),
      answers: {
        orange: [
          t('Summer/Winter: ¥{min}-¥{max}', { min: '3000', max: '6000' }),
          t('Spring/Autumn: ¥{min}-¥{max}', { min: '2000', max: '3000' })
        ],
        lemon: [
          t('Summer/Winter: ¥{min}-¥{max}', { min: '3000', max: '7000' }),
          t('Spring/Autumn: ¥{min}-¥{max}', { min: '2000', max: '4000' })
        ],
        apple: [
          t('Summer/Winter: ¥{min}-¥{max}', { min: '3000', max: '7000' }),
          t('Spring/Autumn: ¥{min}-¥{max}', { min: '2000', max: '4000' })
        ]
      }
    },
    {
      id: 'water-bill',
      label: t('Water bill'),
      answers: {
        orange: t('Free'),
        lemon: t('Free'),
        apple: t('Free')
      }
    },
    {
      id: 'laundromat',
      label: t('Laundromat'),
      answers: {
        orange: t('Free'),
        lemon: t('Free'),
        apple: t('Each room has a private washing machine.')
      }
    },
    {
      id: 'drying-machine',
      label: t('Drying machine'),
      answers: {
        orange: t('¥{price}/{minutes}min', {
          price: '100',
          minutes: '30'
        }),
        lemon: t('¥{price}/{minutes}min', {
          price: '100',
          minutes: '20'
        }),
        apple: t('–')
      }
    },
    {
      id: 'internet',
      label: t('Internet'),
      answers: {
        orange: t('Free Wi-Fi/LAN'),
        lemon: t('Free Wi-Fi'),
        apple: t('Free Wi-Fi')
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
                {t('Orange House')}
              </TableHead>
              <TableHead
                key="apple"
                className="bg-secondary font-semibold text-red-600 capitalize"
              >
                {t('Apple House')}
              </TableHead>
              <TableHead
                key="lemon"
                className="bg-secondary font-semibold text-yellow-600 capitalize"
              >
                {t('Lemon House')}
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
