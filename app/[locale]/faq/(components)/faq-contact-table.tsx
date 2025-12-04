import { useHouseLabels } from '@/hooks/use-house-labels'
import { useHousePhones } from '@/hooks/use-house-phones'
import { HouseIdentifierValues } from '@/lib/types'
import { useTranslations } from 'next-intl'

export function FAQContactTable() {
  const t = useTranslations('FAQContactTable')
  const houseLabel = useHouseLabels()
  const housePhonesLabel = useHousePhones()

  const phones = HouseIdentifierValues.map((house) => ({
    title: houseLabel(house).name,
    withinJapan: housePhonesLabel(house).domestic,
    overseas: housePhonesLabel(house).international
  }))

  return (
    <table id="phone" className="border-collapse text-sm">
      <thead>
        <tr>
          <th className="border-border border-b p-2 text-left"></th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('within_japan')}
          </th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('from_overseas')}
          </th>
        </tr>
      </thead>
      <tbody className="font-mono">
        {phones.map(({ title, withinJapan, overseas }) => (
          <tr
            className="border-border/50 last:border-border border-none"
            key={title}
          >
            <td className="text-muted-foreground p-2 font-sans">{title}</td>
            <td className="p-2 text-center">
              <a
                href={`tel:${withinJapan}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {withinJapan}
              </a>
            </td>
            <td className="p-2 text-center">
              <a
                href={`tel:${overseas}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {overseas}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
