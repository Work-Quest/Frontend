import type { UserScore } from '@/sections/project-end/User'
import { getAvatarProfilePath, getColorValueById } from '@/constants/avatar'
import { Swords, HeartPulse } from 'lucide-react'

type SpecialAwardsProps = {
  users: UserScore[]
  currentUserId?: string
  /** Omit outer section title; render only the two cards (for grid layout with Achievements). */
  embedded?: boolean
}

function topBy(users: UserScore[], pick: (u: UserScore) => number): UserScore | null {
  if (!users.length) return null
  return [...users].reduce((best, u) => (pick(u) > pick(best) ? u : best))
}

export default function SpecialAwards({
  users,
  currentUserId,
  embedded = false,
}: SpecialAwardsProps) {
  if (!users.length) return null

  const dealMost = topBy(users, (u) => u.damageDeal)
  const recvMost = topBy(users, (u) => u.damageReceive)

  if (!dealMost && !recvMost) return null

  const AwardCard = ({
    title,
    accentClass,
    icon: Icon,
    user,
    subtitle,
  }: {
    title: string
    accentClass: string
    icon: typeof Swords
    user: UserScore | null
    subtitle: string
  }) => (
    <div
      className={
        embedded
          ? 'min-w-0 w-full h-full rounded-2xl border border-brown/10 bg-white shadow-sm overflow-hidden'
          : 'flex-1 min-w-[240px] rounded-2xl border border-brown/10 bg-white shadow-sm overflow-hidden'
      }
    >
      <div className={`px-4 py-2.5 flex items-center gap-2 ${accentClass}`}>
        <Icon className="w-5 h-5 text-offWhite shrink-0" strokeWidth={2} />
        <span className="font-baloo2 font-bold text-offWhite text-sm sm:text-base">
          {title}
        </span>
      </div>
      <div className="p-4 flex items-center gap-3">
        {user ? (
          <>
            <div
              className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-veryLightBrown"
              style={{ backgroundColor: getColorValueById(user.bg_color_id) }}
            >
              <img
                src={getAvatarProfilePath(user.selected_character_id)}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.currentTarget
                  t.onerror = null
                  t.src = '/mockImg/profile.svg'
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="!font-bold text-darkBrown truncate">
                {user.name}
                {currentUserId && user.user_id === currentUserId ? (
                  <span className="text-orange font-medium"> (You)</span>
                ) : null}
              </p>
              <p className="text-sm text-lightBrown font-baloo2">{subtitle}</p>
            </div>
          </>
        ) : (
          <p className="text-lightBrown text-sm font-baloo2">—</p>
        )}
      </div>
    </div>
  )

  const cards = (
    <>
      <AwardCard
        title="Deal most damage"
        accentClass="bg-red"
        icon={Swords}
        user={dealMost}
        subtitle={dealMost ? `${dealMost.damageDeal.toLocaleString()} damage dealt` : ''}
      />
      <AwardCard
        title="Receive most damage"
        accentClass="bg-[#70BEFF]"
        icon={HeartPulse}
        user={recvMost}
        subtitle={recvMost ? `${recvMost.damageReceive.toLocaleString()} damage taken` : ''}
      />
    </>
  )

  if (embedded) {
    return cards
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-darkBrown font-baloo2">Special awards</h2>
      <div className="flex flex-col sm:flex-row gap-4">{cards}</div>
    </section>
  )
}
