import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { FaUserMinus } from "react-icons/fa6";

interface FriendBoxProps {
  name?: string;
  username?: string;
  profilePicture?: string;
  avatarFallback?: string;
}

export default function FriendBox(FriendBoxProps: FriendBoxProps) {
  return (
    <>
      <div className="flex flex-row p-2 border-2 rounded-md border-veryLightBrown">
        <div className="flex flex-row items-center gap-4 mr-auto">
          <Avatar variant="round" className="!h-[50px] !w-[50px] rounded-md">
            <AvatarImage
              src={FriendBoxProps.profilePicture}
              alt="Friend Avatar"
            />
            <AvatarFallback>
              {FriendBoxProps.avatarFallback || "AA"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="!text-xl font-bold -mb-1">
              {FriendBoxProps.name || "Name"}
            </p>
            <a
              href={`/${FriendBoxProps.username}`}
              className="text-lightBrown text-base font-medium font-['Baloo_2']"
            >
              @{FriendBoxProps.username}
            </a>
          </div>
        </div>
        <Button variant="orange">
          <FaUserMinus />
        </Button>
      </div>
    </>
  );
}
