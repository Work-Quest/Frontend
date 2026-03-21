import { useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useGame } from '@/hook/useGame'
import { getItemColorCategory } from '@/lib/utils'
import type { ProjectMemberItemsResponse } from '@/types/GameApi'
import { usePollingWhen } from '@/hook/usePolling'
import { POLLING_CONFIG } from '@/config/pollingConfig'

export type GroupedBattleItem = {
  name: string
  description: string
  count: number
  colorCategory: 'blue' | 'green' | 'red' | 'gray'
  userItemIds: string[]
}

export function useBattleInventory(projectId: string | null | undefined) {
  const { getMyItems, consumeMemberItem } = useGame(projectId ?? undefined)
  const [items, setItems] = useState<ProjectMemberItemsResponse | null>(null)
  const [loadingItems, setLoadingItems] = useState(false)
  const [usingItemId, setUsingItemId] = useState<string | null>(null)

  const refreshItems = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!projectId) {
        setItems(null)
        return
      }
      try {
        if (!opts?.silent) setLoadingItems(true)
        const data = await getMyItems(projectId, opts?.silent)
        setItems(data)
      } catch (error) {
        console.error('Failed to fetch items:', error)
        if (!opts?.silent) {
          toast.error('Couldn’t load items\nRefresh the page or try again in a few seconds.')
        }
      } finally {
        if (!opts?.silent) setLoadingItems(false)
      }
    },
    [projectId, getMyItems]
  )

  usePollingWhen(
    refreshItems,
    () => !!projectId,
    { pollIntervalMs: POLLING_CONFIG.items.interval, enabled: true },
    [projectId, refreshItems]
  )

  const groupedItems = useMemo<GroupedBattleItem[]>(() => {
    if (!items?.items) return []
    const grouped = new Map<string, GroupedBattleItem>()
    items.items.forEach((itemEntry) => {
      const itemName = itemEntry.item.name
      const existing = grouped.get(itemName)
      if (existing) {
        existing.count += 1
        existing.userItemIds.push(itemEntry.user_item_id)
      } else {
        grouped.set(itemName, {
          name: itemName,
          description: itemEntry.item.description || '',
          count: 1,
          colorCategory: getItemColorCategory(itemName),
          userItemIds: [itemEntry.user_item_id],
        })
      }
    })
    return Array.from(grouped.values())
  }, [items])

  const handleUseItem = useCallback(
    async (userItemId: string, itemName: string) => {
      if (!projectId || usingItemId) return
      try {
        setUsingItemId(userItemId)
        await consumeMemberItem(projectId, { item_id: userItemId })
        toast.success(`Used ${itemName}\nIts effect is applied for this battle.`)
        await refreshItems()
      } catch (error: unknown) {
        console.error('Failed to use item:', error)
        let errorMessage = 'Failed to use item'
        if (axios.isAxiosError(error)) {
          const data = error.response?.data
          if (
            data &&
            typeof data === 'object' &&
            'error' in data &&
            typeof (data as { error: unknown }).error === 'string'
          ) {
            errorMessage = (data as { error: string }).error
          } else if (error.message) {
            errorMessage = error.message
          }
        } else if (error instanceof Error) {
          errorMessage = error.message
        }
        toast.error(`Couldn’t use item\n${errorMessage}`)
        try {
          await refreshItems()
        } catch (refreshError) {
          console.warn('Failed to refresh items after use error:', refreshError)
        }
      } finally {
        setUsingItemId(null)
      }
    },
    [projectId, usingItemId, consumeMemberItem, refreshItems]
  )

  return {
    groupedItems,
    loadingItems,
    usingItemId,
    refreshItems,
    handleUseItem,
  }
}
