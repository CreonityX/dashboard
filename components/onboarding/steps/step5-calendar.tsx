"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { toast } from "sonner"
import type { StepProps } from "../onboarding-shell"

export function Step5Calendar({ data, onChange, onNext }: StepProps) {
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onChange({ calendarConnected: true })
      toast.success("Google Calendar connected!", {
        description: "Campaign deadlines will now sync automatically.",
      })
    }, 1400)
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 5 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Stay on schedule</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          Campaign deadlines and content due dates push straight to your existing calendar.
        </p>
      </div>

      {/* Optional badge */}
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] px-3 py-1.5 -mt-4">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
        <span className="text-[12px] font-semibold text-[#71717a] dark:text-[#a1a1aa]">Optional — you can skip this step</span>
      </div>

      {/* Google Calendar card */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white p-6 dark:border-[#27272a] dark:bg-[#111111]">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4f4f5] dark:bg-[#1f1f1f]">
            <Icon icon="logos:google-calendar" className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Google Calendar</div>
              {data.calendarConnected && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <Icon icon="gravity-ui:check" className="size-2.5" /> Connected
                </span>
              )}
            </div>
            <div className="text-[13px] leading-5 text-[#71717a] dark:text-[#a1a1aa] mt-1.5">
              Campaign deadlines, content due dates, and revision windows all sync automatically to your Google Calendar.
            </div>
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading || data.calendarConnected}
          className="h-11 w-full rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-semibold hover:bg-black/85 dark:hover:bg-white/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> Connecting…</>
          ) : data.calendarConnected ? (
            <><Icon icon="gravity-ui:check" className="size-4" /> Calendar connected</>
          ) : (
            "Connect Google Calendar"
          )}
        </button>
      </div>

      {/* Consequence note */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-[#fafafa] dark:border-[#27272a] dark:bg-[#0f0f0f] p-4">
        <p className="text-[13px] leading-5 text-[#71717a] dark:text-[#a1a1aa]">
          <strong className="text-[#0a0a0a] dark:text-white">Heads up:</strong> Campaign timelines still appear inside Creonity whether or not you connect Calendar — this just mirrors them to Google.
        </p>
      </div>

      {/* Two CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onNext}
          disabled={!data.calendarConnected}
          className="flex-1 h-12 rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Connect & Continue →
        </button>
        <button
          onClick={onNext}
          className="h-12 px-5 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] text-[14px] font-semibold hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
