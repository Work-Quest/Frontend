// src/sections/start-project/PartyMembers.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Link as LinkIcon, X } from "lucide-react";
import { getAvatarColor, getAvatarPath } from "@/lib/avatarConstants";
import { PartyMember } from "@/types/User";

interface PartyMembersProps {
  members: PartyMember[];
  maxSize: number;
  removeMember: (id: string) => void;
  handleCopyLink: () => void;
  isLoading: boolean;
}

export function PartyMembers({
  members,
  maxSize,
  removeMember,
  handleCopyLink,
  isLoading,
}: PartyMembersProps) {
  return (
    <div className="bg-white rounded-2xl border border-brown/10 shadow-sm p-5 md:p-6 flex flex-col gap-6 flex-1">
      <div className="flex items-center gap-3 border-b border-offWhite pb-4">
        <h3 className="text-xl font-bold text-darkBrown">
          Summon Party Members
        </h3>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lightBrown group-hover:text-orange transition-colors w-4 h-4" />
        <Input
          placeholder="Search for adventurers..."
          disabled={isLoading}
          className="h-11 pl-10 text-sm bg-offWhite border border-brown/20 rounded-full focus-visible:ring-2 focus-visible:ring-orange focus-visible:border-orange transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Header Row with Dynamic Count */}
      <div className="flex items-center justify-between mt-1">
        <span className="font-bold text-darkBrown text-sm">
          Your Party{" "}
          <span
            className={
              members.length === maxSize ? "text-red" : "text-lightBrown"
            }
          >
            ({members.length}/{maxSize})
          </span>
        </span>
        <Button
          type="button"
          variant="orange"
          onClick={handleCopyLink}
          disabled={isLoading}
          className="h-8 text-xs px-3 gap-1.5"
        >
          <LinkIcon className="w-3 h-3" />
          Copy Link
        </Button>
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
                backgroundColor: getAvatarColor(member.avatarBgColorId),
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
              <span className="text-lightBrown text-xs font-medium">
                {member.username}
              </span>
            </div>

            {/* Remove Button (Only for non-leaders) */}
            {!member.isLeader && (
              <button
                type="button"
                disabled={isLoading}
                onClick={() => removeMember(member.id)}
                className="p-1.5 text-gray-400 hover:text-red hover:bg-red/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                title="Remove from party"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {/* Empty State */}
        {members.length < maxSize && (
          <div className="border border-dashed border-brown/20 rounded-xl p-4 flex justify-center items-center text-xs text-lightBrown italic">
            Waiting for adventurers...
          </div>
        )}
      </div>

      <div className="flex-1"></div>
    </div>
  );
}
