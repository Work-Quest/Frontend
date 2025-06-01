import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { FcGoogle } from "react-icons/fc"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Eye, EyeOff } from "lucide-react"

function Form({ method = "register" }: { method?: "login" | "register" }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const name = method === "login" ? "Login" : "Register"

  const description =
    method === "login"
      ? "Welcome back, Let's get fun with your work!"
      : "Welcome, Let's make your own account!"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (method === "register" && formData.password !== formData.confirmPassword) {
      setError("Password not match")
      setLoading(false)
      return
    }

    try {
      // call api
      console.log(formData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="w-screen h-screen relative bg-offWhite overflow-hidden">
          <div className="w-full md:w-1/2 h-full left-0 top-0 absolute inline-flex justify-center items-center">
            <div className="flex-1 self-stretch px-[10%] inline-flex flex-col justify-center items-center gap-6">
              <div className="self-stretch flex flex-col justify-start items-center">
                <img src="logo/favicon.svg" alt="logo" className="h-15" draggable="false"/>
                <div className="self-stretch flex flex-col justify-start items-center">
                  <h2 className="self-stretch text-center justify-start !text-red">{name}</h2>
                  <p className="self-stretch text-center justify-start !font-medium !text-lightBrown -mt-2">{description}</p>
                </div>
              </div>
              <div className="self-stretch flex flex-col justify-start items-center gap-8">
                <Button variant="cream" className="self-stretch p-4 rounded-md inline-flex justify-center items-center gap-1.5">
                  <FcGoogle />
                  {name} with Google
                </Button>
                <div className="self-stretch px-6 inline-flex justify-start items-center gap-2">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch h-0 border-1"></div>
                  </div>
                  <p className="justify-start !text-sm">or</p>
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
                    <div className="self-stretch h-0 border-1"></div>
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="self-stretch flex flex-col justify-start items-start gap-4 -mt-5">
                    {method === "register" && (
                      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                        <Label className="self-stretch justify-start !text-sm">Name</Label>
                        <div className="relative w-full">
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-10 p-2.5 !border-1 !border-brown font-['Baloo_2']"
                            placeholder="e.g. John"
                          />
                        </div>
                      </div>
                    )}
                    <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                      <Label className="self-stretch justify-start !text-sm">Email</Label>
                      <div className="relative w-full">
                        <Input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 p-2.5 !border-1 !border-brown font-['Baloo_2']"
                          placeholder="e.g. example@gmail.com"
                        />
                      </div>
                    </div>
                    {method === "register" ? (
                      <div className="self-stretch flex flex-row gap-2.5">
                        <div className="flex-1 flex flex-col justify-start items-start gap-1.5">
                          <Label className="self-stretch justify-start !text-sm">Password</Label>
                          <div className="relative w-full">
                            <Input
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              type={showPassword ? "text" : "password"}
                              className="w-full p-2.5 pr-10 pl-3 !border-1 !border-brown font-['Baloo_2']"
                              placeholder="e.g. password1234"
                            />
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown cursor-pointer"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-start items-start gap-1.5">
                          <Label className="self-stretch justify-start !text-sm">Confirm Password</Label>
                          <div className="relative w-full">
                            <Input
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              type={showPassword ? "text" : "password"}
                              className="w-full p-2.5 pr-10 pl-3 !border-1 !border-brown font-['Baloo_2']"
                              placeholder="e.g. password1234"
                            />
                            <div
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-brown cursor-pointer"
                            >
                              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                        <Label className="self-stretch justify-start !text-sm">Password</Label>
                        <div className="relative w-full">
                          <Input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            className="w-full p-2.5 pr-10 pl-3 !border-1 !border-brown font-['Baloo_2']"
                            placeholder="e.g. password1234"
                          />
                          <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-brown cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </div>
                        </div>
                      </div>
                    )}
                    {error && (
                      <p className="text-red text-sm font-semibold">{error}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="orange"
                  type="submit"
                  disabled={loading}
                  className="self-stretch p-4 bg-orange rounded-[10px] border-b-[3px] border-[#f76652] inline-flex justify-center items-center gap-2.5"
                >
                  <div className="justify-start text-offWhite font-['Baloo_2']">
                    {method === "login" ? "Login" : "Register"}
                  </div>
                </Button>
                <div className="self-stretch text-center justify-start">
                  {method === "login" ? (
                    <p className="text-darkBrown">
                      Don't have an account?{" "}
                      <span
                        onClick={() => navigate("/register")}
                        className="cursor-pointer text-orange font-medium hover:underline hover:text-red"
                      >
                        Register now
                      </span>
                    </p>
                  ) : (
                    <p className="text-darkBrown">
                      Already have an account?{" "}
                      <span
                        onClick={() => navigate("/login")}
                        className="cursor-pointer text-orange font-medium hover:underline hover:text-red"
                      >
                        Log in now
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex md:w-1/2 h-full right-0 top-0 absolute bg-darkBrown items-center justify-center">
            <img
              src="/logo/logo.svg"
              alt="logo"
              className="w-full px-[30%]"
              draggable="false"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default Form