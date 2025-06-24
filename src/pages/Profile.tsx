import UserInfo from "../sections/profile/UserInfo";
import Friends from "../components/Friends";
import UserOverview from "@/components/UserOverview";
import type { UserProfile } from "../types/User";
import Achievement from "../sections/profile/Achievements";
import BossDefeated from "@/sections/profile/BossDefeated";

const FriendsMockData: { friends: UserProfile[] } = {
  friends: [
    {
      name: "Atikarn Kruaykriangkrai",
      username: "nanokwok",
      profileImg: "https://github.com/Nanokwok.png",
      avatarFallback: "AK",
    },
    {
      name: "Napasorn Tevarut",
      username: "tonnamza550",
      profileImg: "https://github.com/tnnpp.png",
      avatarFallback: "JD",
    },
    {
      name: "Jane Smith",
      username: "janeSmith",
      profileImg: "https://github.com/shadcn.png",
      avatarFallback: "JS",
    },
    {
      name: "Alice Johnson",
      username: "aliceJ",
      profileImg: "https://github.com/shadcn.png",
      avatarFallback: "AJ",
    },
    {
      name: "Bob Brown",
      username: "bobB",
      profileImg: "https://github.com/shadcn.png",
      avatarFallback: "BB",
    },
  ] as UserProfile[],
};

export default function Profile() {
  return (
    <>
      <div className="p-8 h-[calc(100vh-140px)] overflow-hidden flex items-center bg-offWhite gap-4">
        <div className="w-[550px] h-full flex flex-col gap-4">
          <UserInfo
            profilePicture="https://github.com/shadcn.png"
            name="Atikarn Kruaykriangkrai"
            username="littleJohn"
          />
          <Friends
            friends={FriendsMockData.friends}
            friendsCount={FriendsMockData.friends.length}
          />
        </div>
        <div className="flex flex-col flex-1 h-full gap-4">
          <UserOverview />
          <Achievement />
          <BossDefeated />
        </div>
      </div>
    </>
  );
}
