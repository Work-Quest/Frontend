import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { get } from "@/Api"
import type { BusinessUser } from "@/types/User"
import { getAvatarProfilePath, getColorValueById } from "@/constants/avatar"

interface UserInfoProps {
  userId?: string
}

export default function UserInfo({ userId }: UserInfoProps) {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [userData, setUserData] = useState<BusinessUser | null>(null)
  const [loading, setLoading] = useState(true)

  const isOwnProfile = !userId || userId === currentUser?.id
  const displayUser = isOwnProfile ? currentUser : userData

  useEffect(() => {
    const fetchUserData = async () => {
      if (isOwnProfile) {
        setUserData(null)
        setLoading(false)
        return
      }

      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const users = await get<BusinessUser[]>("/api/users/business/")
        const user = users.find((u) => u.id === userId)
        setUserData(user || null)
      } catch (err) {
        console.error("Failed to fetch user data:", err)
        setUserData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, isOwnProfile])

  if (loading) {
    return (
      <div className="flex items-center w-full gap-4">
        <div className="!h-[115px] !w-[115px] !min-w-[115px] !rounded-lg bg-gray-200 animate-pulse" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    )
  }

  if (!displayUser) {
    return (
      <div className="flex items-center w-full gap-4">
        <Avatar className="!h-[115px] !w-auto !rounded-md">
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h2 className="-mb-2 text-xl font-bold">User not found</h2>
          <p className="!text-brown !font-medium">@unknown</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center w-full gap-4">
        <Avatar
          className="!h-[115px] !w-auto !rounded-md"
          style={{ backgroundColor: getColorValueById(displayUser.bg_color_id) }}
        >
          <AvatarImage
            src={getAvatarProfilePath(displayUser.selected_character_id)}
            alt="User Avatar"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.onerror = null;
              target.src = "/mockImg/profile.svg";
            }}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <h2 className="-mb-2 text-xl font-bold">
            {displayUser.name || "Name"}
          </h2>
          <p className="!text-brown !font-medium">
            @{displayUser.username || "username"}
          </p>
          {isOwnProfile && (
            <Button
              variant="default"
              className="mt-2 !font-bold w-full"
              onClick={() => navigate("/profile/edit")}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
