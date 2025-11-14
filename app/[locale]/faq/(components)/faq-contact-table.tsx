import { useExtracted } from 'next-intl'

export function FAQContactTable() {
  const t = useExtracted()

  const phones = [
    {
      title: t('Orange House'),
      withinJapan: t('06-6627-0790'),
      overseas: t('+81-6-6131-6677')
    },
    {
      title: t('Apple House'),
      withinJapan: t('06-6131-6677'),
      overseas: t('+81-6-6131-6677')
    },
    {
      title: t('Lemon House'),
      withinJapan: t('06-6627-0790'),
      overseas: t('+81-6-6131-6677')
    }
  ]

  return (
    <table id="phone" className="border-collapse text-sm">
      <thead>
        <tr>
          <th className="border-border border-b p-2 text-left"></th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('Within Japan')}
          </th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('From overseas')}
          </th>
        </tr>
      </thead>
      <tbody className="font-mono">
        {phones.map((phone) => (
          <tr
            className="border-border/50 last:border-border border-none"
            key={phone.title}
          >
            <td className="text-muted-foreground p-2 font-sans">
              {phone.title}
            </td>
            <td className="p-2 text-center">
              <a
                href={`tel:${phone.withinJapan}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {phone.withinJapan}
              </a>
            </td>
            <td className="p-2 text-center">
              <a
                href={`tel:${phone.overseas}`}
                className="text-foreground hover:text-primary transition-colors"
              >
                {phone.overseas}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
