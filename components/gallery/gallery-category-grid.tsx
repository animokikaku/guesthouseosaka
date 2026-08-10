import { GalleryGridItem } from '@/components/gallery/gallery-grid-item'
import type { GalleryCategory } from '@/lib/gallery'

type DataAttributeFn = (path: string) => string

type CategoryGridProps = {
  category: GalleryCategory
  dataAttribute?: DataAttributeFn
}

export function CategoryGrid({ category, dataAttribute }: CategoryGridProps) {
  if (category.items.length === 0) return null

  return (
    <section
      id={category._id}
      className="scroll-mt-0"
      data-sanity={dataAttribute?.(`galleryCategories[_key=="${category._key}"]`)}
    >
      <h3 className="flex items-baseline gap-3 px-3 pt-6 pb-4 text-xl font-semibold md:text-2xl">
        {category.label}
        <span className="text-muted-foreground text-sm font-normal tabular-nums">
          {category.items.length}
        </span>
      </h3>
      <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-4 lg:grid-cols-5">
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
