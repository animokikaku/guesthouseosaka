import { HouseBuilding } from '@/components/house/house-building'
import { HouseLocationModal } from '@/components/house/house-location-modal'
import { Button } from '@/components/ui/button'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { HouseIdentifier } from '@/lib/types'
import { useTranslations } from 'next-intl'

export function HouseAbout({ id }: { id: HouseIdentifier }) {
  const t = useTranslations('HouseAbout')
  const houseLabel = useHouseLabels()
  const { name } = houseLabel(id)

  const { description, specificities } = {
    apple: {
      description: t('houses.apple.description'),
      specificities: [
        t('houses.apple.highlights.0'),
        t('houses.apple.highlights.1'),
        t('houses.apple.highlights.2')
      ]
    },
    lemon: {
      description: t('houses.lemon.description'),
      specificities: [
        t('houses.lemon.highlights.0'),
        t('houses.lemon.highlights.1'),
        t('houses.lemon.highlights.2')
      ]
    },
    orange: {
      description: t('houses.orange.description'),
      specificities: [
        t('houses.orange.highlights.0'),
        t('houses.orange.highlights.1'),
        t('houses.orange.highlights.2')
      ]
    }
  }[id]

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('heading', { house: name })}
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
        <HouseLocationModal id={id} title={t('heading', { house: name })}>
          <Button variant="outline">{t('modal_trigger')}</Button>
        </HouseLocationModal>
      </div>
    </section>
  )
}
