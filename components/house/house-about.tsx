import { HouseBuilding } from '@/components/house/house-building'
import { HouseLocationModal } from '@/components/house/house-location-modal'
import { Button } from '@/components/ui/button'
import { HouseIdentifier } from '@/lib/types'
import { getTranslations } from 'next-intl/server'

export async function HouseAbout({ id }: { id: HouseIdentifier }) {
  const t = await getTranslations()

  const { description, specificities } = {
    apple: {
      description: t('houses.apple.about.description'),
      specificities: [
        t('houses.apple.about.highlights.privateKitchenBathroom'),
        t('houses.apple.about.highlights.walkToNamba'),
        t('houses.apple.about.highlights.loungeKitchen')
      ]
    },
    lemon: {
      description: t('houses.lemon.about.description'),
      specificities: [
        t('houses.lemon.about.highlights.privateKitchensBathrooms'),
        t('houses.lemon.about.highlights.spaciousRooms'),
        t('houses.lemon.about.highlights.communityLife')
      ]
    },
    orange: {
      description: t('houses.orange.about.description'),
      specificities: [
        t('houses.orange.about.highlights.privateKitchen'),
        t('houses.orange.about.highlights.longStay'),
        t('houses.orange.about.highlights.rooftopLounge')
      ]
    }
  }[id]

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('houseSections.about')}
      </h2>
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
        <HouseLocationModal id={id} title={t('houseSections.about')}>
          <Button variant="outline">{t('common.showMore')}</Button>
        </HouseLocationModal>
      </div>
    </section>
  )
}
