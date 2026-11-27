import { useFormatter, useTranslations } from 'use-intl'

/**
 * A room's monthly price as the site writes it: "¥58,000", or as a starting
 * price ("from ¥63,000", 「¥63,000〜」) in a house where it depends on the
 * contract (the house's **Starting prices** field, see docs/rooms.md).
 */
export function useRoomPrice() {
  const t = useTranslations('HouseRooms')
  const formatter = useFormatter()
  return (price: number, from = false) => {
    const amount = formatter.number(price, 'currency')
    return from ? t('price_from', { price: amount }) : amount
  }
}
