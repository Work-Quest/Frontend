import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
// import { post } from "@/Api"
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

// --- CONSTANTS ---
const AVATAR_COUNT = 6
const AVATAR_OPTIONS = Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1)

const BG_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#A855F7', // Purple
  '#EC4899', // Pink
  '#78716C', // Stone
]

function Setup() {
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  const [loading, setLoading] = useState(false)

  // State for selections
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1)
  const [selectedColor, setSelectedColor] = useState<string>(BG_COLORS[1])

  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: formData.displayName,
      username: formData.username,
      avatarId: selectedAvatar,
      avatarColor: selectedColor,
    }

    try {
      /* * =================================================================
       * TODO: REPLACE API HERE
       * =================================================================
       */

      // const res = await post("/api/user/setup", payload)

      // --- START MOCK DATA SIMULATION ---
      console.log('Mock API Payload:', payload)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // --- END MOCK DATA SIMULATION ---

      await checkAuth()
      toast.success('Profile setup complete!')
      navigate('/home')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update profile.')
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
            {/* Header */}
            <div className="flex flex-col items-center">
              <img src="/logo/favicon.svg" alt="icon" className="h-10 mb-2" draggable="false" />
              <h2 className="text-3xl font-bold text-red font-['Baloo_2']">
                Identity Registration
              </h2>
              <p className="text-lightBrown font-medium">
                Set up your profile so your party can find you
              </p>
            </div>

            {/* --- AVATAR PREVIEW & SELECTION --- */}
            <div className="flex flex-col items-center gap-4">
              {/* Main Preview Circle */}
              <div
                className="w-28 h-28 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: selectedColor }}
              >
                <img
                  src={`/avatars/${selectedAvatar}.png`}
                  alt={`Avatar ${selectedAvatar}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {/* Avatar Chooser Row */}
              <div className="w-full">
                <Label className="text-xs font-bold text-lightBrown mb-2 block text-center">
                  CHOOSE AVATAR
                </Label>
                <div className="flex justify-center gap-3 flex-wrap">
                  {AVATAR_OPTIONS.map((num) => (
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
                        src={`/avatars/${num}.png`}
                        alt={`Option ${num}`}
                        className="w-full h-full object-cover"
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
                  {BG_COLORS.map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shadow-sm hover:scale-110 transition-transform border border-white/50"
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
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
                <div className="relative">
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your unique username"
                    className="w-full p-3 border-brown font-['Baloo_2']"
                    required
                  />
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

              <div className="text-center">
                <span
                  onClick={() => navigate('/home')}
                  className="text-sm text-lightBrown cursor-pointer hover:text-orange hover:underline"
                >
                  Fill this later
                </span>
              </div>
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
