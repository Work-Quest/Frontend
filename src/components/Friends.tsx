import { Input } from "@/components/ui/input";
import FriendBox from "./FriendBox";
import { ScrollArea } from "../components/ui/scroll-area";
import type { UserProfile } from "@/types/User";

interface FriendsProps {
  friendsCount?: number;
  friends?: UserProfile[];
}

export default function Friends(friendsProps: FriendsProps) {
  return (
    <>
      <div className="flex flex-col h-full gap-4 p-4 border-2 rounded-lg border-veryLightBrown">
        <div className="flex">
          <p className="!text-2xl mr-auto">Friends</p>
          <div className="inline-flex items-center justify-center px-3 py-1 text-white rounded-full bg-lightBrown">
            {friendsProps.friendsCount || 0}
          </div>
        </div>
        <div className="">
          <Input
            placeholder="Search friends..."
            className="!border-2 !border-veryLightBrown"
          />
        </div>
        <div className="flex flex-col">
          <ScrollArea>
            <div className="flex flex-col w-full h-full gap-2">
            {friendsProps.friends?.map((friend, index) => (
              <FriendBox
                key={index}
                profilePicture={friend.profileImg}
                name={friend.name}
                username={friend.username}
                avatarFallback={friend.avatarFallback}
              />
            ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
