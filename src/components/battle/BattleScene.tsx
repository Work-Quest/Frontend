import React, { useState, useMemo } from 'react'
import { SpriteEntity } from '@/components/battle/SpriteEntity'
import { POSITIONS, ENTITY_CONFIG } from '@/config/battleConfig'
import { User, BossState } from '@/types/battleTypes'
import EnemyHealthDisplay from '@/components/ui/8bit/enemy-health-display'
import { useGame } from '@/hook/useGame'
import type { StatusEffectEntry } from '@/types/GameApi'
import { usePolling } from '@/hook/usePolling'
import { POLLING_CONFIG } from '@/config/pollingConfig'

interface BattleSceneProps {
  users: User[]
  boss: BossState
  projectId: string | null
  myProjectMemberId: string | null
}

const getUserPosition = (slot: number, status: string) => {
  if (slot === -1) return POSITIONS.graveyard
  if (status === 'damage' && slot > 3) return POSITIONS.queue_peek
  if (status === 'walking_in' || status === 'attacking') return POSITIONS.center
  if (status === 'walking_out') return POSITIONS.p1
  if (slot === 0) return POSITIONS.p1
  if (slot === 1) return POSITIONS.p2
  if (slot === 2) return POSITIONS.p3
  if (slot === 3) return POSITIONS.p4
  return POSITIONS.offscreen_queue
}

type BossEntityKey = keyof typeof ENTITY_CONFIG.bosses

function getBossEntity(bossId: string) {
  if (bossId in ENTITY_CONFIG.bosses) {
    return ENTITY_CONFIG.bosses[bossId as BossEntityKey]
  }
  return undefined
}

const getBossPosition = (status: string, bossId: string) => {
  const bossConfig = getBossEntity(bossId)

  const basePosition = bossConfig?.position || POSITIONS.boss_spot_default

  if (status === 'hidden') {
    return { ...basePosition, opacity: 0 }
  }

  if (status === 'moving_in' || status === 'attacking') {
    return POSITIONS.center
  }

  return { ...basePosition, opacity: 1 }
}

const EffectIconPlaceholder: React.FC<{
  effect: StatusEffectEntry
  stackCount?: number
}> = ({ effect, stackCount = 1 }) => {
  const isBuff = effect.effect_polarity === 'GOOD'
  let bgColor
  let borderColor
  if (isBuff) {
    if (effect.effect_value == 10) {
      bgColor = 'bg-lime-500/80'
      borderColor = 'border-lime-500'
    } else if (effect.effect_value == 20) {
      bgColor = 'bg-cyan-500/80'
      borderColor = 'border-green-500'
    } else bgColor = 'bg-purple-500/80'
    borderColor = 'border-emerald-500'
  } else {
    if (effect.effect_value == 10.0) {
      bgColor = 'bg-pink-500/80'
      borderColor = 'border-pink-400'
    } else if (effect.effect_value == 20.0) {
      bgColor = 'bg-rose-500/80'
      borderColor = 'border-rose-400'
    } else bgColor = 'bg-red-500/80'
    borderColor = 'border-red-400'
  }

  // Abbreviate effect type for display (e.g., "DAMAGE_BUFF" -> "DB")
  const getIcon = (effectType: string): string => {
    // Map effect types to their icon image paths
    const effectIconMap: Record<string, string> = {
      DAMAGE_BUFF: '/effectIcon/damage_buff.png',
      DAMAGE_DEBUFF: '/effectIcon/damage_debuff.png',
      DEFENCE_BUFF: '/effectIcon/defense_buff.png',
      DEFENCE_DEBUFF: '/effectIcon/defense_debuff.png',
    }

    // Return the mapped path, or a default placeholder if not found
    return effectIconMap[effectType] || '/effectIcon/default.png'
  }

  return (
    <div
      className={`${bgColor} ${borderColor} border-2 rounded w-4 h-4 flex items-center justify-center text-white text-[10px] font-bold shadow-lg cursor-help relative group`}
      title={`${effect.effect_type}\n${effect.effect_description}\nValue: ${effect.effect_value}${stackCount > 1 ? `\nStacks: ${stackCount}` : ''}`}
    >
      <img
        src={getIcon(effect.effect_type)}
        alt={effect.effect_type}
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to placeholder if image doesn't exist
          ;(e.target as HTMLImageElement).src = '/effectIcon/default.png'
        }}
      />
      {/* Stack count badge */}
      {stackCount > 1 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px] font-bold border border-white shadow-md z-10">
          {stackCount}
        </div>
      )}
      {/* Tooltip on hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[60] bg-slate-800 border border-gray-600 rounded px-1 py-1 gap-2 text-white whitespace-pre-line text-center min-w-[100px]">
        <div className="text-gray-300 text-[5px] ">{effect.effect_description}</div>
        {stackCount > 1 && <div className="text-orange-400 text-[5px] ">Stacks: {stackCount}</div>}
      </div>
    </div>
  )
}

export const BattleScene: React.FC<BattleSceneProps> = ({
  users,
  boss,
  projectId,
  myProjectMemberId,
}) => {
  const bossName = getBossEntity(boss.id)?.name || 'GREAT BOSS'
  const { getMyStatusEffects } = useGame(projectId ?? undefined)
  const [statusEffects, setStatusEffects] = useState<StatusEffectEntry[]>([])

  // Fetch status effects when projectId changes
  // Note: API uses authenticated user automatically, but we filter by myProjectMemberId if available
  const refreshEffects = React.useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!projectId) {
        setStatusEffects([])
        return
      }

      try {
        const data = await getMyStatusEffects(projectId, opts?.silent)
        // Handle both response formats: { member } or { members }
        if ('member' in data && data.member) {
          setStatusEffects(data.member.effects || [])
        } else if ('members' in data && Array.isArray(data.members)) {
          // If myProjectMemberId is available, filter to that member, otherwise use first member
          const myMember = myProjectMemberId
            ? data.members.find((m) => m.project_member_id === myProjectMemberId)
            : data.members[0]
          setStatusEffects(myMember?.effects || [])
        } else {
          setStatusEffects([])
        }
      } catch (error) {
        console.error('Failed to fetch status effects:', error)
        // Don't show toast for effects - it's less critical than items
      }
    },
    [projectId, myProjectMemberId, getMyStatusEffects]
  )

  // Use centralized polling hook for effects
  usePolling(
    refreshEffects,
    {
      pollIntervalMs: POLLING_CONFIG.effects.interval,
      enabled: true,
    },
    [projectId, myProjectMemberId]
  )

  // Group effects by effect_id and count stacks
  const groupedEffects = useMemo(() => {
    const grouped = new Map<
      string,
      {
        effect: StatusEffectEntry
        count: number
        userEffectIds: string[]
      }
    >()

    statusEffects.forEach((effect) => {
      const existing = grouped.get(effect.effect_id)
      if (existing) {
        existing.count += 1
        existing.userEffectIds.push(effect.user_effect_id)
      } else {
        grouped.set(effect.effect_id, {
          effect,
          count: 1,
          userEffectIds: [effect.user_effect_id],
        })
      }
    })

    return Array.from(grouped.values())
  }, [statusEffects])

  return (
    <div className="flex-1 min-h-[400px] flex items-end justify-center pb-12 overflow-hidden relative z-0">
      <div
        className="relative border-4 border-gray-600 shadow-2xl origin-bottom"
        style={{
          width: '476px',
          height: '140px',
          transform: 'scale(2.5)',
          imageRendering: 'pixelated',
        }}
      >
        <img src="/assets/bg.gif" className="absolute inset-0 w-full h-full object-cover z-0" />

        {boss.status !== 'hidden' && (
          <div className="absolute left-1/2 -translate-x-1/2 w-full z-40 pointer-events-none scale-35 transition-opacity duration-500">
            <EnemyHealthDisplay
              enemyName={bossName}
              currentHealth={boss.hp}
              maxHealth={boss.maxHp}
              variant="retro"
              healthBarVariant="default"
              size="sm"
              className="shadow-lg"
              textColor="yellow"
            />
          </div>
        )}

        {/* Status effects (bag / phase moved to BattleResponsiveHud in BossPlaceholder) */}
        {groupedEffects.length > 0 && (
          <div className="absolute top-2 right-2 z-50 flex flex-col gap-1">
            {groupedEffects.map((grouped) => (
              <EffectIconPlaceholder
                key={grouped.effect.effect_id}
                effect={grouped.effect}
                stackCount={grouped.count}
              />
            ))}
          </div>
        )}

        {(() => {
          let action = 'idle'
          if (boss.status === 'moving_in') action = 'walk_left'
          if (boss.status === 'moving_out') action = 'walk_right'
          if (boss.status === 'attacking') action = 'attack'
          if (boss.status === 'damage') action = 'damage'
          if (boss.status === 'dead' || boss.status === 'hidden') action = 'dead'

          return (
            <SpriteEntity
              type="bosses"
              id={boss.id}
              action={action}
              positionStyle={getBossPosition(boss.status, boss.id)}
              isMirrored={false}
              name={boss.status === 'hidden' ? undefined : bossName}
            />
          )
        })()}

        {users.map((user) => {
          let action = 'idle'
          let isMirrored = false

          if (user.status === 'walking_in') {
            action = 'walk_right'
          } else if (user.status === 'walking_out') {
            action = 'walk_left'
            isMirrored = false
          } else if (user.status === 'attacking') {
            action = 'attack'
          } else if (user.status === 'damage') {
            action = 'damage'
          } else if (user.status === 'dead') {
            action = 'dead'
          } else if (user.status === 'shifting_forward') {
            action = 'walk_right'
            isMirrored = false
          } else if (user.status === 'shifting_backward') {
            action = 'walk_left'
            isMirrored = false
          }

          return (
            <SpriteEntity
              key={user.uid}
              type="characters"
              id={user.charId}
              action={action}
              positionStyle={getUserPosition(user.slot, user.status)}
              isMirrored={isMirrored}
              name={user.status === 'dead' ? undefined : user.name}
              showBuffRing={user.hasBuffRing}
            />
          )
        })}
      </div>
    </div>
  )
}
