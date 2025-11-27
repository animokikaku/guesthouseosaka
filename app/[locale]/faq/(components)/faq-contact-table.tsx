import { useTranslations } from 'next-intl'

export function FAQContactTable() {
  const t = useTranslations()

  const phones = [
    {
      title: t('houses.orange.name'),
      withinJapan: t('faq.contact.phones.orange.domestic'),
      overseas: t('faq.contact.phones.orange.international')
    },
    {
      title: t('houses.apple.name'),
      withinJapan: t('faq.contact.phones.apple.domestic'),
      overseas: t('faq.contact.phones.apple.international')
    },
    {
      title: t('houses.lemon.name'),
      withinJapan: t('faq.contact.phones.lemon.domestic'),
      overseas: t('faq.contact.phones.lemon.international')
    }
  ]

  return (
    <table id="phone" className="border-collapse text-sm">
      <thead>
        <tr>
          <th className="border-border border-b p-2 text-left"></th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('faq.contact.withinJapan')}
          </th>
          <th className="text-muted-foreground border-border border-b p-2 text-center font-medium">
            {t('faq.contact.fromOverseas')}
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
