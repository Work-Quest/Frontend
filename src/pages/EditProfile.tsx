'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import toast from 'react-hot-toast'
import { patch } from '@/Api'
import { useAuth } from '@/context/AuthContext'
import {
  AVATAR_IDS,
  PRESET_COLORS,
  getAvatarProfilePath,
  getColorIdByValue,
  getColorValueById,
} from '@/constants/avatar'

type Profile = {
  name: string
  avatarId: number
  backgroundColor: string
}

const inputStyle =
  "w-full rounded-lg !border-brown !border-2 px-4 py-3 font-baloo2 text-darkBrown placeholder:text-brown/50 focus:outline-none focus:ring-2 focus:ring-orange/50 focus:!border-orange !bg-cream transition-all disabled:opacity-70 disabled:cursor-not-allowed"

export default function EditProfile() {
  const navigate = useNavigate()
  const { user, checkAuth } = useAuth()
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    name: '',
    avatarId: 1,
    backgroundColor: PRESET_COLORS[0].value,
  })

  useEffect(() => {
    if (!user) return
    setProfile({
      name: user.name ?? '',
      avatarId: user.selected_character_id ?? 1,
      backgroundColor: getColorValueById(user.bg_color_id),
    })
  }, [user])

  const { name, avatarId, backgroundColor } = profile

  const setName = (v: string) => setProfile((p) => ({ ...p, name: v }))
  const setAvatarId = (v: number) => setProfile((p) => ({ ...p, avatarId: v }))
  const setBackgroundColor = (v: string) => setProfile((p) => ({ ...p, backgroundColor: v }))

  const handleSave = async () => {
    try {
      setSaving(true)
      await patch<
        { name: string; selected_character_id: number; bg_color_id: number },
        { message: string }
      >('/api/me/', {
        name: name.trim(),
        selected_character_id: avatarId,
        bg_color_id: getColorIdByValue(backgroundColor),
      })
      await checkAuth()
      toast.success('Profile updated!\nYour new look is saved.')
      navigate(user?.id ? `/profile/${user.id}` : '/home')
    } catch (error) {
      console.error(error)
      toast.error('Couldn’t update profile\nCheck your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream/50 via-offWhite to-cream/30 flex flex-col items-center px-4 pt-10 pb-28">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <header className="text-center space-y-1">
          <h1 className="!text-red !font-extrabold text-3xl sm:text-4xl font-baloo2 tracking-tight">
            Edit Profile
          </h1>
          <p className="text-brown/80 text-sm font-baloo2">
            Customize your adventurer identity
          </p>
        </header>

        <section className="bg-offWhite rounded-2xl !border-veryLightBrown !border-2 p-6 sm:p-8 shadow-[0_4px_0_0_#d6cec4] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange/15 flex items-center justify-center">
              <User className="w-5 h-5 text-orange" />
            </div>
            <h2 className="font-baloo2 font-extrabold text-darkBrown text-xl">Profile Info</h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Avatar Preview + Avatar ID selector */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-24 h-24 rounded-xl flex items-center justify-center border-2 border-brown overflow-hidden relative"
                style={{ backgroundColor }}
              >
                <img
                  src={getAvatarProfilePath(avatarId)}
                  alt={`Avatar ${avatarId}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.onerror = null
                    target.src = '/mockImg/profile.svg'
                  }}
                />
              </div>
              <p className="text-xs text-brown/60 font-baloo2">Preview</p>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-baloo2">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAvatarId(id)}
                    className={`w-14 h-14 rounded-lg border-2 overflow-hidden transition-all !p-0 ${
                      avatarId === id
                        ? 'border-brown scale-105 ring-2 ring-orange/50 bg-cream'
                        : 'border-veryLightBrown hover:border-brown/50 bg-cream/50'
                    }`}
                    title={`Avatar ${id}`}
                    aria-label={`Select avatar ${id}`}
                  >
                    <img
                      src={getAvatarProfilePath(id)}
                      alt={`Avatar ${id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget
                        target.onerror = null
                        target.src = '/mockImg/profile.svg'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-baloo2">
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
                        ? 'border-brown scale-110 ring-2 ring-orange/50'
                        : 'border-transparent hover:border-brown/50'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                    aria-label={`Select ${color.label}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-full space-y-2">
              <label className="text-sm font-bold text-darkBrown font-baloo2">
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
              <label className="text-sm font-bold text-darkBrown font-baloo2">Username</label>
              <div className="flex">
                <span className="flex items-center rounded-l-lg border-y-2 border-l-2 border-brown bg-veryLightBrown/50 px-4 font-baloo2 text-darkBrown">
                  @
                </span>
                <input
                  type="text"
                  value={user?.username || ''}
                  readOnly
                  className={
                    inputStyle +
                    ' rounded-l-none border-l-0 bg-gray-100 text-lightBrown cursor-not-allowed'
                  }
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
              onClick={() => navigate(user?.id ? `/profile/${user.id}` : '/home')}
              className="normal-case"
            >
              Cancel
            </Button>
            <Button
              variant="orange"
              size="default"
              onClick={handleSave}
              disabled={saving}
              className="normal-case"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
