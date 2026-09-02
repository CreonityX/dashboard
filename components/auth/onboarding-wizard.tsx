"use client"

import React, { useState } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { acceptInviteAction } from "@/app/actions/onboarding"

export function OnboardingWizard() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const memberId = params?.token as string
  const inviteToken = searchParams?.get("token") as string

  const handleAccept = async () => {
    if (!memberId || !inviteToken) {
      setError("Invalid invite link. Please check your email.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await acceptInviteAction(memberId, inviteToken)
      if (!res.success) {
        setError(res.error)
        setIsLoading(false)
        return
      }
      
      router.push("/")
    } catch (err) {
      console.error(err)
      setError("Failed to accept invite.")
      setIsLoading(false)
    }
  }

  if (!memberId || !inviteToken) {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#efefef] dark:border-[#27272a] shadow-sm text-center">
        <Icon icon="gravity-ui:circle-exclamation" className="size-12 text-rose-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-[#0a0a0a] dark:text-white mb-2">Invalid Invite Link</h1>
        <p className="text-sm text-[#71717a] dark:text-[#a1a1aa]">This invite link is missing required parameters. Please check the email you received.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#efefef] dark:border-[#27272a] shadow-sm text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-6">
        <Icon icon="gravity-ui:envelope-open" className="size-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      
      <h1 className="text-2xl font-bold text-[#0a0a0a] dark:text-white mb-3">You've been invited!</h1>
      <p className="text-sm text-[#71717a] dark:text-[#a1a1aa] mb-8 leading-relaxed">
        You have been invited to join a brand team on Creonity. Click below to accept the invitation and access the brand's dashboard.
      </p>

      {error && <p className="text-[13px] font-medium text-rose-500 mb-4">{error}</p>}

      <button 
        onClick={handleAccept} 
        disabled={isLoading}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? <Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> : null}
        Accept Invitation
      </button>
    </div>
  )
}
