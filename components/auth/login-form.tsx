"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button, Link, toast, Dropdown } from "@heroui/react"
import { Handset, Check } from "@gravity-ui/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faMeta, faApple } from "@fortawesome/free-brands-svg-icons"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Icon } from "@iconify/react"
import { useAccount } from "@/context/account-context"
import { loginAction } from "@/app/actions/auth"

function OTPInput({ length = 6 }: { length?: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-[20px] font-bold bg-transparent border border-[#e4e4e7] dark:border-[#2a2a2a] focus:border-[#0a0a0a] dark:focus:border-white rounded-xl outline-none transition-colors text-[#0a0a0a] dark:text-white"
        />
      ))}
    </div>
  )
}

const countryCodes = [
  { name: "United States", dial_code: "+1" },
  { name: "Canada", dial_code: "+1" },
  { name: "United Kingdom", dial_code: "+44" },
  { name: "India", dial_code: "+91" },
  { name: "Australia", dial_code: "+61" },
  { name: "Germany", dial_code: "+49" },
  { name: "France", dial_code: "+33" },
  { name: "Italy", dial_code: "+39" },
  { name: "Japan", dial_code: "+81" },
  { name: "China", dial_code: "+86" },
  { name: "Brazil", dial_code: "+55" },
  { name: "Mexico", dial_code: "+52" },
]

export function LoginForm() {
  const router = useRouter()
  const { signIn } = useAccount()
  const { setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<"login" | "forgot_email" | "forgot_otp" | "forgot_success_options" | "forgot_new_password" | "mobile_login" | "mobile_otp">("login")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1")

  useEffect(() => {
    setTheme("system")
  }, [setTheme])

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showReenterPassword, setShowReenterPassword] = useState(false)

  const handleLoginSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    
    const email = String(formData.get("email"))
    const password = String(formData.get("password"))

    try {
      const result = await loginAction(email, password)
      
      if (result.success) {
        const isBrand = email === "brand@creonity.com"
        signIn(isBrand ? { role: "brand", brandId: "creonity", email } : { role: "creator", email })
        toast.success("Login Successful", {
          description: `Welcome back, ${email}!`
        })
        router.push("/")
      } else {
        setError(result.error || "Invalid email or password.")
      }
    } catch (e) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0a0a0a] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
        {authMode === "login" && (
          <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Welcome back</h1>
        )}
        {authMode === "mobile_login" && (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Mobile Login</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-2">Enter your phone number to receive a secure OTP.</p>
          </>
        )}
        {authMode === "mobile_otp" && (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Verify your number</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-2">Enter the 6-digit code sent to your phone.</p>
          </>
        )}
        {authMode === "forgot_email" && (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Reset password</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-2">Enter your email or phone number to receive a secure OTP.</p>
          </>
        )}
        {authMode === "forgot_otp" && (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Verify it's you</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-2">Enter the 6-digit code sent to your contact method.</p>
          </>
        )}
        {authMode === "forgot_success_options" && (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">Verification successful</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-2">Your identity has been verified. You can now login or change your password.</p>
          </>
        )}
        {authMode === "forgot_new_password" && (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">New password</h1>
            <p className="text-gray-500 dark:text-gray-400 text-[14px] mt-2">Create a strong new password for your account.</p>
          </>
        )}
      </div>

      <form className="flex flex-col gap-5 w-full" onSubmit={(e) => {
        e.preventDefault()
        if (authMode === "login") {
          handleLoginSubmit(new FormData(e.currentTarget))
          return
        }
        
        setIsLoading(true)
        setTimeout(() => {
          setIsLoading(false)
          if (authMode === "forgot_email") setAuthMode("forgot_otp")
          else if (authMode === "forgot_otp") setAuthMode("forgot_success_options")
          else if (authMode === "mobile_login") setAuthMode("mobile_otp")
          else if (authMode === "mobile_otp") {
            toast.success("Login Successful", {
              description: `Welcome back via Mobile!`
            })
            router.push("/")
          }
          else if (authMode === "forgot_new_password") {
            toast.success("Password changed successfully!")
            setAuthMode("login")
          }
        }, 800)
      }}>
        {authMode === "mobile_login" && (
          <div>
            <label htmlFor="phone" className="mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300">
              Phone Number
            </label>
            <div className="flex items-center gap-3">
              <Dropdown placement="bottom-start">
                <Dropdown.Trigger>
                  <button type="button" className="flex items-center justify-between shrink-0 bg-white dark:bg-[#111111] border border-[#e2e8f0] dark:border-white/10 rounded-[14px] h-12 pl-4 pr-3 text-[14px] font-medium text-[#0a0a0a] dark:text-white focus:outline-none focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 transition-colors cursor-pointer min-w-[80px]">
                    {selectedCountryCode}
                    <Icon icon="ph:caret-down" className="size-4 text-[#a1a1aa]" />
                  </button>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[200px] rounded-[14px] shadow-xl border border-[#e2e8f0] dark:border-white/10 bg-white dark:bg-[#111111]">
                  <Dropdown.Menu 
                    aria-label="Country codes" 
                    className="max-h-[300px] overflow-y-auto p-2"
                  >
                    {countryCodes.map((country) => (
                      <Dropdown.Item key={country.dial_code} onPress={() => setSelectedCountryCode(country.dial_code)} className="text-[14px] text-[#0a0a0a] dark:text-white data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-[#27272a] rounded-[10px] py-2 px-3">
                        <div className="flex items-center justify-between gap-4 w-full">
                          <span>{country.name}</span>
                          <span className="text-[#a1a1aa] font-medium">{country.dial_code}</span>
                        </div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="234 567 8900"
                className="h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
              />
            </div>
          </div>
        )}

        {authMode === "mobile_otp" && (
          <div className="mb-2">
            <OTPInput length={6} />
          </div>
        )}

        {authMode === "login" && (
          <>
            <div>
              <label htmlFor="email" className="mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 pr-11 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex w-full justify-between items-center mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-[#0a0a0a] focus:ring-[#0a0a0a] dark:border-gray-700 dark:bg-[#111111] dark:checked:bg-white dark:checked:border-white transition-colors cursor-pointer" 
                />
                <span className="text-[13px] text-[#0a0a0a] dark:text-white font-medium group-hover:underline underline-offset-4">Remember me</span>
              </label>
              <button type="button" onClick={() => setAuthMode("forgot_email")} className="text-[13px] text-[#0a0a0a] dark:text-white font-medium underline-offset-4 hover:underline">
                Forgot password?
              </button>
            </div>
          </>
        )}

        {authMode === "forgot_email" && (
          <div>
            <label htmlFor="reset-contact" className="mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300">
              Email or Phone Number
            </label>
            <input
              id="reset-contact"
              name="contact"
              type="text"
              required
              placeholder="you@example.com or +1 234 567 8900"
              className="h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
            />
          </div>
        )}

        {authMode === "forgot_otp" && (
          <div className="mb-2">
            <OTPInput length={6} />
          </div>
        )}

        {authMode === "forgot_success_options" && (
          <div className="flex flex-col gap-3">
            <Button 
              type="button"
              onPress={() => setAuthMode("login")}
              className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-bold rounded-xl h-12 transition hover:bg-black/80 dark:hover:bg-gray-200"
            >
              Login
            </Button>
            <Button 
              type="button"
              onPress={() => setAuthMode("forgot_new_password")}
              variant="bordered"
              className="w-full font-bold border-gray-200 dark:border-gray-800 rounded-xl h-12 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Change Password
            </Button>
          </div>
        )}

        {authMode === "forgot_new_password" && (
          <>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="new-password"
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 pr-11 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="reenter-password" className="mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300">
                Re-enter Password
              </label>
              <div className="relative">
                <input
                  id="reenter-password"
                  name="reenter-password"
                  type={showReenterPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Re-enter new password"
                  className="h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 pr-11 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowReenterPassword(!showReenterPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showReenterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </>
        )}

        {authMode !== "forgot_success_options" && (
          <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center h-12 bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-bold rounded-[14px] hover:opacity-90 transition-opacity disabled:opacity-50">
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              authMode === "login" ? "Sign In" : 
              authMode === "forgot_email" || authMode === "mobile_login" ? "Send Code" : 
              authMode === "forgot_otp" || authMode === "mobile_otp" ? "Verify Code" : 
              "Reset Password"
            )}
          </button>
        )}
        
        {error && <p className="text-[13px] font-medium text-rose-500 text-center mt-2">{error}</p>}

        {authMode !== "login" && (
          <div className="mt-8 text-center">
            <button 
              type="button" 
              onClick={() => setAuthMode(authMode === "mobile_otp" ? "mobile_login" : authMode === "forgot_otp" ? "forgot_email" : "login")} 
              className="flex items-center justify-center gap-2 text-[14px] font-medium text-gray-500 hover:text-[#0a0a0a] dark:hover:text-white transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}
      </form>

      {authMode === "login" && (
        <>
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs font-medium text-gray-400 tracking-wider">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="flex flex-col gap-3 w-full">

        <button type="button" className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[14px] font-bold text-[#0a0a0a] transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:hover:bg-white/5">
          <Icon icon="logos:google-icon" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <button type="button" className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[14px] font-bold text-[#0a0a0a] transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:hover:bg-white/5">
          <Icon icon="ic:baseline-apple" className="w-[26px] h-[26px] mr-2 dark:text-white text-black -mt-1" />
          Continue with Apple
        </button>
        <div className="grid grid-cols-2 gap-3 w-full">
          <button type="button" className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[14px] font-bold text-[#0a0a0a] transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:hover:bg-white/5">
            <Icon icon="logos:meta-icon" className="w-5 h-5 mr-2" />
            Meta
          </button>
          <button type="button" onClick={() => setAuthMode("mobile_login")} className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[14px] font-bold text-[#0a0a0a] transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:hover:bg-white/5">
            <Handset className="w-4 h-4 mr-2 text-gray-700 dark:text-gray-300" />
            Mobile
          </button>
        </div>
        </div>
      </>
      )}
      </div>
    </div>
  )
}
