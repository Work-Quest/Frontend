import React from 'react'
import ProjectBattle from './ProjectBattle'
import { GameActionPayload } from '@/types/battleTypes'
import type { UserStatus } from '@/types/User'

interface BossPlaceholderProps {
  isVisible: boolean
  projectMembers: UserStatus[]
  payloadBatch: GameActionPayload[]
  payloadBatchNonce: number
  bossRefreshNonce: number
  bossUpdate: { hp: number; maxHp: number }
  bossUpdateNonce: number
  projectId?: string | null
  bossPhase?: number
  showBossPhase?: boolean
}

const BossPlaceholder: React.FC<BossPlaceholderProps> = ({
  isVisible,
  projectMembers,
  payloadBatch,
  payloadBatchNonce,
  bossRefreshNonce,
  bossUpdate,
  bossUpdateNonce,
  projectId,
  bossPhase,
  showBossPhase = true,
}) => (
  <div
    className={`relative overflow-x-hidden overflow-y-visible transition-all duration-500 ease-in-out ${
      isVisible ? 'h-82' : 'h-10'
    }`}
  >
    <ProjectBattle
      projectMembers={projectMembers ?? []}
      payloadBatch={payloadBatch}
      payloadBatchNonce={payloadBatchNonce}
      bossRefreshNonce={bossRefreshNonce}
      bossUpdate={bossUpdate}
      bossUpdateNonce={bossUpdateNonce}
      battleHudProjectId={projectId ?? undefined}
      battleHudPhase={bossPhase}
      showBattleHudPhase={showBossPhase}
    />
  </div>
)

export default BossPlaceholder
