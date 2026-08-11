import { GalleryGridItem } from '@/components/gallery/gallery-grid-item'
import { Badge } from '@/components/ui/badge'
import type { GalleryCategory } from '@/lib/gallery'
import { useTranslations } from 'next-intl'

type DataAttributeFn = (path: string) => string

type CategoryGridProps = {
  category: GalleryCategory
  dataAttribute?: DataAttributeFn
}

export function CategoryGrid({ category, dataAttribute }: CategoryGridProps) {
  const t = useTranslations('CategoryGrid')

  if (category.items.length === 0) return null

  return (
    <section
      id={category._id}
      data-sanity={dataAttribute?.(`galleryCategories[_key=="${category._key}"]`)}
    >
      <h3 className="flex items-center gap-3 px-3 pt-5 pb-3 text-xl font-semibold md:text-2xl">
        {category.label}
        {/* Nudged down: centring against a large heading reads slightly high */}
        <Badge variant="secondary" className="translate-y-0.5 font-normal tabular-nums">
          <span aria-hidden="true">{category.items.length}</span>
          <span className="sr-only">{t('photo_count', { count: category.items.length })}</span>
        </Badge>
      </h3>
      <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
        {category.items.map((item) => (
          <GalleryGridItem
            key={item._key}
            item={item}
            categoryKey={category._key}
            dataAttribute={dataAttribute}
          />
        ))}
      </div>
    </section>
  )
}
