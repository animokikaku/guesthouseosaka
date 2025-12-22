/**
 * Seeds house content with proper i18n keys
 * Updates existing house documents with missing content:
 * - Caption, Building Facts, About Section, Location, Pricing, Phone
 *
 * Usage: bun --env-file=.env.local run scripts/seed-house-content.ts
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = '515wijoz'
const DATASET = 'development'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-12-16',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN
})

// ============================================
// HELPERS
// ============================================

const i18nString = (en: string, ja: string, fr: string) => [
  { _key: 'en', _type: 'internationalizedArrayStringValue', value: en },
  { _key: 'ja', _type: 'internationalizedArrayStringValue', value: ja },
  { _key: 'fr', _type: 'internationalizedArrayStringValue', value: fr }
]

const i18nText = (en: string, ja: string, fr: string) => [
  { _key: 'en', _type: 'internationalizedArrayTextValue', value: en },
  { _key: 'ja', _type: 'internationalizedArrayTextValue', value: ja },
  { _key: 'fr', _type: 'internationalizedArrayTextValue', value: fr }
]

const genKey = () => Math.random().toString(36).substring(2, 10)

// ============================================
// HOUSE DATA
// ============================================

type HouseSlug = 'apple' | 'lemon' | 'orange'

interface I18nContent {
  en: string
  ja: string
  fr: string
}

interface HouseData {
  caption: I18nContent
  building: {
    rooms: number
    floors: number
    startingPrice: number
  }
  about: {
    description: I18nContent
    highlights: I18nContent[]
  }
  location: {
    highlight: I18nContent
    address: {
      streetAddress: string
      locality: string
      postalCode: string
      country: string
    }
    coordinates: { lat: number; lng: number }
    googleMapsUrl: string
    placeId: string
    stations: Array<{
      name: I18nContent
      lines?: I18nContent
      exit?: I18nContent
      walkMinutes: number
    }>
    nearby: I18nContent[]
  }
  pricing: {
    rows: Array<{
      label: I18nContent
      values: I18nContent
    }>
    notes: Array<{
      title: I18nContent
      items: I18nContent[]
    }>
  }
  phone: {
    domestic: string
    international: string
  }
}

const houseData: Record<HouseSlug, HouseData> = {
  apple: {
    caption: {
      en: '1 minute to Daikokucho Station, and Namba is an easy walk. Relaxed international community in a cozy lounge.',
      ja: '大国町駅徒歩1分。 なんばまでも楽々徒歩圏内！居心地の良いラウンジで、自由に過ごす国際交流',
      fr: 'À 1 minute à pied de la station Daikokucho, Namba aussi facilement à pied ! Lounge chaleureux pour des échanges internationaux en toute liberté.'
    },
    building: { rooms: 24, floors: 8, startingPrice: 50000 },
    about: {
      description: {
        en: 'Apple House places residents within a one-minute walk of Daikokucho Station while keeping Namba in easy reach. Every private room includes a full bathroom and kitchen, delivering condo-like comfort for medium and long stays.',
        ja: 'アップルハウスは大国町駅まで徒歩1分、難波へもすぐにアクセスできます。すべての個室にバスルームとキッチンが備わり、中長期滞在でもマンションのような快適さを提供します。',
        fr: 'Apple House place les résidents à une minute à pied de la station Daikokucho tout en restant proche de Namba. Chaque chambre privée comprend une salle de bain complète et une cuisine, offrant un confort comparable à un appartement pour les séjours moyens et longs.'
      },
      highlights: [
        {
          en: 'Private rooms with kitchen and bathroom (11 m²)',
          ja: 'キッチンとバスルーム付きの個室（11㎡）',
          fr: 'Chambres privées avec cuisine et salle de bain (11 m²)'
        },
        {
          en: '14 minutes walk to Namba',
          ja: '難波まで徒歩14分',
          fr: 'À 14 minutes à pied de Namba'
        },
        {
          en: 'Lounge with a beautiful, fully equipped kitchen',
          ja: '美しく充実したキッチンを備えたラウンジ',
          fr: 'Salon avec une belle cuisine entièrement équipée'
        }
      ]
    },
    location: {
      highlight: {
        en: 'Walking distance to Namba and reach Daikokucho Station in just one minute.',
        ja: '難波は徒歩圏内、大国町駅へは歩いて1分です。',
        fr: 'À distance de marche de Namba et à une minute seulement de la station Daikokucho.'
      },
      address: {
        streetAddress: '敷津西２丁目８−４ クリオコート82',
        locality: '大阪市浪速区',
        postalCode: '556-0015',
        country: 'JP'
      },
      coordinates: { lat: 34.65724262764905, lng: 135.49675448283273 },
      googleMapsUrl: 'https://maps.app.goo.gl/DDJLSvn13o8giwRh7',
      placeId: 'ChIJeTfoJiPnAGARS9lOqv7CCIc',
      stations: [
        {
          name: {
            en: 'Daikokucho Station',
            ja: '大国町駅',
            fr: 'Station Daikokucho'
          },
          lines: {
            en: 'Subway Midosuji and Yotsubashi Lines',
            ja: '地下鉄御堂筋線・四つ橋線',
            fr: 'Métro lignes Midosuji et Yotsubashi'
          },
          exit: { en: 'Exit 2', ja: '2番出口', fr: 'Sortie 2' },
          walkMinutes: 1
        },
        {
          name: {
            en: 'Imamiya Station / Imamiya-Ebisu',
            ja: '今宮駅／今宮戎駅',
            fr: 'Station Imamiya / Imamiya-Ebisu'
          },
          walkMinutes: 7
        },
        {
          name: {
            en: 'Ebisucho Station',
            ja: '恵美須町駅',
            fr: 'Station Ebisucho'
          },
          walkMinutes: 11
        },
        {
          name: {
            en: 'Namba Stations (various lines)',
            ja: '難波駅各線',
            fr: 'Stations Namba (diverses lignes)'
          },
          walkMinutes: 15
        }
      ],
      nearby: [
        {
          en: '24-hour supermarket right next to the guest house and another large supermarket about 1 minute away',
          ja: 'ゲストハウスのすぐ隣に24時間営業のスーパーがあり、徒歩約1分の場所にも大型スーパーがあります。',
          fr: 'Supermarché 24h/24 juste à côté de la maison d\'hôtes et un autre grand supermarché à environ 1 minute'
        },
        {
          en: 'Convenience store and post office about 3 minutes on foot',
          ja: 'コンビニと郵便局まで徒歩約3分',
          fr: 'Supérette et bureau de poste à environ 3 minutes à pied'
        },
        {
          en: 'Conveyor belt sushi restaurant about 3 minutes on foot',
          ja: '回転寿司店まで徒歩約3分',
          fr: 'Restaurant de sushis sur tapis roulant à environ 3 minutes à pied'
        },
        {
          en: '¥100 shop by Daikokucho Station',
          ja: '大国町駅そばの100円ショップ',
          fr: 'Magasin à 100¥ près de la station Daikokucho'
        }
      ]
    },
    pricing: {
      rows: [
        {
          label: { en: 'Rent', ja: '家賃', fr: 'Loyer' },
          values: {
            en: '¥50,000 ~ ¥70,000 per month (up to 2 people per room)',
            ja: '月額¥50,000～¥70,000（1部屋2名まで）',
            fr: '50 000–70 000 ¥ par mois (jusqu\'à 2 personnes par chambre)'
          }
        },
        {
          label: { en: 'Short Stay', ja: '短期滞在', fr: 'Court séjour' },
          values: {
            en: '¥80,000 ~ ¥95,000 per month.\nMinimum stay: 1 month.\nStays under 3 months: All fees included.',
            ja: '月額¥80,000～¥95,000\n最低滞在期間：1か月\n3か月未満の滞在：すべての費用込み。',
            fr: '80 000 ¥ ~ 95 000 ¥ par mois.\nSéjour minimum : 1 mois.\nSéjours de moins de 3 mois : tous les frais sont inclus.'
          }
        }
      ],
      notes: [
        {
          title: {
            en: 'Long Stay Discount',
            ja: '長期滞在割引',
            fr: 'Remise longue durée'
          },
          items: [
            {
              en: 'Discounts for 3-month and 6-month stays.',
              ja: '3か月・6か月滞在で割引あり。',
              fr: 'Réductions pour les séjours de 3 et 6 mois.'
            }
          ]
        },
        {
          title: { en: 'Other Fees', ja: 'その他の費用', fr: 'Autres frais' },
          items: [
            {
              en: 'Deposit: ¥30,000 (returned when you leave, if no damage)',
              ja: 'デポジット：¥30,000（退去時に損傷がなければ返金）',
              fr: 'Dépôt de garantie : 30 000 ¥ (remboursé à votre départ en l\'absence de dommages)'
            },
            {
              en: 'Management and shared fees: ¥10,000 per month',
              ja: '管理費・共益費：月額¥10,000',
              fr: 'Gestion et frais communs : 10 000 ¥ par mois'
            },
            {
              en: 'Utilities: About ¥3,000 per month (actual expenses)',
              ja: '光熱費：月額約¥3,000（実費）',
              fr: 'Charges : environ 3 000 ¥ par mois (selon consommation réelle)'
            }
          ]
        }
      ]
    },
    phone: {
      domestic: '06-6131-6677',
      international: '+81-6-6131-6677'
    }
  },
  lemon: {
    caption: {
      en: 'Lemon House is an 8-minute walk from Namba. Walk to nightlife spots without worrying about the last train.',
      ja: 'レモンハウスは難波まで８分のシェアハウスです。ナイトスポットにも歩いて行けるので、終電も気になりません。',
      fr: 'Lemon House est à 8 minutes de Namba. Accédez aux lieux nocturnes à pied sans vous soucier du dernier train.'
    },
    building: { rooms: 12, floors: 7, startingPrice: 50000 },
    about: {
      description: {
        en: 'Lemon House offers private rooms and select dormitory options just moments from the heart of Namba. The compact building keeps an intimate feel while delivering everything needed for short and long-term stays.',
        ja: 'レモンハウスは難波の中心からすぐの場所に、個室と一部ドミトリーを備えています。コンパクトな建物ながら、短期・長期の滞在に必要な設備がそろっています。',
        fr: 'Lemon House propose des chambres privées et quelques options en dortoir à quelques instants du cœur de Namba. Le bâtiment compact garde une ambiance intime tout en offrant tout le nécessaire pour des séjours courts ou longs.'
      },
      highlights: [
        {
          en: 'Private rooms with kitchens and bathrooms (19 m²)',
          ja: 'キッチンとバスルーム付き個室（19㎡）',
          fr: 'Chambres privées avec cuisines et salles de bain (19 m²)'
        },
        {
          en: 'Spacious rooms, great for couples and friends',
          ja: '広々とした客室でカップルや友人に最適',
          fr: 'Chambres spacieuses, idéales pour les couples et amis'
        },
        {
          en: 'Community life and international mingle in the center of Osaka',
          ja: '大阪の中心でコミュニティと国際交流を楽しむ暮らし',
          fr: 'Vie communautaire et échanges internationaux au cœur d\'Osaka'
        }
      ]
    },
    location: {
      highlight: {
        en: 'Excellent access on the Subway Midosuji Line keeps you connected across Osaka.',
        ja: '地下鉄御堂筋線で大阪市内のどこへでもスムーズにアクセスできます。',
        fr: 'Un accès idéal à la ligne de métro Midosuji vous relie à tout Osaka.'
      },
      address: {
        streetAddress: '日本橋東１丁目２−２',
        locality: '大阪市浪速区',
        postalCode: '556-0006',
        country: 'JP'
      },
      coordinates: { lat: 34.66261679180666, lng: 135.50903415399767 },
      googleMapsUrl: 'https://maps.app.goo.gl/B9zckRuVixcqorrNA',
      placeId: 'ChIJcUK9NYvnAGAR7GqSLIZIUdk',
      stations: [
        {
          name: {
            en: 'Nankai Namba Station (South Exit)',
            ja: '南海難波駅（南出口）',
            fr: 'Station Nankai Namba (sortie sud)'
          },
          walkMinutes: 8
        },
        {
          name: {
            en: 'Nihonbashi Station',
            ja: '日本橋駅',
            fr: 'Station Nihonbashi'
          },
          lines: {
            en: 'Subway Sakaisuji Line',
            ja: '地下鉄堺筋線',
            fr: 'Métro ligne Sakaisuji'
          },
          exit: { en: 'Exit 10', ja: '10番出口', fr: 'Sortie 10' },
          walkMinutes: 8
        },
        {
          name: {
            en: 'Namba Station',
            ja: '難波駅',
            fr: 'Station Namba'
          },
          lines: {
            en: 'Subway Midosuji Line',
            ja: '地下鉄御堂筋線',
            fr: 'Métro ligne Midosuji'
          },
          exit: { en: 'Exit 4', ja: '4番出口', fr: 'Sortie 4' },
          walkMinutes: 10
        }
      ],
      nearby: [
        {
          en: 'Supermarkets nearby at roughly 2, 4, and 6 minutes on foot',
          ja: '徒歩約2分・4分・6分の場所にスーパーがあります',
          fr: 'Supermarchés à proximité à environ 2, 4 et 6 minutes à pied'
        },
        {
          en: 'Post office about 2 minutes on foot',
          ja: '郵便局まで徒歩約2分',
          fr: 'Bureau de poste à environ 2 minutes à pied'
        },
        {
          en: 'Discount shop about 5 minutes on foot plus additional convenience stores within walking distance',
          ja: '徒歩約5分の場所にディスカウントストアがあり、ほかのコンビニも徒歩圏内にあります。',
          fr: 'Magasin discount à environ 5 minutes à pied et autres supérettes à proximité'
        }
      ]
    },
    pricing: {
      rows: [
        {
          label: { en: 'Rent', ja: '家賃', fr: 'Loyer' },
          values: {
            en: '¥50,000 ~ ¥70,000 per month (up to 2 people per room)',
            ja: '月額¥50,000～¥70,000（1部屋2名まで）',
            fr: '50 000–70 000 ¥ par mois (jusqu\'à 2 personnes par chambre)'
          }
        },
        {
          label: { en: 'Short Stay', ja: '短期滞在', fr: 'Court séjour' },
          values: {
            en: '¥80,000 ~ ¥95,000 per month.\nMinimum stay: 1 month.\nStays under 3 months: All fees included.',
            ja: '月額¥80,000～¥95,000\n最低滞在期間：1か月\n3か月未満の滞在：すべての費用込み。',
            fr: '80 000 ¥ ~ 95 000 ¥ par mois.\nSéjour minimum : 1 mois.\nSéjours de moins de 3 mois : tous les frais sont inclus.'
          }
        },
        {
          label: { en: 'Dormitory Plan', ja: 'ドミトリープラン', fr: 'Formule dortoir' },
          values: {
            en: '¥45,000 per month (including utilities, management, and common service fees)\nCo-ed, 3 beds per room, shared bathroom and kitchen.\nMinimum stay: 1 month.',
            ja: '月額¥45,000（光熱費・管理・共益費込）\n男女混合・1部屋3ベッド・バスルームとキッチンは共用です。\n最低滞在期間：1か月',
            fr: '45 000 ¥ par mois (charges, gestion et frais communs inclus)\nMixte, 3 lits par chambre, salle de bain et cuisine partagées.\nSéjour minimum : 1 mois.'
          }
        }
      ],
      notes: [
        {
          title: {
            en: 'Long Stay Discount',
            ja: '長期滞在割引',
            fr: 'Remise longue durée'
          },
          items: [
            {
              en: 'Discounts for 3-month and 6-month stays.',
              ja: '3か月・6か月滞在で割引あり。',
              fr: 'Réductions pour les séjours de 3 et 6 mois.'
            }
          ]
        },
        {
          title: { en: 'Other Fees', ja: 'その他の費用', fr: 'Autres frais' },
          items: [
            {
              en: 'Deposit: ¥30,000 (returned when you leave, if no damage)',
              ja: 'デポジット：¥30,000（退去時に損傷がなければ返金）',
              fr: 'Dépôt de garantie : 30 000 ¥ (remboursé à votre départ en l\'absence de dommages)'
            },
            {
              en: 'Management and shared fees: ¥10,000 per month',
              ja: '管理費・共益費：月額¥10,000',
              fr: 'Gestion et frais communs : 10 000 ¥ par mois'
            },
            {
              en: 'Utilities: About ¥3,000 per month (actual expenses)',
              ja: '光熱費：月額約¥3,000（実費）',
              fr: 'Charges : environ 3 000 ¥ par mois (selon consommation réelle)'
            },
            {
              en: 'Washing machine: Free (on rooftop)',
              ja: '洗濯機：無料（屋上）',
              fr: 'Machine à laver : gratuit (sur le toit)'
            }
          ]
        }
      ]
    },
    phone: {
      domestic: '06-6627-0790',
      international: '+81-6-6627-0790'
    }
  },
  orange: {
    caption: {
      en: 'Prime access to retro Showachō. International crowd in our Japanese-style lounge.',
      ja: 'レトロな昭和町でアクセス最高。和風ラウンジでまったり国際交流',
      fr: 'Un accès idéal au quartier rétro de Showachō. Des rencontres internationales dans notre salon.'
    },
    building: { rooms: 28, floors: 3, startingPrice: 41000 },
    about: {
      description: {
        en: 'Orange House is a private-room share house in retro Showachō, Abeno Ward. Enjoy prime access to central Osaka and relax with international friends in our Japanese-style lounge.',
        ja: 'オレンジハウスは阿倍野区のレトロな街「昭和町」にある個室のシェアハウスです。大阪の中心部までのアクセスは最高！和風ラウンジでまったり国際交流が楽しめます。',
        fr: 'Orange House est une colocation en chambres privées située dans le quartier rétro de Showachō à Abeno. Accès idéal au centre d\'Osaka et échanges internationaux détendus dans notre salon de style japonais.'
      },
      highlights: [
        {
          en: 'Private rooms with kitchen (12 m²)',
          ja: 'キッチン付き個室（12㎡）',
          fr: 'Chambres privées avec cuisine (12 m²)'
        },
        {
          en: 'Long‑stay discounts available',
          ja: '長期滞在割引あり',
          fr: 'Réductions pour longs séjours disponibles'
        },
        {
          en: 'Retro Japanese rooftop lounge (100 m²) with Abeno Harukas views',
          ja: 'あべのハルカスの景色を望む和風レトロな屋上ラウンジ（100㎡）',
          fr: 'Salon rooftop rétro japonais (100 m²) avec vue sur Abeno Harukas'
        }
      ]
    },
    location: {
      highlight: {
        en: 'Excellent access on the Subway Midosuji and Tanimachi Lines keeps you connected across Osaka.',
        ja: '地下鉄御堂筋線、谷町線で大阪市内のどこへでもスムーズにアクセスできます。',
        fr: 'Un accès idéal aux lignes de métro Midosuji et Tanimachi vous relie à tout Osaka.'
      },
      address: {
        streetAddress: '阪南町１丁目２１−１９',
        locality: '大阪市阿倍野区',
        postalCode: '545-0021',
        country: 'JP'
      },
      coordinates: { lat: 34.636772583794695, lng: 135.51341794050208 },
      googleMapsUrl: 'https://maps.app.goo.gl/ytgDe4xcD5PbDnP79',
      placeId: 'ChIJ6wny0-ndAGARZjNwMl6Naig',
      stations: [
        {
          name: {
            en: 'Fuminosato Station',
            ja: '文の里駅',
            fr: 'Station Fuminosato'
          },
          lines: {
            en: 'Subway Tanimachi Line',
            ja: '地下鉄谷町線',
            fr: 'Métro ligne Tanimachi'
          },
          exit: { en: 'Exit 6', ja: '6番出口', fr: 'Sortie 6' },
          walkMinutes: 3
        },
        {
          name: {
            en: 'Showacho Station',
            ja: '昭和町駅',
            fr: 'Station Showacho'
          },
          lines: {
            en: 'Subway Midosuji Line',
            ja: '地下鉄御堂筋線',
            fr: 'Métro ligne Midosuji'
          },
          exit: { en: 'Exit 2', ja: '2番出口', fr: 'Sortie 2' },
          walkMinutes: 7
        },
        {
          name: {
            en: 'Tennoji / Abenobashi',
            ja: '天王寺／阿倍野橋',
            fr: 'Tennoji / Abenobashi'
          },
          walkMinutes: 15
        }
      ],
      nearby: [
        {
          en: 'Supermarkets within about 5 minutes on foot',
          ja: '徒歩約5分圏内にスーパーがあります',
          fr: 'Supermarchés à environ 5 minutes à pied'
        },
        {
          en: 'Supermarket at Showacho Station',
          ja: '昭和町駅のスーパー',
          fr: 'Supermarché proche de la station Showacho'
        },
        {
          en: 'Abeno Harukas 15 minutes on foot; Qs Mall 12 minutes on foot',
          ja: 'あべのハルカスまで徒歩15分、Q\'s mallまで徒歩12分',
          fr: 'Abeno Harukas à 15 minutes à pied ; Qs Mall à 12 minutes à pied'
        }
      ]
    },
    pricing: {
      rows: [
        {
          label: { en: 'Rent', ja: '家賃', fr: 'Loyer' },
          values: {
            en: '¥41,000 ~ ¥48,000 per month (1 person)\n+¥5,000 per month for second person',
            ja: '月額¥41,000～¥48,000（1名）\n2人目は月額+¥5,000',
            fr: '41 000–48 000 ¥ par mois (1 personne)\n+5 000 ¥ par mois pour une deuxième personne'
          }
        }
      ],
      notes: [
        {
          title: {
            en: 'Long Stay Discount',
            ja: '長期滞在割引',
            fr: 'Remise longue durée'
          },
          items: [
            {
              en: '2nd month: Save ¥1,000',
              ja: '2か月目：¥1,000割引',
              fr: '2e mois : économisez 1 000 ¥'
            },
            {
              en: '3rd month: Save ¥2,000',
              ja: '3か月目：¥2,000割引',
              fr: '3e mois : économisez 2 000 ¥'
            },
            {
              en: 'After 6 months: Save ¥5,000 every month',
              ja: '6か月以降：毎月¥5,000割引',
              fr: 'Après 6 mois : économisez ¥5 000 chaque mois'
            }
          ]
        },
        {
          title: { en: 'Other Fees', ja: 'その他の費用', fr: 'Autres frais' },
          items: [
            {
              en: 'Deposit: ¥30,000 (refunded at move-out if there is no damage)',
              ja: 'デポジット：¥30,000（退去時に損傷等がなければ返金）',
              fr: 'Dépôt de garantie : 30 000 ¥ (remboursé à votre départ en l\'absence de dégats)'
            },
            {
              en: 'Management and common service fee: ¥12,000 per month',
              ja: '管理費・共益費：月額¥12,000',
              fr: 'Frais de gestion et charges communes : 12 000 ¥ par mois'
            },
            {
              en: 'Utilities: About ¥3,000 ~ ¥4,000 per month (actual expenses)',
              ja: '光熱費：月額約¥3,000～¥4,000（実費）',
              fr: 'Charges : environ 3 000–4 000 ¥ par mois (payez uniquement ce que vous consommez)'
            },
            {
              en: 'Washing machine: Free',
              ja: '洗濯機：無料',
              fr: 'Machine à laver : gratuit'
            },
            {
              en: 'Dryer: ¥100 per 30 minutes',
              ja: '乾燥機：¥100／30分',
              fr: 'Sèche-linge : 100 ¥ par 30 minutes'
            }
          ]
        }
      ]
    },
    phone: {
      domestic: '06-6627-0790',
      international: '+81-6-6627-0790'
    }
  }
}

// ============================================
// SEED FUNCTIONS
// ============================================

async function getHouseId(slug: HouseSlug): Promise<string | null> {
  const result = await client.fetch<{ _id: string }[]>(
    `*[_type == "house" && slug == $slug && !(_id in path("drafts.**"))]{ _id }`,
    { slug }
  )
  return result[0]?._id || null
}

async function seedHouseContent(slug: HouseSlug) {
  console.log(`\nSeeding ${slug} house content...`)

  const houseId = await getHouseId(slug)
  if (!houseId) {
    console.log(`  Error: House ${slug} not found`)
    return
  }

  const data = houseData[slug]

  // Build highlights array
  const highlights = data.about.highlights.map((h) => ({
    _key: genKey(),
    text: i18nString(h.en, h.ja, h.fr)
  }))

  // Build stations array
  const stations = data.location.stations.map((s) => ({
    _key: genKey(),
    _type: 'stationInfo',
    name: i18nString(s.name.en, s.name.ja, s.name.fr),
    ...(s.lines && { lines: i18nString(s.lines.en, s.lines.ja, s.lines.fr) }),
    ...(s.exit && { exit: i18nString(s.exit.en, s.exit.ja, s.exit.fr) }),
    walkMinutes: s.walkMinutes
  }))

  // Build nearby array
  const nearby = data.location.nearby.map((n) => ({
    _key: genKey(),
    _type: 'nearbyPlace',
    description: i18nText(n.en, n.ja, n.fr)
  }))

  // Build pricing rows
  const pricingRows = data.pricing.rows.map((row) => ({
    _key: genKey(),
    _type: 'pricingRow',
    label: i18nString(row.label.en, row.label.ja, row.label.fr),
    values: i18nText(row.values.en, row.values.ja, row.values.fr)
  }))

  // Build pricing notes
  const pricingNotes = data.pricing.notes.map((note) => ({
    _key: genKey(),
    _type: 'pricingNote',
    title: i18nString(note.title.en, note.title.ja, note.title.fr),
    items: note.items.map((item) => ({
      _key: genKey(),
      _type: 'item',
      text: i18nText(item.en, item.ja, item.fr)
    }))
  }))

  // Patch the house document
  await client
    .patch(houseId)
    .set({
      caption: i18nText(data.caption.en, data.caption.ja, data.caption.fr),
      building: data.building,
      about: {
        description: i18nText(
          data.about.description.en,
          data.about.description.ja,
          data.about.description.fr
        ),
        highlights
      },
      location: {
        highlight: i18nText(
          data.location.highlight.en,
          data.location.highlight.ja,
          data.location.highlight.fr
        ),
        address: {
          _type: 'address',
          ...data.location.address
        },
        coordinates: {
          _type: 'geopoint',
          lat: data.location.coordinates.lat,
          lng: data.location.coordinates.lng
        },
        googleMapsUrl: data.location.googleMapsUrl,
        placeId: data.location.placeId,
        stations,
        nearby
      },
      pricing: {
        rows: pricingRows,
        notes: pricingNotes
      },
      phone: data.phone
    })
    .commit()

  console.log(`  ✓ Updated ${slug}:`)
  console.log(`    - Caption (3 languages)`)
  console.log(`    - Building: ${data.building.rooms} rooms, ${data.building.floors} floors, ¥${data.building.startingPrice}`)
  console.log(`    - About: description + ${data.about.highlights.length} highlights`)
  console.log(`    - Location: address, coordinates, ${data.location.stations.length} stations, ${data.location.nearby.length} nearby`)
  console.log(`    - Pricing: ${data.pricing.rows.length} rows, ${data.pricing.notes.length} notes`)
  console.log(`    - Phone: ${data.phone.domestic}`)
}

async function main() {
  console.log('='.repeat(60))
  console.log('Seeding house content')
  console.log('='.repeat(60))
  console.log(`Project: ${PROJECT_ID}`)
  console.log(`Dataset: ${DATASET}`)

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error(
      '\nError: SANITY_API_WRITE_TOKEN environment variable is required'
    )
    process.exit(1)
  }

  const houses: HouseSlug[] = ['apple', 'lemon', 'orange']

  for (const slug of houses) {
    await seedHouseContent(slug)
  }

  console.log('\n' + '='.repeat(60))
  console.log('All done!')
  console.log('='.repeat(60))
}

main().catch(console.error)
