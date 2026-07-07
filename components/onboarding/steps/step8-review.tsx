"use client"

import { Icon } from "@iconify/react"
import { Switch } from "@heroui/react"
import type { StepProps } from "../onboarding-shell"

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "skill-icons:instagram",
  youtube: "logos:youtube-icon",
  tiktok: "simple-icons:tiktok",
  x: "ri:twitter-x-line",
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  x: "X",
}

const CATEGORY_LABELS: Record<string, string> = {
  lifestyle: "Lifestyle",
  fashion: "Fashion & Beauty",
  tech: "Technology",
  gaming: "Gaming",
  fitness: "Fitness & Health",
  travel: "Travel",
  food: "Food & Cooking",
  finance: "Finance",
  education: "Education",
  comedy: "Comedy",
}

export function Step8Review({ data, onChange, onNext }: StepProps) {
  const kycComplete = !!(
    data.panNumber.length === 10 &&
    data.bankAccount &&
    data.bankAccount === data.bankAccountConfirm &&
    data.ifsc.length === 11
  )

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Category",
      value: <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{CATEGORY_LABELS[data.category] ?? data.category}</span>,
    },
    {
      label: "Location",
      value: <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{data.location || "—"}</span>,
    },
    {
      label: "Niche tags",
      value: data.nicheTags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 justify-end">
          {data.nicheTags.map(t => (
            <span key={t} className="inline-flex h-6 items-center rounded-full bg-[#f4f4f5] dark:bg-[#27272a] px-2.5 text-[11px] font-medium text-[#52525b] dark:text-[#a1a1aa]">{t}</span>
          ))}
        </div>
      ) : <span className="text-[14px] text-[#a1a1aa]">—</span>,
    },
    {
      label: "Platforms",
      value: data.connectedPlatforms.length > 0 ? (
        <div className="flex items-center gap-2">
          {data.connectedPlatforms.map(p => (
            <div key={p} className="flex size-7 items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f]" title={PLATFORM_LABELS[p]}>
              <Icon icon={PLATFORM_ICONS[p] ?? "gravity-ui:link"} className="size-4" />
            </div>
          ))}
        </div>
      ) : <span className="text-[14px] text-[#a1a1aa]">None connected</span>,
    },
    {
      label: "Calendar",
      value: data.calendarConnected ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Icon icon="gravity-ui:check" className="size-2.5" /> Synced
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-[#f4f4f5] dark:bg-[#27272a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa]">Skipped</span>
      ),
    },
    {
      label: "KYC & Payouts",
      value: kycComplete ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Icon icon="gravity-ui:check" className="size-2.5" /> Complete
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">Pending</span>
      ),
    },
    {
      label: "Starting price",
      value: (
        <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">
          {data.startingPrice
            ? `₹${Number(data.startingPrice).toLocaleString("en-IN")}/post`
            : "—"}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-[13px] font-semibold text-[#a1a1aa] mb-2">Step 8 of 8</p>
        <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">You're all set 🎉</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#71717a] dark:text-[#a1a1aa]">
          Here's a quick summary of what you've set up. Everything can be changed later in Settings.
        </p>
      </div>

      {/* Profile summary card */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
        {/* Profile header row */}
        <div className="flex items-center gap-4 p-5 border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
          <div className="w-12 h-12 rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f] shrink-0 overflow-hidden flex items-center justify-center">
            {data.photoPreview ? (
              <img src={data.photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Icon icon="gravity-ui:person" className="size-6 text-[#a1a1aa]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white truncate">{data.name}</div>
            <div className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] truncate">
              {data.socialHandle} · {data.email}
            </div>
          </div>
        </div>

        {/* Bio row */}
        {data.bio && (
          <div className="px-5 py-4 border-b border-[#f4f4f5] dark:border-[#1f1f1f]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#a1a1aa] mb-1.5">Bio</div>
            <div className="text-[13.5px] text-[#0a0a0a] dark:text-white leading-5">
              {data.bio.length > 90 ? data.bio.slice(0, 90) + "…" : data.bio}
            </div>
          </div>
        )}

        {/* Detail rows */}
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`px-5 py-3.5 flex items-center justify-between gap-4 ${i < rows.length - 1 ? "border-b border-[#f4f4f5] dark:border-[#1f1f1f]" : ""}`}
          >
            <div className="text-[12px] font-semibold uppercase tracking-wider text-[#a1a1aa] shrink-0">{row.label}</div>
            <div className="flex-1 flex justify-end">{row.value}</div>
          </div>
        ))}
      </div>

      {/* Notification preferences */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 dark:border-[#27272a] dark:bg-[#111111] flex flex-col gap-4">
        <div>
          <div className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">How should we reach you?</div>
          <div className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] mt-0.5">
            Fine-tune per-category anytime in Settings → Notifications
          </div>
        </div>

        {/* Email toggle */}
        <div className="flex items-center justify-between rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#0f0f0f] p-4">
          <div>
            <div className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Email notifications</div>
            <div className="text-[12px] text-[#a1a1aa] mt-0.5">Campaign updates, bids, messages, and reports</div>
          </div>
          <Switch
            defaultSelected={data.notifyEmail}
            size="sm"
            color="success"
            onValueChange={v => onChange({ notifyEmail: v })}
          />
        </div>

        {/* Push toggle */}
        <div className="flex items-center justify-between rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#0f0f0f] p-4">
          <div>
            <div className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Push notifications</div>
            <div className="text-[12px] text-[#a1a1aa] mt-0.5">Real-time alerts on your device</div>
          </div>
          <Switch
            defaultSelected={data.notifyPush}
            size="sm"
            color="success"
            onValueChange={v => onChange({ notifyPush: v })}
          />
        </div>
      </div>

      {/* Final CTA */}
      <button
        onClick={onNext}
        className="h-12 w-full rounded-xl bg-[#0a0a0a] text-white text-[15px] font-semibold hover:bg-black/85 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90 transition-colors"
      >
        Go to Dashboard →
      </button>
    </div>
  )
}
