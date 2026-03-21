import React, { useEffect, useState } from 'react'
import { Backpack, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/8bit/item'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { getInventoryItemIconSrc, INVENTORY_BAG_ICON_SRC } from '@/lib/inventoryItemAssets'
import { useBattleInventory, type GroupedBattleItem } from '@/hook/useBattleInventory'

function InventoryBagIcon({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <Backpack className={cn('h-8 w-8 !text-orange', className)} aria-hidden />
  }
  return (
    <img
      src={INVENTORY_BAG_ICON_SRC}
      alt=""
      width={32}
      height={32}
      decoding="async"
      className={cn('h-8 w-8 object-contain [image-rendering:pixelated] select-none', className)}
      onError={() => setFailed(true)}
    />
  )
}

function InventoryItemThumbnail({ itemName }: { itemName: string }) {
  const [showFallback, setShowFallback] = useState(false)
  const src = getInventoryItemIconSrc(itemName)

  useEffect(() => {
    setShowFallback(false)
  }, [itemName])

  return (
    <ItemMedia
      variant="image"
      className="size-12 shrink-0 !border-2 !border-veryLightBrown !bg-offWhite !shadow-[0_2px_0_0_#948B81] [&_img]:object-contain"
    >
      {showFallback ? (
        <div className="flex size-full items-center justify-center">
          <Package className="size-6 !text-brown/35" aria-hidden />
        </div>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="p-0.5"
          onError={() => setShowFallback(true)}
        />
      )}
    </ItemMedia>
  )
}

/** WorkQuest theme accents (Baloo + palette from `index.css` @theme) */
function getInventoryTitleClass(category: GroupedBattleItem['colorCategory']) {
  switch (category) {
    case 'blue':
      return '!text-darkBlue2'
    case 'green':
      return '!text-green'
    case 'red':
      return '!text-red'
    default:
      return '!text-darkBrown'
  }
}

type BattleResponsiveHudProps = {
  projectId: string | null | undefined
  bossPhase?: number
  showBossPhase?: boolean
  className?: string
}

/**
 * Phase label + inventory bag live outside the scaled battle viewport so they stay visible on small / responsive layouts.
 */
const BattleResponsiveHud: React.FC<BattleResponsiveHudProps> = ({
  projectId,
  bossPhase,
  showBossPhase = true,
}) => {
  const { groupedItems, loadingItems, usingItemId, handleUseItem } = useBattleInventory(
    projectId ?? null
  )

  const showPhase = showBossPhase && bossPhase !== undefined && bossPhase !== null

  if (!projectId) return null

  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-center justify-between gap-2 px-2 py-2 pt-6 sm:px-3'
      )}
    >
      <div className="min-w-0 flex-1">
        {showPhase ? (
          <span className="font-mono text-xs font-bold tracking-wider text-yellow-300 sm:text-sm">
            Phase {bossPhase}
          </span>
        ) : (
          <span className="text-xs text-slate-500 sm:text-sm">Battle</span>
        )}
      </div>
      <div className="shrink-0">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="cursor-pointer touch-manipulation border-0 !bg-offWhite/80 !p-1 !shadow-none !outline-none !transition-opacity hover:opacity-90 active:opacity-80 focus-visible:ring-2 focus-visible:ring-orange/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="Open inventory"
            >
              <InventoryBagIcon />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex h-full max-h-[100dvh] w-[min(100vw-1rem,300px)] flex-col gap-0 overflow-hidden !border-l-4 !border-brown !bg-cream !p-0 !font-['Baloo_2'] !text-darkBrown shadow-[0_4px_24px_rgba(61,55,48,0.18)] [&>button]:!rounded-lg [&>button]:!text-brown/50 [&>button]:hover:!bg-offWhite [&>button]:hover:!text-darkBrown"
          >
            <SheetHeader className="shrink-0 !bg-offWhite/80">
              <SheetTitle className="!border-b-2 !border-veryLightBrown !pb-2 !font-['Baloo_2'] !text-xl !font-extrabold !tracking-tight !text-darkBrown !normal-case">
                Inventory
              </SheetTitle>
              <SheetDescription className="!mt-1 !font-['Baloo_2'] !text-xs !font-medium !normal-case !text-brown/80">
                Select an item to use in battle
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch]">
              {loadingItems ? (
                <div className="py-4 text-center text-sm !text-brown/70 !font-['Baloo_2']">
                  Loading items...
                </div>
              ) : groupedItems.length === 0 ? (
                <div className="py-4 text-center text-sm !text-brown/70 !font-['Baloo_2']">
                  No items in inventory
                </div>
              ) : (
                <ItemGroup>
                  {groupedItems.map((groupedItem, index) => {
                    const titleClass = getInventoryTitleClass(groupedItem.colorCategory)
                    const displayName =
                      groupedItem.count > 1
                        ? `${groupedItem.name} · ×${groupedItem.count}`
                        : groupedItem.name
                    const firstUserItemId = groupedItem.userItemIds[0]
                    const isUsing = usingItemId === firstUserItemId
                    return (
                      <React.Fragment key={groupedItem.name}>
                        {index > 0 && <ItemSeparator className="my-2 !bg-veryLightBrown" />}
                        <Item
                          variant="default"
                          size="sm"
                          font="normal"
                          className={cn(
                            "!font-['Baloo_2'] !text-darkBrown !rounded-lg",
                            index < groupedItems.length - 1 ? 'mb-2' : 'mb-2 pb-2'
                          )}
                        >
                          <InventoryItemThumbnail itemName={groupedItem.name} />
                          <ItemContent>
                            <ItemTitle
                              className={`!font-['Baloo_2'] !text-sm !font-extrabold !leading-tight ${titleClass}`}
                            >
                              {displayName}
                            </ItemTitle>
                            <ItemDescription className="!font-['Baloo_2'] !text-xs !font-medium !text-brown/85 !leading-snug">
                              {groupedItem.description || 'No description'}
                            </ItemDescription>
                          </ItemContent>
                          <ItemActions>
                            <Button
                              variant="orange"
                              size="sm"
                              className="!h-8 !min-h-0 !px-3 !py-0 !text-[11px] !leading-none hover:!outline-none focus:!outline-none"
                              onClick={() => handleUseItem(firstUserItemId, groupedItem.name)}
                              disabled={isUsing || !projectId}
                            >
                              {isUsing ? 'Using…' : 'Use'}
                            </Button>
                          </ItemActions>
                        </Item>
                      </React.Fragment>
                    )
                  })}
                </ItemGroup>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default BattleResponsiveHud
