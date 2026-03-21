import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { patch } from '@/Api'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import {
  AVATAR_IDS,
  PRESET_COLORS,
  getAvatarProfilePath,
  getColorIdByValue,
} from '@/constants/avatar'

function Setup() {
  const navigate = useNavigate()
  const { checkAuth, user } = useAuth()

  const [loading, setLoading] = useState(false)

  // State for selections
  const [selectedAvatar, setSelectedAvatar] = useState<number>(AVATAR_IDS[0])
  const [selectedColor, setSelectedColor] = useState<string>(PRESET_COLORS[0].value)

  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
  })

  useEffect(() => {
    if (user && !user.is_first_time) {
      navigate('/home', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanedDisplayName = formData.displayName.trim()
    const cleanedUsername = formData.username.replace(/^@+/, '').trim().toLowerCase()

    if (!cleanedDisplayName) {
      toast.error('Display name required\nEnter how you want other adventurers to see you.')
      return
    }

    if (!cleanedUsername) {
      toast.error(
        'Adventure tag required\nChoose a unique @tag using lowercase letters and numbers.'
      )
      return
    }

    if (!/^[a-z0-9]+$/.test(cleanedUsername)) {
      toast.error(
        'Invalid adventure tag\nUse only lowercase letters and numbers (no spaces or symbols).'
      )
      return
    }

    setLoading(true)

    try {
      await patch<
        {
          name: string
          username: string
          selected_character_id: number
          bg_color_id: number
          is_first_time: boolean
        },
        { message: string }
      >('/api/me/', {
        name: cleanedDisplayName,
        username: cleanedUsername,
        selected_character_id: selectedAvatar,
        bg_color_id: getColorIdByValue(selectedColor),
        is_first_time: false,
      })

      await checkAuth()
      toast.success('Profile setup complete!\nYou’re ready to join quests.')
      navigate('/home')
    } catch (err: unknown) {
      console.error(err)
      const backendError =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined
      toast.error(
        `Couldn't save profile\n${backendError || 'Check your connection and try again.'}`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-screen h-screen relative bg-offWhite overflow-hidden">
      <form onSubmit={handleSubmit} className="w-full h-full flex">
        {/* LEFT SIDE - Form */}
        <div className="w-full md:w-1/2 h-full flex justify-center items-center overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-lg px-[8%] py-10 flex flex-col gap-5">
            {/* --- AVATAR PREVIEW & SELECTION --- */}
            <div className="flex flex-col items-center gap-4">
              {/* Main Preview Circle */}
              <div
                className="w-28 h-28 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: selectedColor }}
              >
                <img
                  src={getAvatarProfilePath(selectedAvatar)}
                  alt={`Avatar ${selectedAvatar}`}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget
                    target.onerror = null
                    target.src = '/mockImg/profile.svg'
                  }}
                />
              </div>

              {/* Avatar Chooser Row */}
              <div className="w-full">
                <Label className="text-xs font-bold text-lightBrown mb-2 block text-center">
                  CHOOSE AVATAR
                </Label>
                <div className="flex justify-center gap-3 flex-wrap">
                  {AVATAR_IDS.map((num) => (
                    <div
                      key={num}
                      onClick={() => setSelectedAvatar(num)}
                      className={`w-12 h-12 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform bg-white overflow-hidden ${
                        selectedAvatar === num
                          ? 'border-orange ring-2 ring-orange/30'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={getAvatarProfilePath(num)}
                        alt={`Option ${num}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.onerror = null
                          target.src = '/mockImg/profile.svg'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Chooser Row */}
              <div className="w-full">
                <Label className="text-xs font-bold text-lightBrown mb-2 block text-center">
                  CHOOSE BACKGROUND
                </Label>
                <div className="flex justify-center gap-2 flex-wrap px-4">
                  {PRESET_COLORS.map((color) => (
                    <div
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform border border-white/50"
                      style={{ backgroundColor: color.value }}
                    >
                      {selectedColor === color.value && (
                        <Check size={16} className="text-white drop-shadow-md" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* ---------------------------------- */}

            {/* Form Fields */}
            <div className="flex flex-col gap-4 mt-2">
              {/* Display Name */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-bold text-darkBrown">Display Name</Label>
                <div className="relative">
                  <Input
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Enter your display name"
                    className="w-full p-3 border-brown font-['Baloo_2']"
                    required
                  />
                </div>
              </div>

              {/* Adventurer Tag */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-bold text-darkBrown">Adventurer Tag</Label>
                <div className="flex w-full">
                  <span className="flex items-center rounded-l-lg border-2 border-y border-l border-brown bg-lightBrown/30 px-4 font-['Baloo_2'] text-darkBrown">
                    @
                  </span>
                  <div className="flex-1">
                    <Input
                      name="username"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value
                            .replace(/^@+/, '')
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, ''),
                        })
                      }
                      placeholder="Enter your unique username"
                      className="w-full p-3 border-brown border-l-0 rounded-l-none font-['Baloo_2']"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4">
              <Button
                variant="orange"
                type="submit"
                disabled={loading}
                className="w-full p-4 bg-orange hover:bg-red text-offWhite font-bold rounded-[10px] border-b-[3px] border-[#f76652] transition-all active:translate-y-[2px] active:border-b-0"
              >
                {loading ? 'Saving...' : 'Next: Choose Class'}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Logo Area */}
        <div className="hidden md:flex md:w-1/2 h-full bg-darkBrown items-center justify-center">
          <img
            src="/logo/logo.svg"
            alt="Work Quest Logo"
            className="w-full px-[25%]"
            draggable="false"
          />
        </div>
      </form>
    </div>
  )
}

export default Setup
