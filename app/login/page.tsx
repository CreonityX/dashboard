import React from "react"
import { LoginForm } from "@/components/auth/login-form"
import { VideoSidebar } from "@/components/auth/video-sidebar"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-[#0a0a0a]">
      {/* Left side (Image/Video) */}
      <div className="hidden lg:block h-screen p-3 pr-0 w-1/2 max-w-[800px]">
        <VideoSidebar />
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
