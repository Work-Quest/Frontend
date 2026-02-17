export type BossData = {
  project_boss_id: string
  project: string
  boss: string | null
  boss_name: string | null
  boss_image: string | null
  hp: number
  max_hp: number
  status: string
  phase?: number
}

export type SetupBossResponse = {
  message: string
  boss: BossData
}

export type BossStatusResponse = {
  project_boss_id: string
  project_id: string
  boss_id: string | null
  boss_name: string | null
  boss_image: string | null
  hp: number
  max_hp: number
  status: string
  phase: number
  updated_at: string
}

export type UserStatusEntry = {
  project_member_id: string
  user_id: string
  username: string
  hp: number
  max_hp: number
  score: number
  status: string
}

export type UserStatusesResponse = {
  project_id: string
  user_statuses: UserStatusEntry[]
}

export type GameStatusResponse = {
  project_id: string
  boss_status: BossStatusResponse
  user_statuses: UserStatusEntry[]
}

export type PlayerAttackRequest = {
  task_id: string
}

export type PlayerAttackEntry = {
  player_id: string
  task_id: string
  damage: number
  score: number
  boss_hp: number
  boss_max_hp: number
  boss_phase?: number
  boss_phase_advanced?: boolean
}

export type PlayerAttackResult = {
  task_id: string
  attacks: PlayerAttackEntry[]
  skipped: Array<{ player_id: string; reason: string }>
  total_damage: number
  boss_hp: number
  boss_max_hp: number
  boss_phase?: number
  boss_phase_advanced?: boolean
}

export type PlayerAttackResponse = {
  message: string
  result: PlayerAttackResult
}

export type BossAttackRequest = {
  task_id: string
}

export type BossAttackResult = {
  task_id: string
  attacked_players: Array<{
    player_id: string
    damage: number
    hp: number
    max_hp: number
  }>
}

export type BossAttackResponse = {
  message: string
  result: BossAttackResult
}

export type PlayerHealRequest = {
  healer_id: string
  player_id: string
  heal_value: number
}

export type PlayerHealResult = {
  healer_id: string
  player_id: string
  hp: number
  max_hp: number
}

export type PlayerHealResponse = {
  message: string
  result: PlayerHealResult
}

export type PlayerSupportRequest = {
  report_id: string
}

export type PlayerSupportResponse = {
  message: string
  result: {
    report_id: string
    reporter: {
      reporter_id: string
      score_recieve: number
      total_score: number
    }
    applied: Array<
      | {
          receiver_id: string
          applied: false
          reason: string
        }
      | {
          reporter_id: string
          receiver_id: string
          applied: true
          type: "item"
          received: string
          item: {
            item_id: string
            item_name: string
            item_description: string
          }
        }
      | {
          reporter_id: string
          receiver_id: string
          applied: true
          type: "effect"
          received: string
          effect: {
            effect_id: string
            effect_type: string
            effect_value: number
            effect_polarity: string
            effect_description: string
          }
          heal?: PlayerHealResult
        }
    >
  }
}

export type ReviveRequest = {
  player_id: string
}

export type MessageResponse = {
  message: string
}

export type ItemEffectPayload = {
  effect_id: string
  effect_type: string
  effect_value: number
  effect_polarity: string
  effect_description: string
}

export type ProjectMemberItemsResponse = {
  project_id: string
  project_member_id: string
  items: Array<{
    user_item_id: string
    item: {
      item_id: string
      name: string
      description: string
      effect: ItemEffectPayload | null
    }
    created_at: string
  }>
}

export type UseProjectMemberItemRequest = {
  item_id: string
  player_id?: string
}

export type UseProjectMemberItemResponse = {
  message: string
  result: {
    player_id: string
    item_id: string
    item: {
      item_id: string
      item_name: string
      item_description: string
    }
    effect_received:
      | null
      | (ItemEffectPayload & { user_effect_id?: string })
    heal?: PlayerHealResult
  }
}

export type StatusEffectEntry = {
  user_effect_id: string
  effect_id: string
  effect_type: string
  effect_value: number
  effect_polarity: string
  effect_description: string
  created_at: string
}

export type ProjectMemberWithEffects = {
  project_member_id: string
  user_id: string
  username: string
  hp: number
  max_hp: number
  score: number
  status: string
  effects: StatusEffectEntry[]
}

export type ProjectMemberStatusEffectsResponse =
  | { project_id: string; member: ProjectMemberWithEffects | null }
  | { project_id: string; members: ProjectMemberWithEffects[] }






