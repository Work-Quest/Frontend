import type { GameActionPayload } from "@/types/battleTypes"

/**
 * Generates a unique key for an action to be used for deduplication.
 * Format: "act:taskId" when taskId is provided, "act" when taskId is not available.
 * 
 * @param action - The game action payload
 * @param taskId - Optional task ID associated with the action
 * @returns Unique key string for the action
 * 
 * @example
 * getActionKey({ act: "ATTACK", userId: "123" }, "task-456") // "ATTACK:task-456"
 * getActionKey({ act: "BOSS_DIE" }) // "BOSS_DIE"
 * getActionKey({ act: "BOSS_ATTACK_USER", userId: "456" }, "task-789") // "BOSS_ATTACK_USER:task-789"
 */
export function getActionKey(action: GameActionPayload, taskId?: string): string {
  if (taskId) {
    return `${action.act}:${taskId}`
  }
  return action.act
}

