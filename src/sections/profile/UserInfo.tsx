import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface UserInfoProps {
  profilePicture?: string
  name?: string
  username?: string
  avatarId?: number
  backgroundColor?: string
}

export default function UserInfo(UserInfoProps: UserInfoProps) {
  const navigate = useNavigate()
  const useAvatarId =
    UserInfoProps.avatarId != null && UserInfoProps.backgroundColor

  return (
    <>
      <div className="flex items-center w-full gap-4">
        {useAvatarId ? (
          <div
            className="!h-[115px] !w-[115px] !min-w-[115px] !rounded-lg overflow-hidden flex items-center justify-center border-2 border-brown relative"
            style={{ backgroundColor: UserInfoProps.backgroundColor }}
          >
            <img
              src={`/avatars/${UserInfoProps.avatarId}.png`}
              alt={`Avatar ${UserInfoProps.avatarId}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.style.display = "none"
                el.parentElement
                  ?.querySelector(".avatar-fallback")
                  ?.classList.remove("hidden")
              }}
            />
            <span className="avatar-fallback hidden absolute inset-0 flex items-center justify-center font-['Baloo_2'] font-bold text-3xl text-darkBrown">
              {UserInfoProps.avatarId}
            </span>
          </div>
        ) : (
          <Avatar className="!h-[115px] !w-auto !rounded-md">
            <AvatarImage src={UserInfoProps.profilePicture} alt="User Avatar" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col flex-1">
          <h2 className="-mb-2 text-xl font-bold">
            {UserInfoProps.name || "Name"}
          </h2>
          <p className="!text-brown !font-medium">
            @{UserInfoProps.username || "username"}
          </p>
          <Button
            variant="default"
            className="mt-2 !font-bold w-full"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </>
  )
}
