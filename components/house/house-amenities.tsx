'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'
import { HouseIdentifier } from '@/lib/types'
import {
  ArrowUpFromLine,
  Bed,
  Bike,
  ChefHat,
  Coffee,
  Lock,
  Mail,
  Microwave,
  PartyPopper,
  Plug,
  Refrigerator,
  RotateCcw,
  ShowerHead,
  Sofa,
  Sun,
  ThermometerSnowflake,
  Toilet,
  Tv,
  Utensils,
  UtensilsCrossed,
  WashingMachine,
  Wifi
} from 'lucide-react'
import { useExtracted } from 'next-intl'
import * as React from 'react'

type Amenity = {
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  note?: string
  featured?: boolean
}

type AmenityCategory = {
  category: string
  items: Amenity[]
}

interface HouseAmenitiesProps {
  id: HouseIdentifier
}

interface AmenitiesDialogProps {
  amenities: AmenityCategory[]
  trigger: React.ReactNode
  title: string
}

function AmenityItem({ amenity }: { amenity: Amenity }) {
  const Icon = amenity.icon
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="text-muted-foreground h-5 w-5 shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <span className="text-foreground">{amenity.title}</span>
        {amenity.note && (
          <Badge variant="outline" className="ml-2 text-xs">
            {amenity.note}
          </Badge>
        )}
      </div>
    </div>
  )
}

function AmenitiesDialog({ amenities, trigger, title }: AmenitiesDialogProps) {
  const isMobile = useIsMobile()

  const content = (
    <div className="space-y-8 pt-8">
      {amenities.map((category) => (
        <div key={category.category}>
          <h3 className="text-foreground mb-4 text-lg font-semibold">
            {category.category}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {category.items.map((amenity, index) => (
              <AmenityItem
                key={`${category.category}-${index}`}
                amenity={amenity}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="theme-container max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="theme-container max-h-[85vh] w-3xl overflow-y-auto md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export function HouseAmenities({ id }: HouseAmenitiesProps) {
  const isMobile = useIsMobile()
  const t = useExtracted()
  const maxTopAmenities = isMobile ? 5 : 10

  const amenities: AmenityCategory[] = (() => {
    const data: Record<HouseIdentifier, AmenityCategory[]> = {
      apple: [
        {
          category: t('Internet & climate'),
          items: [
            {
              title: t('Free Wi-Fi'),
              icon: Wifi,
              featured: true
            },
            {
              title: t('Air conditioning & heating'),
              icon: ThermometerSnowflake,
              note: t('Private'),
              featured: true
            }
          ]
        },
        {
          category: t('Kitchen & dining'),
          items: [
            {
              title: t('Kitchen'),
              icon: Utensils,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Refrigerator'),
              icon: Refrigerator,
              note: t('Private')
            },
            {
              title: t('Microwave & toaster'),
              icon: Microwave,
              note: t('Private')
            },
            {
              title: t('Lounge kitchen with oven'),
              icon: ChefHat,
              note: t('Shared')
            },
            {
              title: t('Large refrigerator'),
              icon: Refrigerator,
              note: t('Shared')
            }
          ]
        },
        {
          category: t('Bathroom'),
          items: [
            {
              title: t('Bathroom with shower & bathtub'),
              icon: ShowerHead,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Washlet toilet'),
              icon: Toilet,
              note: t('Private')
            }
          ]
        },
        {
          category: t('Laundry'),
          items: [
            {
              title: t('Washing machine'),
              icon: WashingMachine,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Drying space'),
              icon: Sun,
              note: t('Shared'),
              featured: true
            }
          ]
        },
        {
          category: t('Accommodation'),
          items: [
            {
              title: t('Fully furnished rooms ({size} m²)', { size: '11' }),
              icon: Bed,
              featured: true
            }
          ]
        },
        {
          category: t('Common areas'),
          items: [
            {
              title: t('Lounge'),
              icon: Sofa,
              featured: true
            },
            {
              title: t('TV with Netflix, Blu-ray, cable'),
              icon: Tv,
              featured: true
            }
          ]
        },
        {
          category: t('Building & access'),
          items: [
            {
              title: t('Elevator'),
              icon: ArrowUpFromLine,
              featured: true
            },
            {
              title: t('Mailbox'),
              icon: Mail,
              note: t('Shared')
            },
            {
              title: t('Bicycle parking'),
              icon: Bike,
              note: t('Shared')
            }
          ]
        }
      ],
      lemon: [
        {
          category: t('Internet & climate'),
          items: [
            {
              title: t('Free Wi-Fi'),
              icon: Wifi,
              featured: true
            },
            {
              title: t('Air conditioning & heating'),
              icon: ThermometerSnowflake,
              note: t('Private'),
              featured: true
            }
          ]
        },
        {
          category: t('Kitchen & dining'),
          items: [
            {
              title: t('Kitchen'),
              icon: Utensils,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Refrigerator'),
              icon: Refrigerator,
              note: t('Private')
            },
            {
              title: t('Microwave, toaster & rice cooker'),
              icon: Microwave,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Tableware'),
              icon: UtensilsCrossed,
              note: t('Private')
            }
          ]
        },
        {
          category: t('Bathroom'),
          items: [
            {
              title: t('Bathroom with shower & bathtub'),
              icon: ShowerHead,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Washlet toilet'),
              icon: Toilet,
              note: t('Private')
            }
          ]
        },
        {
          category: t('Laundry'),
          items: [
            {
              title: t('Washing machine'),
              icon: WashingMachine,
              note: t('Shared'),
              featured: true
            },
            {
              title: t('Drying space'),
              icon: Sun,
              note: t('Shared'),
              featured: true
            }
          ]
        },
        {
          category: t('Accommodation'),
          items: [
            {
              title: t('Spacious rooms (19 m²)'),
              icon: Bed,
              featured: true
            }
          ]
        },
        {
          category: t('Common areas'),
          items: [
            {
              title: t('Lounge'),
              icon: Sofa,
              featured: true
            }
          ]
        },
        {
          category: t('Building & access'),
          items: [
            {
              title: t('Secure entry'),
              icon: Lock,
              featured: true
            },
            {
              title: t('Mailbox'),
              icon: Mail,
              note: t('Shared')
            },
            {
              title: t('Bicycle parking'),
              icon: Bike,
              note: t('Shared')
            }
          ]
        }
      ],
      orange: [
        {
          category: t('Internet & climate'),
          items: [
            {
              title: t('Free Wi-Fi'),
              icon: Wifi,
              featured: true
            },
            {
              title: t('Air conditioning & heating'),
              icon: ThermometerSnowflake,
              note: t('Private'),
              featured: true
            }
          ]
        },
        {
          category: t('Kitchen & dining'),
          items: [
            {
              title: t('Kitchen'),
              icon: Utensils,
              note: t('Private'),
              featured: true
            },
            {
              title: t('Refrigerator & freezer'),
              icon: Refrigerator,
              note: t('Private')
            },
            {
              title: t('Microwave & toaster'),
              icon: Microwave,
              note: t('Shared')
            },
            {
              title: t('Tableware'),
              icon: UtensilsCrossed,
              note: t('Private')
            }
          ]
        },
        {
          category: t('Bathroom'),
          items: [
            {
              title: t('Shower'),
              icon: ShowerHead,
              note: t('Shared'),
              featured: true
            },
            {
              title: t('Washlet toilet'),
              icon: Toilet,
              note: t('Shared'),
              featured: true
            }
          ]
        },
        {
          category: t('Laundry'),
          items: [
            {
              title: t('Washing machine'),
              icon: WashingMachine,
              note: t('Shared'),
              featured: true
            },
            {
              title: t('Dryer'),
              icon: RotateCcw,
              note: t('Coin')
            },
            {
              title: t('Drying space'),
              icon: Sun,
              note: t('Shared')
            }
          ]
        },
        {
          category: t('Accommodation'),
          items: [
            {
              title: t('Fully furnished rooms ({size} m²)', { size: '12' }),
              icon: Bed,
              featured: true
            }
          ]
        },
        {
          category: t('Common areas'),
          items: [
            {
              title: t('Rooftop lounge (100 m²)'),
              icon: Sofa,
              featured: true
            },
            {
              title: t('Coffee & tea corner'),
              icon: Coffee,
              featured: true
            },
            {
              title: t('Monthly parties'),
              icon: PartyPopper
            }
          ]
        },
        {
          category: t('Building & access'),
          items: [
            {
              title: t('Secure entry'),
              icon: Lock,
              featured: true
            },
            {
              title: t('Mailbox'),
              icon: Mail,
              note: t('Shared')
            },
            {
              title: t('Bicycle parking'),
              icon: Bike,
              note: t('Shared')
            },
            {
              title: t('Appliances (vacuum, iron)'),
              icon: Plug,
              note: t('Shared')
            }
          ]
        }
      ]
    }
    return data[id]
  })()

  const featuredAmenities = amenities
    .flatMap((category) => category.items.filter((item) => item.featured))
    .slice(0, maxTopAmenities)

  // Calculate total amenities count
  const totalAmenitiesCount = amenities.reduce(
    (total, category) => total + category.items.length,
    0
  )

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('What this place offers')}
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {featuredAmenities.map((amenity, index) => (
            <AmenityItem key={index} amenity={amenity} />
          ))}
        </div>

        <AmenitiesDialog
          title={t('What this place offers')}
          amenities={amenities}
          trigger={
            <Button variant="outline">
              {t('Show all {count} amenities', {
                count: `${totalAmenitiesCount}`
              })}
            </Button>
          }
        />
      </div>
    </section>
  )
}
