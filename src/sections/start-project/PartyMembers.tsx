// src/sections/start-project/PartyMembers.tsx
import { X } from 'lucide-react'
import { getAvatarPath } from '@/lib/avatarConstants'
import { getColorValueById } from '@/constants/avatar'
import { PartyMember } from '@/types/User'
import MultiCombobox from '@/components/ui/multicombobox'
import useBussinessUser from '@/hook/useBussinessUser'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { post } from '@/Api'
import { getAxiosStatus } from '@/lib/apiError'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

interface PartyMembersProps {
  members: PartyMember[]
  // maxSize: number;
  removeMember: (id: string) => void
  canRemoveMember?: (member: PartyMember) => boolean
  isLoading: boolean
}

export function PartyMembers({
  members,
  removeMember,
  canRemoveMember,
  isLoading,
}: PartyMembersProps) {
  const { projectId } = useParams<{ projectId: string }>()
  const { users } = useBussinessUser()
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const memberOptions = users.map((u) => ({
    value: u.id,
    label: `@${u.username} (${u.name})`,
  }))

  type InviteResponse = {
    project_id: string
    invited: { email: string; token: string; expired_at: string }[]
    failed: { email: string; error: string }[]
    error?: string
  }

  async function handleInvite() {
    if (!projectId) {
      toast.error('Missing project id.\nOpen this page from a project link and try again.')
      return
    }

    if (selectedMembers.length === 0) {
      toast.error('No adventurers selected\nPick at least one user from the list to send invites.')
      return
    }

    const partyMemberIds = new Set(members.map((m) => m.id))
    const uniqueUserIds = Array.from(new Set(selectedMembers)).filter(
      (id) => !partyMemberIds.has(id)
    )

    console.log(uniqueUserIds)

    if (uniqueUserIds.length === 0) {
      toast.error('Already in the party\nEveryone you picked is already on this quest.')
      return
    }

    try {
      const res = await post<{ user_ids: string[] }, InviteResponse>(
        `/api/project/${projectId}/invite/`,
        { user_ids: uniqueUserIds }
      )

      if (res.failed?.length) {
        toast.error(
          `Some invites failed\n${res.failed.length} user(s) could not be invited. Check the console for details.`
        )
        console.error('Invite failures:', res.failed)
      }
      if (res.invited?.length) {
        toast.success(
          `Invited ${res.invited.length} user(s)!\nThey’ll get access to join this project.`
        )
      }

      setSelectedMembers([])
    } catch (err: unknown) {
      const status = getAxiosStatus(err)
      if (status === 403) {
        toast.error('Only the owner can invite\nAsk the project owner to add new party members.')
      } else {
        toast.error('Invites not sent\nCheck your connection and try again in a moment.')
      }
      console.error(err)
    }
  }
  return (
    <div className="bg-white rounded-2xl border border-brown/10 shadow-sm p-5 md:p-6 flex flex-col gap-6 flex-1">
      <div className="flex items-center gap-3 border-b border-offWhite pb-4">
        <h3 className="text-xl font-bold text-darkBrown">Summon Party Members</h3>
      </div>
      {/* Search Bar */}
      <div className="flex items-baseline-last gap-2">
        <MultiCombobox
          label="Invite adventurers"
          placeholder="Search adventurers..."
          searchPlaceholder="Search adventurers..."
          options={memberOptions}
          value={selectedMembers}
          onChange={setSelectedMembers}
        />
        <Button type="button" onClick={handleInvite} disabled={selectedMembers.length === 0}>
          Invite
        </Button>
      </div>
      {/* Header Row with Dynamic Count */}
      <div className="flex items-center justify-between mt-1">
        <span className="font-bold text-darkBrown text-sm">
          Your Party{' '}
          <span
            // className={
            //   members.length === maxSize ? "text-red" : "text-lightBrown"
            // }
            className="text-lightBrown"
          >
            ({members.length}
            {/* /{maxSize} */})
          </span>
        </span>
      </div>

      {/* Scrollable Party List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-brown/10 bg-offWhite/50 hover:bg-offWhite transition-colors cursor-default group"
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0"
              style={{
                backgroundColor: getColorValueById(member.avatarBgColorId),
              }}
            >
              <img
                src={getAvatarPath(member.avatarId)}
                alt={member.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold text-darkBrown text-sm flex items-center gap-2">
                {member.name}
                {member.isLeader && (
                  <span className="text-[10px] bg-orange/20 text-orange px-1.5 py-0.5 rounded-md">
                    Leader
                  </span>
                )}
              </span>
              <span className="text-lightBrown text-xs font-medium">{member.username}</span>
            </div>

            {/* Remove Button (Only for non-leaders) */}
            {Boolean(canRemoveMember ? canRemoveMember(member) : !member.isLeader) && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => removeMember(member.id)}
                className="p-1.5 text-gray-400 hover:text-red hover:bg-red/10 rounded-full transition-colors group-hover:opacity-100 disabled:opacity-0"
                title="Remove from party"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {/* Empty State */}
        {members.length < 1 && (
          <div className="border border-dashed border-brown/20 rounded-xl p-4 flex justify-center items-center text-xs text-lightBrown italic">
            Waiting for adventurers...
          </div>
        )}
      </div>

      <div className="flex-1"></div>
    </div>
  )
}
