import { Crown } from 'lucide-react'

type TeamSummaryBoxProps = {
  user: {
    name: string
    score: number
    damageDeal: number
    damageReceive: number
    status: string
    isMVP: boolean
  }
  /** Highlight card for the signed-in member (orange “You” style). */
  isYou?: boolean
}

const rowClass =
  'flex justify-between items-center gap-4 py-1.5 border-b border-brown/5 last:border-0'

export default function TeamSummaryBox({
  user: { name, score, damageDeal, damageReceive, status, isMVP },
  isYou = false,
}: TeamSummaryBoxProps) {
  if (isYou) {
    return (
      <div className="w-full rounded-2xl bg-orange p-4 shadow-md border-b-4 border-[#f76652] text-offWhite">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Crown className="w-6 h-6 text-offWhite shrink-0" strokeWidth={2} />
            <h3 className="!text-lg !sm:text-xl !font-bold font-['Baloo_2'] truncate !text-offWhite">
              You{isMVP ? ' · MVP' : ''}
            </h3>
          </div>
        </div>
        <div className="space-y-0 font-['Baloo_2'] text-sm mt-1">
          <div className={rowClass}>
            <span className="text-offWhite/85">Score</span>
            <span className="font-bold tabular-nums">{score.toLocaleString()}</span>
          </div>
          <div className={rowClass}>
            <span className="text-offWhite/85">Damage deal</span>
            <span className="font-bold tabular-nums">{damageDeal.toLocaleString()}</span>
          </div>
          <div className={rowClass}>
            <span className="text-offWhite/85">Damage receive</span>
            <span className="font-bold tabular-nums">{damageReceive.toLocaleString()}</span>
          </div>
          <div className={rowClass}>
            <span className="text-offWhite/85">Status</span>
            <span className="font-bold">{status}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl bg-white border border-brown/10 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-brown/10">
        <h3 className="!text-lg !font-bold !text-darkBrown line-clamp-1 truncate">
          {name}
          {isMVP ? <span className="text-red ml-1 text-base font-bold">MVP</span> : null}
        </h3>
      </div>
      <div className="space-y-0 font-['Baloo_2'] text-sm text-darkBrown">
        <div className={rowClass}>
          <span className="text-lightBrown">Score</span>
          <span className="font-semibold tabular-nums">{score.toLocaleString()}</span>
        </div>
        <div className={rowClass}>
          <span className="text-lightBrown">Damage deal</span>
          <span className="font-semibold tabular-nums">{damageDeal.toLocaleString()}</span>
        </div>
        <div className={rowClass}>
          <span className="text-lightBrown">Damage receive</span>
          <span className="font-semibold tabular-nums">{damageReceive.toLocaleString()}</span>
        </div>
        <div className={rowClass}>
          <span className="text-lightBrown">Status</span>
          <span className="font-semibold">{status}</span>
        </div>
      </div>
    </div>
  )
}
