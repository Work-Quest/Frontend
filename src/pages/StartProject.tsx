import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { MissionDetails } from "@/sections/start-project/MissionDetails";
import { PartyMembers } from "@/sections/start-project/PartyMembers";
import { PartyMember } from "@/types/User";
import { QuestFormData } from "@/types/Quest";

// Constants
const MAX_PARTY_SIZE = 5;

// Mock Data (Move to constants or API hook later)
const INITIAL_PARTY: PartyMember[] = [
  {
    id: "u1",
    name: "You",
    username: "@your_username",
    avatarId: 1,
    avatarBgColorId: 2,
    isLeader: true,
  },
  {
    id: "u2",
    name: "Alice",
    username: "@alice_dev",
    avatarId: 3,
    avatarBgColorId: 4,
  },
  {
    id: "u3",
    name: "Bob",
    username: "@bob_design",
    avatarId: 2,
    avatarBgColorId: 5,
  },
  {
    id: "u4",
    name: "Charlie",
    username: "@charlie_pm",
    avatarId: 5,
    avatarBgColorId: 1,
  },
  {
    id: "u5",
    name: "Dave",
    username: "@dave_qa",
    avatarId: 4,
    avatarBgColorId: 3,
  },
];

function StartProject() {
  //   const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<QuestFormData>({
    questName: "",
    startDate: "",
    dueDate: "",
  });
  const [partyMembers, setPartyMembers] =
    useState<PartyMember[]>(INITIAL_PARTY);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://workquest.app/invite/${Math.random().toString(36).substring(7)}`,
    );
    toast.success("Invite link copied!");
  };

  const removeMember = (id: string) => {
    setPartyMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.questName,
      startDate: new Date(formData.startDate).toISOString(),
      deadline: new Date(formData.dueDate).toISOString(),
      partyMemberIds: partyMembers.map((m) => m.id),
      ownerId: partyMembers.find((m) => m.isLeader)?.id || "u1",
    };

    try {
      console.log("API Payload:", payload);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Quest started successfully!");
      // navigate(`/project/123`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start quest.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-offWhite p-4 md:p-8 font-['Baloo_2'] text-darkBrown flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex flex-col mb-4 md:mb-6">
        <h2 className="text-3xl md:text-4xl font-bold !text-red tracking-tight">
          Start a New Quest
        </h2>
        <p className="text-lightBrown font-medium text-sm md:text-base mt-1">
          Define your mission objectives and gather your party.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start"
      >
        {/* Left Column */}
        <MissionDetails
          formData={formData}
          handleChange={handleChange}
          isLoading={isLoading}
        />

        {/* Right Column */}
        <div className="flex flex-col gap-5 h-full">
          <PartyMembers
            members={partyMembers}
            maxSize={MAX_PARTY_SIZE}
            removeMember={removeMember}
            handleCopyLink={handleCopyLink}
            isLoading={isLoading}
          />

          <Button
            variant="default"
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg bg-orange hover:bg-red text-white font-bold rounded-xl border-b-[4px] border-[#d95845] active:border-b-0 active:translate-y-[4px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Summoning..." : "Start Quest"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default StartProject;
