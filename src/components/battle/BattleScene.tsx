import React from 'react'
import { SpriteEntity } from '@/components/battle/SpriteEntity'
import { useBattleAssetPreload } from '@/hook/useBattleAssetPreload'
import { POSITIONS, ENTITY_CONFIG } from '@/config/battleConfig'
import { User, BossState } from '@/types/battleTypes'
import EnemyHealthDisplay from '@/components/ui/8bit/enemy-health-display'
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

export const BattleScene: React.FC<BattleSceneProps> = (props) => {
  const { users, boss } = props
  const bossName = getBossEntity(boss.id)?.name || 'GREAT BOSS'

  useBattleAssetPreload(users, boss)

  return (
    <div className="relative z-0 flex min-h-[400px] flex-1 items-end justify-center overflow-hidden pb-12">
      <div
        className="relative origin-bottom border-4 border-gray-600 shadow-2xl"
        style={{
          width: '476px',
          height: '140px',
          transform: 'scale(2.5)',
          imageRendering: 'pixelated',
        }}
      >
        <img
          src="/assets/bg.gif"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />

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
