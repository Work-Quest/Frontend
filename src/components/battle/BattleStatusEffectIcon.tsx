import { useEffect, useState } from 'react'
import type React from 'react'
import { Sparkles } from 'lucide-react'
import type { StatusEffectEntry } from '@/types/GameApi'

export const BattleStatusEffectIcon: React.FC<{
  effect: StatusEffectEntry
  stackCount?: number
}> = ({ effect, stackCount = 1 }) => {
  const [iconFailed, setIconFailed] = useState(false)

  useEffect(() => {
    setIconFailed(false)
  }, [effect.user_effect_id, effect.effect_type, effect.effect_id])

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
    } else {
      bgColor = 'bg-purple-500/80'
      borderColor = 'border-emerald-500'
    }
  } else {
    if (effect.effect_value == 10.0) {
      bgColor = 'bg-pink-500/80'
      borderColor = 'border-pink-400'
    } else if (effect.effect_value == 20.0) {
      bgColor = 'bg-rose-500/80'
      borderColor = 'border-rose-400'
    } else {
      bgColor = 'bg-red-500/80'
      borderColor = 'border-red-400'
    }
  }

  const getIcon = (effectType: string): string => {
    const effectIconMap: Record<string, string> = {
      DAMAGE_BUFF: '/effectIcon/damage_buff.png',
      DAMAGE_DEBUFF: '/effectIcon/damage_debuff.png',
      DEFENCE_BUFF: '/effectIcon/defense_buff.png',
      DEFENCE_DEBUFF: '/effectIcon/defense_debuff.png',
    }
    return effectIconMap[effectType] || '/effectIcon/default.png'
  }

  const src = getIcon(effect.effect_type)

  return (
    <div
      className={`${bgColor} ${borderColor} group relative flex h-7 w-7 cursor-help items-center justify-center rounded border-2 text-[10px] font-bold text-white shadow-lg`}
      title={`${effect.effect_type}\n${effect.effect_description}\nValue: ${effect.effect_value}${stackCount > 1 ? `\nStacks: ${stackCount}` : ''}`}
    >
      {iconFailed ? (
        <Sparkles className="h-4 w-4 shrink-0 text-white/95" aria-hidden />
      ) : (
        <img
          src={src}
          alt=""
          className="h-full w-full object-contain"
          onError={() => setIconFailed(true)}
        />
      )}
      {stackCount > 1 && (
        <div className="absolute -right-1 -top-1 z-10 flex h-3 w-3 items-center justify-center rounded-full border border-white bg-red-500 text-[8px] font-bold text-white shadow-md">
          {stackCount}
        </div>
      )}
      <div className="absolute left-1/2 top-full z-[60] mb-2 hidden min-w-[100px] -translate-x-1/2 whitespace-pre-line rounded border border-gray-600 bg-slate-800 px-1 py-1 text-center text-white group-hover:block">
        <div className="text-[5px] text-gray-300">{effect.effect_description}</div>
        {stackCount > 1 && <div className="text-[5px] text-orange-400">Stacks: {stackCount}</div>}
      </div>
    </div>
  )
}
