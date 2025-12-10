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
  Cable,
  ChefHat,
  Cigarette,
  Coffee,
  Lock,
  Mail,
  MailboxIcon,
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
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('HouseAmenities')
  const maxTopAmenities = isMobile ? 5 : 10

  const amenities: AmenityCategory[] = (() => {
    const data: Record<HouseIdentifier, AmenityCategory[]> = {
      apple: [
        {
          category: t('categories.internet_climate'),
          items: [
            {
              title: t('items.free_wifi'),
              icon: Wifi,
              featured: true
            },
            {
              title: t('items.air_conditioning_heating'),
              icon: ThermometerSnowflake,
              note: t('notes.private'),
              featured: true
            }
          ]
        },
        {
          category: t('categories.kitchen_dining'),
          items: [
            {
              title: t('items.kitchen'),
              icon: Utensils,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.refrigerator'),
              icon: Refrigerator,
              note: t('notes.private')
            },
            {
              title: t('items.microwave_toaster'),
              icon: Microwave,
              note: t('notes.private')
            },
            {
              title: t('items.lounge_kitchen_oven'),
              icon: ChefHat,
              note: t('notes.shared')
            },
            {
              title: t('items.large_refrigerator'),
              icon: Refrigerator,
              note: t('notes.shared')
            }
          ]
        },
        {
          category: t('categories.bathroom'),
          items: [
            {
              title: t('items.bathroom_with_shower_bathtub'),
              icon: ShowerHead,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.toilet'),
              icon: Toilet,
              note: t('notes.private')
            }
          ]
        },
        {
          category: t('categories.laundry'),
          items: [
            {
              title: t('items.washing_machine'),
              icon: WashingMachine,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.drying_space'),
              icon: Sun,
              note: t('notes.private'),
              featured: true
            }
          ]
        },
        {
          category: t('categories.accommodation'),
          items: [
            {
              title: t('items.furnished_rooms', { size: '11' }),
              icon: Bed,
              featured: true
            }
          ]
        },
        {
          category: t('categories.common_areas'),
          items: [
            {
              title: t('items.lounge'),
              icon: Sofa,
              featured: true
            },
            {
              title: t('items.tv_entertainment'),
              icon: Tv,
              featured: true
            }
          ]
        },
        {
          category: t('categories.building_access'),
          items: [
            {
              title: t('items.elevator'),
              icon: ArrowUpFromLine,
              featured: true
            },
            {
              title: t('items.smoking_area'),
              icon: Cigarette
            },
            {
              title: t('items.cluster_mailboxes'),
              icon: MailboxIcon,
              note: t('notes.shared')
            },
            {
              title: t('items.door_mail_slot'),
              icon: Mail,
              note: t('notes.private')
            },
            {
              title: t('items.bicycle_parking'),
              icon: Bike,
              note: t('notes.shared')
            }
          ]
        }
      ],
      lemon: [
        {
          category: t('categories.internet_climate'),
          items: [
            {
              title: t('items.free_wifi'),
              icon: Wifi,
              featured: true
            },
            {
              title: t('items.air_conditioning_heating'),
              icon: ThermometerSnowflake,
              note: t('notes.private'),
              featured: true
            }
          ]
        },
        {
          category: t('categories.kitchen_dining'),
          items: [
            {
              title: t('items.kitchen'),
              icon: Utensils,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.refrigerator'),
              icon: Refrigerator,
              note: t('notes.private')
            },
            {
              title: t('items.microwave_toaster_rice_cooker'),
              icon: Microwave,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.tableware'),
              icon: UtensilsCrossed,
              note: t('notes.private')
            }
          ]
        },
        {
          category: t('categories.bathroom'),
          items: [
            {
              title: t('items.bathroom_with_shower_bathtub'),
              icon: ShowerHead,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.toilet'),
              icon: Toilet,
              note: t('notes.private')
            }
          ]
        },
        {
          category: t('categories.laundry'),
          items: [
            {
              title: t('items.washing_machine'),
              icon: WashingMachine,
              note: t('notes.shared'),
              featured: true
            },
            {
              title: t('items.drying_space'),
              icon: Sun,
              note: t('notes.shared'),
              featured: true
            }
          ]
        },
        {
          category: t('categories.accommodation'),
          items: [
            {
              title: t('items.spacious_rooms'),
              icon: Bed,
              featured: true
            }
          ]
        },
        {
          category: t('categories.common_areas'),
          items: [
            {
              title: t('items.rooftop_garden'),
              icon: Sofa,
              featured: true
            }
          ]
        },
        {
          category: t('categories.building_access'),
          items: [
            {
              title: t('items.cluster_mailboxes'),
              icon: MailboxIcon,
              note: t('notes.shared')
            },
            {
              title: t('items.door_mail_slot'),
              icon: Mail,
              note: t('notes.private'),
              featured: true
            }
          ]
        }
      ],
      orange: [
        {
          category: t('categories.internet_climate'),
          items: [
            {
              title: t('items.free_wifi'),
              icon: Wifi,
              featured: true,
              note: t('notes.shared')
            },
            {
              title: t('items.lan_cable'),
              icon: Cable,
              featured: true,
              note: t('notes.private')
            },
            {
              title: t('items.air_conditioning_heating'),
              icon: ThermometerSnowflake,
              note: t('notes.private'),
              featured: true
            }
          ]
        },
        {
          category: t('categories.kitchen_dining'),
          items: [
            {
              title: t('items.kitchen'),
              icon: Utensils,
              note: t('notes.private'),
              featured: true
            },
            {
              title: t('items.refrigerator'),
              icon: Refrigerator,
              note: t('notes.private')
            },
            {
              title: t('items.microwave_toaster'),
              icon: Microwave,
              note: t('notes.shared')
            },
            {
              title: t('items.tableware'),
              icon: UtensilsCrossed,
              note: t('notes.private')
            }
          ]
        },
        {
          category: t('categories.bathroom'),
          items: [
            {
              title: t('items.shower'),
              icon: ShowerHead,
              note: t('notes.shared'),
              featured: true
            },
            {
              title: t('items.washlet_toilet'),
              icon: Toilet,
              note: t('notes.shared'),
              featured: true
            }
          ]
        },
        {
          category: t('categories.laundry'),
          items: [
            {
              title: t('items.washing_machine'),
              icon: WashingMachine,
              note: t('notes.shared'),
              featured: true
            },
            {
              title: t('items.dryer'),
              icon: RotateCcw,
              note: t('notes.coin')
            },
            {
              title: t('items.drying_space'),
              icon: Sun,
              note: t('notes.shared')
            }
          ]
        },
        {
          category: t('categories.accommodation'),
          items: [
            {
              title: t('items.furnished_rooms', { size: '12' }),
              icon: Bed,
              featured: true
            }
          ]
        },
        {
          category: t('categories.common_areas'),
          items: [
            {
              title: t('items.rooftop_lounge'),
              icon: Sofa,
              featured: true
            },
            {
              title: t('items.coffee_tea_corner'),
              icon: Coffee
            },
            {
              title: t('items.monthly_parties'),
              icon: PartyPopper
            }
          ]
        },
        {
          category: t('categories.building_access'),
          items: [
            {
              title: t('items.secure_entry'),
              icon: Lock,
              featured: true
            },
            {
              title: t('items.mailbox'),
              icon: Mail,
              note: t('notes.shared')
            },
            {
              title: t('items.bicycle_parking'),
              icon: Bike,
              note: t('notes.shared')
            },
            {
              title: t('items.appliances'),
              icon: Plug,
              note: t('notes.shared')
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
      <h2 className="mb-6 text-2xl font-semibold">{t('heading')}</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {featuredAmenities.map((amenity, index) => (
            <AmenityItem key={index} amenity={amenity} />
          ))}
        </div>

        <AmenitiesDialog
          title={t('heading')}
          amenities={amenities}
          trigger={
            <Button variant="outline">
              {t('show_all', {
                count: `${totalAmenitiesCount}`
              })}
            </Button>
          }
        />
      </div>
    </section>
  )
}
