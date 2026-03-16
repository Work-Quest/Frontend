"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import toast from "react-hot-toast"
import { AVATAR_IDS, PRESET_COLORS } from "@/constants/avatar"

type Profile = {
  name: string
  username: string
  avatarId: number
  backgroundColor: string
}

// Mock data - ready for API: useProfile(), updateProfile(profile)
const MOCK_PROFILE: Profile = {
  name: "Atikarn Kruaykriangkrai",
  username: "littleJohn",
  avatarId: 1,
  backgroundColor: PRESET_COLORS[0].value,
}

const inputStyle =
  "w-full rounded-lg !border-brown !border-2 px-4 py-3 font-['Baloo_2'] text-darkBrown placeholder:text-brown/50 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:!border-orange !bg-cream transition-all disabled:opacity-70 disabled:cursor-not-allowed"

export default function EditProfile() {
  const navigate = useNavigate()
  // TODO: replace with useProfile() or get from API
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE)

  const { name, username, avatarId, backgroundColor } = profile

  const setName = (v: string) => setProfile((p) => ({ ...p, name: v }))
  const setUsername = (v: string) =>
    setProfile((p) => ({ ...p, username: v.replace(/^@/, "") }))
  const setAvatarId = (v: number) => setProfile((p) => ({ ...p, avatarId: v }))
  const setBackgroundColor = (v: string) =>
    setProfile((p) => ({ ...p, backgroundColor: v }))

  const handleSave = async () => {
    // TODO: await updateProfile(profile) when API is ready
    toast.success("Profile updated!")
    navigate("/profile")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream/50 via-offWhite to-cream/30 flex flex-col items-center px-4 pt-10 pb-28">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="text-center space-y-1">
          <h1 className="!text-red !font-extrabold text-3xl sm:text-4xl font-['Baloo_2'] tracking-tight">
            Edit Profile
          </h1>
          <p className="text-brown/80 text-sm font-['Baloo_2']">
            Customize your adventurer identity
          </p>
        </header>

        <section className="bg-offWhite rounded-2xl !border-veryLightBrown !border-2 p-6 sm:p-8 shadow-[0_4px_0_0_#d6cec4] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange/15 flex items-center justify-center">
              <User className="w-5 h-5 text-orange" />
            </div>
            <h2 className="font-['Baloo_2'] font-extrabold text-darkBrown text-xl">
              Profile Info
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Avatar Preview + Avatar ID selector */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center border-2 border-brown overflow-hidden relative"
                style={{ backgroundColor }}
              >
                <img
                  src={`/avatars/${avatarId}.png`}
                  alt={`Avatar ${avatarId}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.style.display = "none"
                    el.parentElement
                      ?.querySelector(".avatar-fallback")
                      ?.classList.remove("hidden")
                  }}
                />
                <span className="avatar-fallback hidden absolute inset-0 flex items-center justify-center font-['Baloo_2'] font-bold text-2xl text-darkBrown">
                  {avatarId}
                </span>
              </div>
              <p className="text-xs text-brown/60 font-['Baloo_2']">Preview</p>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-['Baloo_2']">
                Avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAvatarId(id)}
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-['Baloo_2'] font-bold text-lg transition-all ${
                      avatarId === id
                        ? "border-brown scale-105 ring-2 ring-orange/50 bg-cream"
                        : "border-veryLightBrown hover:border-brown/50 bg-cream/50"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-['Baloo_2']">
                Background Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setBackgroundColor(color.value)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      backgroundColor === color.value
                        ? "border-brown scale-110 ring-2 ring-orange/50"
                        : "border-transparent hover:border-brown/50"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                    aria-label={`Select ${color.label}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-['Baloo_2']">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputStyle}
              />
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-['Baloo_2']">
                Username
              </label>
              <div className="flex">
                <span className="flex items-center rounded-l-lg border-y-2 border-l-2 border-brown bg-veryLightBrown/50 px-4 font-['Baloo_2'] text-darkBrown">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className={inputStyle + " rounded-l-none border-l-0"}
                />
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 left-0 right-0 h-20 flex items-center justify-center bg-offWhite/95 backdrop-blur-sm z-[9999] border-t-2 border-veryLightBrown shadow-[0_-4px_20px_rgba(61,55,48,0.08)]">
          <div className="w-full max-w-2xl flex items-center justify-between px-4 sm:px-6">
            <Button
              variant="cream"
              size="default"
              onClick={() => navigate("/profile")}
              className="normal-case"
            >
              Cancel
            </Button>
            <Button
              variant="orange"
              size="default"
              onClick={handleSave}
              className="normal-case"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
