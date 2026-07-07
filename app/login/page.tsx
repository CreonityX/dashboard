import React from "react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#0a0a0a]">
      {/* Left side (Image) */}
      <div className="hidden lg:block h-screen p-3 pr-0">
        <div className="h-full aspect-square relative overflow-hidden rounded-3xl">
          <img 
            src="/login_cover_custom.png" 
            alt="Creonity Login" 
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>
      </div>

      {/* Right side (Form) */}
      <div className="flex flex-col flex-1 relative p-3 lg:pl-3">
        {/* Form Container */}
        <div className="flex-1 w-full h-full">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
