import { HouseBuilding } from '@/components/house/house-building'
import { HouseLocationModal } from '@/components/house/house-location-modal'
import { Button } from '@/components/ui/button'
import { HouseIdentifier } from '@/lib/types'
import { getExtracted } from 'next-intl/server'

export async function HouseAbout({ id }: { id: HouseIdentifier }) {
  const t = await getExtracted()

  const { description, specificities } = {
    apple: {
      description: t(
        'Apple House places residents within a one-minute walk of Daikokucho Station while keeping Namba in easy reach. Every private room includes a full bathroom and kitchen, delivering condo-like comfort for medium and long stays.'
      ),
      specificities: [
        t('Private rooms with kitchen and bathroom (11 m²)'),
        t('14 minutes walk to Namba'),
        t('Lounge with a beautiful, fully equipped kitchen')
      ]
    },
    lemon: {
      description: t(
        'Lemon House offers private rooms and select dormitory options just moments from the heart of Namba. The compact building keeps an intimate feel while delivering everything needed for short and long-term stays.'
      ),
      specificities: [
        t('Private rooms with kitchens and bathrooms (19 m²)'),
        t('Spacious rooms, great for couples and friends'),
        t('Community life and international mingle in the center of Osaka')
      ]
    },
    orange: {
      description: t(
        'Orange House is a private room accommodation located beside the Osaka city center. The house combines traditional Japanese styling with everyday conveniences, making it a calm base for longer stays in the Abeno area.'
      ),
      specificities: [
        t('Private rooms with kitchen (12 m²)'),
        t('Long‑stay discounts available'),
        t('Traditional rooftop lounge (100 m²) with Abeno Harukas views')
      ]
    }
  }[id]

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">{t('About this place')}</h2>
      <div className="mb-4">
        <HouseBuilding id={id} />
      </div>

      <p className="text-foreground text-base leading-relaxed">{description}</p>

      {specificities.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {specificities.map((specificity, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                <span className="text-foreground">{specificity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <HouseLocationModal id={id} title={t('About this place')}>
          <Button variant="outline">{t('Show more')}</Button>
        </HouseLocationModal>
      </div>
    </section>
  )
}
