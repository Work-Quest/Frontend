export const INVENTORY_BAG_ICON_SRC = '/assets/item/bag.png'

const ITEM_ICON_BASE = '/assets/item'

export function getInventoryItemIconSrc(itemName: string): string {
  const slug = itemName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
  return `${ITEM_ICON_BASE}/${slug}.png`
}
