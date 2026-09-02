"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import type { StepProps } from "../onboarding-shell"
import { saveAvailabilityAction } from "@/app/actions/onboarding"
import { useOnboarding } from "@/context/onboarding-context"

const INPUT = "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"
const CARD = "rounded-2xl border border-[#e4e4e7] bg-white p-5 dark:border-[#27272a] dark:bg-[#111111]"

export function Step7Preferences({ data, onChange, onNext }: StepProps) {
  const { refresh } = useOnboarding()
  const [loading, setLoading] = useState(false)
  const canContinue = data.startingPrice.trim().length > 0 && !loading

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await saveAvailabilityAction({
        acceptingGigs: true,
        responseSla: `${data.responseTime} ${data.responseTimeUnit}`,
      })
      await refresh()
      onNext()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 7 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Service Preferences</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          Set your baseline expectations. These are just defaults and can be negotiated per campaign.
        </p>
      </div>

      {/* Pricing */}
      <div className={`${CARD} flex flex-col gap-6`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Starting price (per post)</span>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] font-medium">₹</span>
              <input className={`${INPUT} pl-8`} placeholder="10,000" value={data.startingPrice} onChange={e => onChange({ startingPrice: e.target.value.replace(/\D/g, "") })} />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Expected response time</span>
            <div className="flex gap-2">
              <input className={`${INPUT} w-[80px] text-center`} value={data.responseTime} onChange={e => onChange({ responseTime: e.target.value.replace(/\D/g, "") })} />
              <div className="relative flex-1">
                <select className={`${INPUT} appearance-none pr-8 cursor-pointer`} value={data.responseTimeUnit} onChange={e => onChange({ responseTimeUnit: e.target.value })}>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
                <Icon icon="ph:caret-down" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#a1a1aa] pointer-events-none" />
              </div>
            </div>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between"><span className={LABEL}>Included revision rounds</span></div>
          <div className="flex bg-[#f4f4f5] dark:bg-[#1f1f1f] p-1 rounded-xl">
            {["0", "1", "2", "3", "Unlimited"].map(opt => (
              <button key={opt} type="button" onClick={() => onChange({ revisionRounds: opt })}
                className={`flex-1 h-9 rounded-lg text-[13px] font-semibold transition-all ${
                  data.revisionRounds === opt ? "bg-white dark:bg-[#2a2a2a] text-[#0a0a0a] dark:text-white shadow-sm" : "text-[#71717a] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Default usage rights included</span>
          <div className="relative">
            <select className={`${INPUT} appearance-none pr-8 cursor-pointer`} value={data.usageRights} onChange={e => onChange({ usageRights: e.target.value })}>
              <option value="platform_only">Platform only (No ad usage)</option>
              <option value="30_days">30 days digital rights</option>
              <option value="90_days">90 days digital rights</option>
              <option value="perpetual">Perpetual digital rights</option>
            </select>
            <Icon icon="ph:caret-down" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#a1a1aa] pointer-events-none" />
          </div>
        </label>
      </div>

      <div className={`${CARD} flex flex-col gap-4`}>
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#f4f4f5] dark:bg-[#1f1f1f]"><Icon icon="gravity-ui:calendar" className="size-4 text-[#0a0a0a] dark:text-white" /></div>
          <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Blackout Dates</div>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Are you unavailable during any upcoming dates?</span>
          <textarea className="min-h-[80px] w-full resize-none rounded-xl border border-[#e4e4e7] bg-white px-3.5 py-3 text-[13.5px] font-medium text-[#0a0a0a] outline-none leading-6 transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
            placeholder="e.g., Vacation from Dec 20 to Jan 5" value={data.blackoutDates} onChange={e => onChange({ blackoutDates: e.target.value })} />
        </label>
      </div>

      <button onClick={handleSubmit} disabled={!canContinue} className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? <Icon icon="gravity-ui:loader" className="size-4 animate-spin" /> : null}
        Save & Continue →
      </button>
    </div>
  )
}
