import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserInfoProps {
  profilePicture?: string;
  name?: string;
  username?: string;
}

export default function UserInfo(UserInfoProps: UserInfoProps) {
  return (
    <>
      <div className="flex items-center w-full gap-4">
        <Avatar className="!h-[115px] !w-auto !rounded-md">
          <AvatarImage src={UserInfoProps.profilePicture} alt="User Avatar" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h2 className="-mb-2 text-xl font-bold">
            {UserInfoProps.name || "Name"}
          </h2>
          <p className="!text-brown !font-medium">
            @{UserInfoProps.username || "username"}
          </p>
          <Button variant="default" className="mt-2 !font-bold w-full">
            Edit Profile
          </Button>
        </div>
      </div>
    </>
  );
}
