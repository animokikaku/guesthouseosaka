import type { HousesBuildingQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'

type FAQContactTableProps = {
  houses: HousesBuildingQueryResult
}

export function FAQContactTable({ houses }: FAQContactTableProps) {
  const t = useTranslations('FAQContactTable')

  const phones = houses.map((house) => ({
    title: house.title ?? house.slug,
    withinJapan: house.phone?.domestic,
    overseas: house.phone?.international
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
