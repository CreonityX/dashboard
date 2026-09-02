"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { Switch } from "@heroui/react"
import { useRouter } from "next/navigation"
import type { StepProps } from "../onboarding-shell"
import { completeOnboardingAction } from "@/app/actions/onboarding"
import { useOnboarding } from "@/context/onboarding-context"

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "skill-icons:instagram",
  youtube: "skill-icons:youtube-dark",
  tiktok: "logos:tiktok-icon",
  x: "skill-icons:twitter",
  linkedin: "skill-icons:linkedin",
}

export function Step8Review({ data, onNext }: StepProps) {
  const { refresh } = useOnboarding()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await completeOnboardingAction()
      if (!res.success) {
        setError(res.error)
        setLoading(false)
        return
      }
      await refresh()
      router.push("/")
    } catch (err) {
      console.error(err)
      setError("Failed to complete onboarding.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 8 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Review & Activate</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">You're all set! Review your public profile preview before activating your account.</p>
      </div>

      {/* Profile Card Preview */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-violet-100 to-fuchsia-100 dark:from-violet-900/40 dark:to-fuchsia-900/40 relative">
          <div className="absolute -bottom-8 left-6">
            <div className="size-16 rounded-full border-4 border-white dark:border-[#111111] overflow-hidden bg-[#f4f4f5] dark:bg-[#1f1f1f]">
              {data.photoPreview ? (
                <img src={data.photoPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <Icon icon="gravity-ui:person" className="w-full h-full p-4 text-[#a1a1aa]" />
              )}
            </div>
          </div>
          <div className="absolute right-6 top-4 flex gap-1.5">
            {data.nicheTags.slice(0, 2).map(tag => (
              <span key={tag} className="rounded-md bg-white/70 dark:bg-black/40 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#52525b] dark:text-[#d4d4d8]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 pt-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">{data.name || "Anonymous Creator"}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[14px] text-[#71717a] dark:text-[#a1a1aa]">@{data.socialHandle}</span>
                <span className="text-[10px] text-[#d4d4d8] dark:text-[#3f3f46]">•</span>
                <span className="flex items-center gap-1 text-[13px] text-[#71717a] dark:text-[#a1a1aa]">
                  <Icon icon="gravity-ui:location" className="size-3.5" />
                  {data.location || "Earth"}
                </span>
              </div>
            </div>
            {data.startingPrice && (
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#a1a1aa]">Starts at</div>
                <div className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">₹{Number(data.startingPrice).toLocaleString("en-IN")}</div>
              </div>
            )}
          </div>

          <p className="mt-4 text-[14px] leading-6 text-[#52525b] dark:text-[#d4d4d8] line-clamp-3">
            {data.bio || "No bio provided."}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {data.connectedPlatforms.length > 0 ? (
              data.connectedPlatforms.map(p => (
                <div key={p} className="flex items-center gap-1.5 rounded-lg border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#1a1a1a] px-2.5 py-1.5">
                  <Icon icon={PLATFORM_ICONS[p]} className="size-4" />
                  <span className="text-[12px] font-medium text-[#52525b] dark:text-[#a1a1aa] capitalize">{p}</span>
                </div>
              ))
            ) : (
              <span className="text-[12px] text-[#a1a1aa]">No platforms connected</span>
            )}
          </div>
        </div>
      </div>

      {/* Internal Settings Summary */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Account Settings</div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#71717a] dark:text-[#a1a1aa]">Security</span>
            <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white flex items-center gap-1">
              <Icon icon="gravity-ui:shield-check" className="size-4 text-emerald-500" />
              {data.securityMethod === "passkey" ? "Passkey enabled" : "Password + MFA"}
            </span>
          </div>
          <div className="h-px w-full bg-[#f4f4f5] dark:bg-[#1f1f1f]" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#71717a] dark:text-[#a1a1aa]">KYC & Payouts</span>
            {data.panNumber && data.bankAccount ? (
              <span className="text-[13px] font-medium text-emerald-600 dark:text-emerald-400">Details provided</span>
            ) : (
              <span className="text-[13px] font-medium text-amber-600 dark:text-amber-400">Skipped (Action required later)</span>
            )}
          </div>
          <div className="h-px w-full bg-[#f4f4f5] dark:bg-[#1f1f1f]" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#71717a] dark:text-[#a1a1aa]">Calendar Sync</span>
            <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">
              {data.calendarConnected ? "Connected" : "Not connected"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-500/25 dark:bg-indigo-950/20 p-4 flex items-start gap-3">
        <Icon icon="gravity-ui:rocket" className="size-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <div className="text-[13px] leading-5 text-indigo-800 dark:text-indigo-300">
          <p className="font-semibold mb-0.5">Ready for liftoff</p>
          <p>Activating your account will make you visible to brands on the platform and open your inbox to incoming briefs.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {error && <p className="text-[13px] font-medium text-rose-500 text-center">{error}</p>}
        <button onClick={handleSubmit} disabled={loading} className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {loading ? <Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> : null}
          Complete & Go to Dashboard →
        </button>
      </div>
    </div>
  )
}
