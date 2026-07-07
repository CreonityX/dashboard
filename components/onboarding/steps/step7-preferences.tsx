"use client"

import type { StepProps } from "../onboarding-shell"

const INPUT = "h-11 w-full rounded-xl border border-[#e4e4e7] bg-white px-3.5 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
const LABEL = "text-[13px] font-medium text-[#3f3f46] dark:text-[#a1a1aa]"
const CARD = "rounded-2xl border border-[#e4e4e7] bg-white p-5 dark:border-[#27272a] dark:bg-[#111111]"

const USAGE_OPTIONS = [
  { id: "platform", label: "Platform only (no repurposing)" },
  { id: "30", label: "30 days extended usage" },
  { id: "90", label: "90 days extended usage" },
  { id: "perpetual", label: "Perpetual / unlimited" },
]

const REVISION_OPTIONS = [
  { id: "0", label: "0 (As-is)" },
  { id: "1", label: "1 Round" },
  { id: "2", label: "2 Rounds" },
  { id: "3", label: "3 Rounds" },
  { id: "unlimited", label: "Unlimited" },
]

export function Step7Preferences({ data, onChange, onNext }: StepProps) {
  const canContinue = data.startingPrice.trim().length > 0

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 7 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Set your defaults</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          These pre-fill every bid you submit. Change them anytime in{" "}
          <span className="font-medium text-[#52525b] dark:text-[#71717a]">Settings → Campaign Preferences</span>.
        </p>
      </div>

      {/* Starting price */}
      <div className={`${CARD} flex flex-col gap-2`}>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Starting price per post</span>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#a1a1aa] select-none pointer-events-none">
              ₹
            </span>
            <input
              type="number"
              min="0"
              className={`${INPUT} pl-8`}
              placeholder="15000"
              value={data.startingPrice}
              onChange={e => onChange({ startingPrice: e.target.value })}
            />
          </div>
        </label>
        <p className="text-[12px] text-[#a1a1aa]">
          Shown on your public profile as "₹{data.startingPrice ? Number(data.startingPrice).toLocaleString("en-IN") : "X,XXX"}/post — Creator-set". Brands see this before reaching out.
        </p>
      </div>

      {/* Bid terms */}
      <div className={`${CARD} flex flex-col gap-5`}>
        <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Default bid terms</div>

        {/* Revision rounds — pill selector */}
        <div className="flex flex-col gap-1.5">
          <span className={LABEL}>Revision rounds included</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {REVISION_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ revisionRounds: opt.id })}
                className={`h-9 rounded-xl px-3.5 text-[13px] font-medium transition-all duration-150 ${
                  data.revisionRounds === opt.id
                    ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
                    : "border border-[#e4e4e7] dark:border-[#27272a] text-[#52525b] dark:text-[#a1a1aa] hover:border-[#0a0a0a] dark:hover:border-white hover:text-[#0a0a0a] dark:hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-[#a1a1aa]">How many rounds of edits you'll offer by default on every delivery.</p>
        </div>

        {/* Usage rights */}
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Default usage rights</span>
          <select
            className={`${INPUT} cursor-pointer`}
            value={data.usageRights}
            onChange={e => onChange({ usageRights: e.target.value })}
          >
            {USAGE_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
          <p className="text-[12px] text-[#a1a1aa]">
            How long brands can use your content after delivery. Longer rights typically command higher fees.
          </p>
        </label>
      </div>

      {/* Availability */}
      <div className={`${CARD} flex flex-col gap-5`}>
        <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Availability</div>

        <div className="flex flex-col gap-1.5">
          <span className={LABEL}>Expected response time</span>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              className={`${INPUT} w-[88px] shrink-0`}
              value={data.responseTime}
              onChange={e => onChange({ responseTime: e.target.value })}
            />
            <select
              className={`${INPUT} flex-1 cursor-pointer`}
              value={data.responseTimeUnit}
              onChange={e => onChange({ responseTimeUnit: e.target.value })}
            >
              <option value="hours">Hours</option>
              <option value="days">Business days</option>
            </select>
          </div>
          <p className="text-[12px] text-[#a1a1aa]">Shown to brands on your profile so they know when to expect a reply.</p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Blackout dates <span className="text-[#a1a1aa] font-normal">(optional)</span></span>
          <textarea
            className="min-h-[80px] w-full resize-none rounded-xl border border-[#e4e4e7] bg-white px-3.5 py-3 text-[13.5px] font-medium text-[#0a0a0a] outline-none leading-6 transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white"
            placeholder="e.g. Dec 20 – Jan 5 — holiday break, March 10 – 15 — exams"
            value={data.blackoutDates}
            onChange={e => onChange({ blackoutDates: e.target.value })}
          />
          <p className="text-[12px] text-[#a1a1aa]">Brands won't be able to request deliveries during these periods.</p>
        </label>
      </div>

      <button
        onClick={onNext}
        disabled={!canContinue}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Save & Continue →
      </button>
    </div>
  )
}
