"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { toast } from "sonner"
import type { StepProps } from "../onboarding-shell"

const PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "skill-icons:instagram",
    hint: "Reels, Stories, Posts",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "logos:youtube-icon",
    hint: "Videos, Shorts",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "simple-icons:tiktok",
    hint: "Short-form videos",
  },
  {
    id: "x",
    label: "X (Twitter)",
    icon: "ri:twitter-x-line",
    hint: "Posts, Threads",
  },
]

export function Step4Platforms({ data, onChange, onNext }: StepProps) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = (platformId: string) => {
    const isConnected = data.connectedPlatforms.includes(platformId)
    if (isConnected) {
      onChange({ connectedPlatforms: data.connectedPlatforms.filter(p => p !== platformId) })
      return
    }
    setConnecting(platformId)
    setTimeout(() => {
      setConnecting(null)
      onChange({ connectedPlatforms: [...data.connectedPlatforms, platformId] })
      const platform = PLATFORMS.find(p => p.id === platformId)
      toast.success(`${platform?.label} connected!`, {
        description: "Your analytics will update once data syncs.",
      })
    }, 1200)
  }

  const canContinue = data.connectedPlatforms.length >= 1

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 4 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Connect your platforms</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          This powers your Analytics page and lets brands verify your reach. You're more likely to be matched when platforms are connected.
        </p>
      </div>

      {/* Platform cards */}
      <div className="flex flex-col gap-3">
        {PLATFORMS.map(platform => {
          const isConnected = data.connectedPlatforms.includes(platform.id)
          const isLoading = connecting === platform.id
          // Check if the social handle from step 1 might match this platform
          const handleLower = data.socialHandle.toLowerCase()
          const preFilled =
            (platform.id === "instagram" && (handleLower.includes("ig") || handleLower.includes("insta"))) ||
            (platform.id === "youtube" && handleLower.includes("yt")) ||
            false

          return (
            <div
              key={platform.id}
              className="rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] p-4 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#f4f4f5] dark:bg-[#1f1f1f] shrink-0">
                  <Icon icon={platform.icon} className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{platform.label}</span>
                    {isConnected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        <Icon icon="gravity-ui:check" className="size-2.5" /> Connected
                      </span>
                    )}
                    {!isConnected && preFilled && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                        Handle pre-filled
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#a1a1aa] mt-0.5">
                    {isConnected ? data.socialHandle : platform.hint}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleConnect(platform.id)}
                disabled={isLoading}
                className={`h-9 rounded-xl px-4 text-[13px] font-semibold shrink-0 transition-colors disabled:opacity-60 flex items-center gap-2 ${
                  isConnected
                    ? "border border-[#e4e4e7] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/20 dark:hover:text-rose-300 dark:hover:border-rose-500/25"
                    : "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:bg-black/85 dark:hover:bg-white/90"
                }`}
              >
                {isLoading ? (
                  <><Icon icon="gravity-ui:loader" className="size-3.5 animate-spin" /> Connecting…</>
                ) : isConnected ? (
                  "Disconnect"
                ) : (
                  "Connect"
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Info card */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 dark:border-sky-500/25 dark:bg-sky-950/20 p-4 flex items-start gap-3">
        <Icon icon="gravity-ui:circle-info" className="size-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
        <p className="text-[13px] leading-5 text-sky-700 dark:text-sky-300">
          Connect at least one platform to continue. You can add more anytime in{" "}
          <strong>Settings → Connected Accounts</strong>.
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  )
}
