"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/ui/brand-logo"
import { ScrollShadow } from "@heroui/react"
import { toast } from "sonner"
import {
  ChevronLeft,
  CheckCircle2,
  Lock,
  Upload,
  Link2,
  MessageCircle,
  FileText,
  TrendingUp,
  ChevronRight,
  Zap,
  Clock3,
} from "lucide-react"
import { Check } from "@gravity-ui/icons"

// ─── Types ────────────────────────────────────────────────────────────────────

type DealStage = "contract" | "content" | "tracking" | "completed"

type DeliverableItem = {
  id: string
  name: string
  type: "upload" | "post"
  status: "pending" | "uploaded" | "approved" | "posted"
  fileUrl?: string
  postUrl?: string
}

type PaymentMilestone = {
  id: string
  label: string
  amount: string
  type: "fixed" | "performance"
  targetViews?: number
  currentViews?: number
  status: "locked" | "unlocked" | "released"
}

type TimelineEvent = {
  id: string
  timestamp: string
  label: string
  note?: string
  status: "completed" | "active" | "pending"
}

type WorkspaceDeal = {
  id: string
  brand: string
  domain: string
  title: string
  subtitle: string
  stage: DealStage
  total: string
  due: string
  briefSummary: string
  timeline: TimelineEvent[]
  deliverables: DeliverableItem[]
  paymentMilestones: PaymentMilestone[]
}

// ─── Workspace Deals Data ────────────────────────────────────────────────────

const WORKSPACE_DEALS: WorkspaceDeal[] = [
  {
    id: "ws-glossier",
    brand: "Glossier",
    domain: "glossier.com",
    title: "You look good — skincare honest reviews",
    subtitle: "Skincare honest reviews",
    stage: "content",
    total: "₹2,100",
    due: "Aug 08",
    briefSummary:
      "Raw, unfiltered skincare reviews. No filters, no ring lights required. Just your honest skin journey with their cult products.",
    timeline: [
      { id: "t1", timestamp: "Jul 10", label: "Bid submitted", status: "completed" },
      { id: "t2", timestamp: "Jul 12", label: "Contract signed", status: "completed" },
      { id: "t3", timestamp: "Today, 10:00 AM", label: "Uploading content", status: "active" },
      { id: "t4", timestamp: "", label: "Brand review", status: "pending" },
      { id: "t5", timestamp: "", label: "Go live", status: "pending" },
    ],
    deliverables: [
      { id: "d1", name: "1 Reel (45-60s)", type: "post", status: "pending" },
    ],
    paymentMilestones: [
      { id: "m1", label: "On content approval", amount: "₹2,100", type: "fixed", status: "locked" },
    ],
  },
  {
    id: "ws-airbnb",
    brand: "Airbnb",
    domain: "airbnb.com",
    title: "Unique summer getaways series",
    subtitle: "Unique summer getaways series",
    stage: "contract",
    total: "₹4,800",
    due: "Aug 12",
    briefSummary:
      "Show a tangible room transformation without making it feel staged. Natural light, texture, and honest narration matter most.",
    timeline: [
      { id: "t1", timestamp: "Jul 2", label: "Bid submitted", status: "completed" },
      { id: "t2", timestamp: "Jul 4", label: "Negotiation completed", status: "completed" },
      { id: "t3", timestamp: "Jul 5, 9:00 AM", label: "Contract ready to sign", status: "active" },
      { id: "t4", timestamp: "", label: "Workspace unlocked", status: "pending" },
      { id: "t5", timestamp: "", label: "Content submission", status: "pending" },
      { id: "t6", timestamp: "", label: "Payment release", status: "pending" },
    ],
    deliverables: [
      { id: "d1", name: "1 Reel (45-60s)", type: "post", status: "pending" },
      { id: "d2", name: "3 edited photos", type: "upload", status: "pending" },
      { id: "d3", name: "2 Stories", type: "post", status: "pending" },
    ],
    paymentMilestones: [
      { id: "m1", label: "On content approval", amount: "₹2,400", type: "fixed", status: "locked" },
      { id: "m2", label: "At 50K views", amount: "₹1,200", type: "performance", targetViews: 50000, currentViews: 0, status: "locked" },
      { id: "m3", label: "At 100K views", amount: "₹1,200", type: "performance", targetViews: 100000, currentViews: 0, status: "locked" },
    ],
  },
  {
    id: "ws-patagonia",
    brand: "Patagonia",
    domain: "patagonia.com",
    title: "Trail-to-city capsule drop",
    subtitle: "Trail-to-city capsule drop",
    stage: "tracking",
    total: "₹6,250",
    due: "Jul 29",
    briefSummary:
      "Style the capsule in one outdoor and one city setting. Prioritize movement, texture, and utility details.",
    timeline: [
      { id: "t1", timestamp: "Jun 20", label: "Bid accepted", status: "completed" },
      { id: "t2", timestamp: "Jun 22", label: "Contract signed", status: "completed" },
      { id: "t3", timestamp: "Jun 28", label: "Content approved", status: "completed" },
      { id: "t4", timestamp: "Jul 1", label: "Content posted — tracking live", note: "₹3,125 released on approval", status: "active" },
      { id: "t5", timestamp: "", label: "50K views milestone", status: "pending" },
      { id: "t6", timestamp: "", label: "Final payment release", status: "pending" },
    ],
    deliverables: [
      { id: "d1", name: "1 Reel", type: "post", status: "posted", postUrl: "https://instagram.com/p/example1" },
      { id: "d2", name: "5 edited photos", type: "upload", status: "approved" },
      { id: "d3", name: "3 Stories", type: "post", status: "posted", postUrl: "https://instagram.com/s/example2" },
    ],
    paymentMilestones: [
      { id: "m1", label: "On content approval", amount: "₹3,125", type: "fixed", status: "released" },
      { id: "m2", label: "At 50K views", amount: "₹1,562", type: "performance", targetViews: 50000, currentViews: 31400, status: "locked" },
      { id: "m3", label: "At 100K views", amount: "₹1,563", type: "performance", targetViews: 100000, currentViews: 31400, status: "locked" },
    ],
  },
  {
    id: "ws-nike",
    brand: "Nike",
    domain: "nike.com",
    title: "Nike Forward lifestyle drop",
    subtitle: "Forward lifestyle drop",
    stage: "content",
    total: "₹2,500",
    due: "Aug 02",
    briefSummary:
      "Highlight the object details, packaging, and one before/after moment. The tone should be clever, not corporate.",
    timeline: [
      { id: "t1", timestamp: "Jul 6", label: "Bid submitted", status: "completed" },
      { id: "t2", timestamp: "Jul 8", label: "Contract signed", status: "completed" },
      { id: "t3", timestamp: "Jul 10", label: "Workspace unlocked", status: "completed" },
      { id: "t4", timestamp: "Today", label: "Brand reviewing content draft", status: "active" },
      { id: "t5", timestamp: "", label: "Revision or approval", status: "pending" },
    ],
    deliverables: [
      { id: "d1", name: "1 Reel", type: "post", status: "uploaded" },
      { id: "d2", name: "1 Carousel", type: "upload", status: "pending" },
    ],
    paymentMilestones: [
      { id: "m1", label: "On content approval", amount: "₹2,500", type: "fixed", status: "locked" },
    ],
  },
  {
    id: "ws-spotify",
    brand: "Spotify",
    domain: "spotify.com",
    title: "Creator workspace playlists",
    subtitle: "Creator workspace playlists",
    stage: "completed",
    total: "₹3,200",
    due: "Jul 01",
    briefSummary: "Share the ultimate workspace playlist and the rituals behind how music fuels your creative process.",
    timeline: [
      { id: "t1", timestamp: "Jun 1", label: "Contract signed", status: "completed" },
      { id: "t2", timestamp: "Jun 5", label: "Content approved", status: "completed" },
      { id: "t3", timestamp: "Jun 10", label: "Content posted", status: "completed" },
      { id: "t4", timestamp: "Jul 1", label: "All payments released", status: "completed" },
    ],
    deliverables: [
      { id: "d1", name: "1 Reel", type: "post", status: "posted" },
      { id: "d2", name: "1 Feed post", type: "post", status: "posted" },
    ],
    paymentMilestones: [
      { id: "m1", label: "Full deal payout", amount: "₹3,200", type: "fixed", status: "released" },
    ],
  },
]

// ─── Stepper stages ───────────────────────────────────────────────────────────

const STEPPER_STAGES: { key: DealStage; label: string }[] = [
  { key: "contract", label: "Contract" },
  { key: "content", label: "Content &\nDelivery" },
  { key: "tracking", label: "Tracking" },
  { key: "completed", label: "Final\nPayment" },
]

const STAGE_ORDER: Record<DealStage, number> = {
  contract: 0,
  content: 1,
  tracking: 2,
  completed: 3,
}

// ─── Status pill helper ────────────────────────────────────────────────────────

function StatusPill({ stage, deal }: { stage: DealStage; deal: WorkspaceDeal }) {
  if (stage === "contract") {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-400">
        Sign contract
      </span>
    )
  }
  if (stage === "content") {
    const hasUploaded = deal.deliverables.some(d => d.status === "uploaded" || d.status === "approved")
    return (
      <span className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold",
        hasUploaded
          ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700/40 dark:bg-blue-900/20 dark:text-blue-400"
          : "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-400"
      )}>
        {hasUploaded ? "Awaiting brand review" : `Submit content — due ${deal.due}`}
      </span>
    )
  }
  if (stage === "tracking") {
    const views = deal.paymentMilestones.find(m => m.type === "performance" && m.currentViews)?.currentViews
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-400">
        Tracking live{views ? ` — ${(views / 1000).toFixed(0)}K views` : ""}
      </span>
    )
  }
  if (stage === "completed") {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-[12px] font-semibold text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
        Completed
      </span>
    )
  }
  return null
}

// ─── Horizontal Stepper ───────────────────────────────────────────────────────

function HorizontalStepper({ currentStage }: { currentStage: DealStage }) {
  const currentIdx = STAGE_ORDER[currentStage]
  return (
    <div className="flex items-start gap-0 w-full mt-5 mb-1">
      {STEPPER_STAGES.map((s, i) => {
        const isDone = i < currentIdx
        const isActive = i === currentIdx
        const isLocked = i > currentIdx
        const isLast = i === STEPPER_STAGES.length - 1

        return (
          <div key={s.key} className="flex flex-1 flex-col items-center relative">
            {/* Connector line left */}
            {i > 0 && (
              <div className={cn(
                "absolute top-[18px] right-1/2 w-full h-[2px] -translate-y-1/2",
                isDone || isActive ? "bg-[#0a0a0a] dark:bg-white" : "bg-[#e4e4e7] dark:bg-white/10"
              )} />
            )}

            {/* Node */}
            <div className={cn(
              "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold transition-all",
              isDone
                ? "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-[#0a0a0a]"
                : isActive
                ? "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-[#0a0a0a] shadow-md shadow-black/20"
                : "border-[#d4d4d8] bg-[#f4f4f5] text-[#a1a1aa] dark:border-white/15 dark:bg-white/5 dark:text-white/30"
            )}>
              {isDone ? (
                <Check className="h-4 w-4" />
              ) : isLocked ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                i + 1
              )}
            </div>

            {/* Label */}
            <span className={cn(
              "mt-2 text-center text-[11px] font-semibold leading-tight whitespace-pre-line",
              isDone
                ? "text-[#0a0a0a] dark:text-white"
                : isActive
                ? "text-[#0a0a0a] dark:text-white"
                : "text-[#a1a1aa] dark:text-white/30"
            )}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Content Stage Panel ──────────────────────────────────────────────────────

function ContentStagePanel({ deal }: { deal: WorkspaceDeal }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
      {/* Deliverables + Upload */}
      <div className="flex flex-col gap-3">
        {deal.deliverables.map((d) => (
          <div key={d.id} className="rounded-2xl border border-[#efefef] bg-[#fafafa] p-4 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">{d.name}</p>
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                d.status === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : d.status === "uploaded" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-white/40"
              )}>
                {d.status === "approved" ? "Approved" : d.status === "uploaded" ? "Under review" : "Pending"}
              </span>
            </div>
            {d.type === "post" ? (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-[#d4d4d8] bg-white px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
                <Link2 className="h-4 w-4 shrink-0 text-gray-400" />
                <input
                  placeholder="Drop your post link here"
                  className="flex-1 bg-transparent text-[13px] text-gray-500 outline-none placeholder:text-gray-400 dark:text-white/60"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => toast.info("Upload dialog coming soon")}
                className="flex w-full items-center gap-2 rounded-xl border border-dashed border-[#d4d4d8] bg-white px-3 py-2.5 text-[13px] text-gray-400 transition hover:border-gray-400 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/30"
              >
                <Upload className="h-4 w-4 shrink-0" />
                <span>Drop your content link or file here</span>
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => toast.success("Submitted for brand review!")}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0a0a0a] text-[14px] font-bold text-white transition hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-white/90"
        >
          <Check className="h-4 w-4" />
          Submit for Brand Review
        </button>
      </div>

      {/* Brief reminder */}
      <div className="rounded-2xl border border-[#fbcfe8] bg-[#fdf2f8] p-4 dark:border-pink-900/30 dark:bg-pink-950/20">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[15px]">📋</span>
          <p className="text-[13px] font-bold text-[#be185d] dark:text-pink-400">Brief reminder</p>
        </div>
        <p className="text-[13px] leading-relaxed text-[#831843] dark:text-pink-200/80">
          {deal.briefSummary}
        </p>
      </div>
    </div>
  )
}

// ─── Contract Stage Panel ─────────────────────────────────────────────────────

function ContractStagePanel({ deal }: { deal: WorkspaceDeal }) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
        <div className="mb-2 flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <p className="text-[13px] font-bold text-amber-700 dark:text-amber-400">Contract ready to sign</p>
        </div>
        <p className="text-[13px] leading-relaxed text-amber-600 dark:text-amber-200/70">
          Review the terms carefully. Once you sign, your workspace will be unlocked and you can start creating content.
        </p>
      </div>

      <div className="rounded-2xl border border-[#efefef] bg-[#fafafa] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="mb-3 text-[13px] font-bold text-[#0a0a0a] dark:text-white">Contract terms</p>
        <div className="flex flex-col gap-2">
          {[
            { label: "Total amount", value: deal.total },
            { label: "Usage rights", value: "60 days paid usage across brand-owned channels" },
            { label: "Exclusivity", value: "30-day category exclusivity" },
            { label: "Deadline", value: deal.due },
            { label: "Revision rounds", value: "2" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-[12px] text-gray-400">{label}</span>
              <span className="text-right text-[12px] font-medium text-[#0a0a0a] dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => toast.success("Contract signed! Workspace unlocked.", { description: "You can now start uploading content." })}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0a0a0a] text-[14px] font-bold text-white transition hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a]"
      >
        <FileText className="h-4 w-4" />
        Sign Contract
      </button>
    </div>
  )
}

// ─── Tracking Stage Panel ─────────────────────────────────────────────────────

function TrackingStagePanel({ deal }: { deal: WorkspaceDeal }) {
  const milestone = deal.paymentMilestones.find(m => m.type === "performance" && m.status === "locked")
  const progress = milestone && milestone.targetViews
    ? Math.min((milestone.currentViews! / milestone.targetViews) * 100, 100)
    : 0

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <p className="text-[13px] font-bold text-emerald-700 dark:text-emerald-400">Content is live — tracking performance</p>
        </div>
        {milestone && (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] text-emerald-600 dark:text-emerald-400">
                {(milestone.currentViews! / 1000).toFixed(1)}K / {(milestone.targetViews! / 1000).toFixed(0)}K views
              </span>
              <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-300">
                Next unlock: {milestone.amount}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-900/40">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Posted deliverables */}
      <div className="flex flex-col gap-2">
        {deal.deliverables.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-xl border border-[#efefef] bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <span className="text-[13px] font-medium text-[#0a0a0a] dark:text-white">{d.name}</span>
            <span className={cn(
              "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              d.status === "posted" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : d.status === "approved" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-gray-100 text-gray-500"
            )}>
              {d.status === "posted" ? "Posted" : d.status === "approved" ? "Approved" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Right Rail ───────────────────────────────────────────────────────────────

function TimelineCard({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="rounded-2xl border border-[#efefef] bg-white p-4 dark:border-white/10 dark:bg-[#111111]">
      <div className="mb-3 flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-gray-400" />
        <p className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">Timeline</p>
      </div>
      <div className="flex flex-col gap-3">
        {events.filter(e => e.status !== "pending").map((e) => (
          <div key={e.id} className="flex items-start gap-3">
            <div className={cn(
              "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full",
              e.status === "active" ? "bg-[#0a0a0a] dark:bg-white" : "bg-[#d4d4d8] dark:bg-white/20"
            )} />
            <div className="flex flex-col gap-0.5">
              {e.timestamp && (
                <span className="text-[11px] text-gray-400">{e.timestamp}</span>
              )}
              <span className={cn(
                "text-[13px] font-medium",
                e.status === "active" ? "text-[#0a0a0a] dark:text-white" : "text-gray-500 dark:text-white/50"
              )}>
                {e.label}
              </span>
              {e.note && (
                <span className="text-[11px] text-gray-400">{e.note}</span>
              )}
            </div>
          </div>
        ))}
        {/* Pending events greyed out */}
        {events.filter(e => e.status === "pending").map((e) => (
          <div key={e.id} className="flex items-start gap-3 opacity-40">
            <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border border-[#d4d4d8] dark:border-white/20" />
            <span className="text-[13px] font-medium text-gray-400 dark:text-white/30">{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentMilestonesCard({ milestones }: { milestones: PaymentMilestone[] }) {
  return (
    <div className="rounded-2xl border border-[#efefef] bg-white p-4 dark:border-white/10 dark:bg-[#111111]">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[15px]">💰</span>
        <p className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">Payment Milestones</p>
      </div>
      <div className="flex flex-col gap-2">
        {milestones.map((m) => (
          <div key={m.id} className={cn(
            "flex items-center justify-between rounded-xl px-3 py-2.5",
            m.status === "released"
              ? "bg-emerald-50 dark:bg-emerald-900/20"
              : "bg-[#f4f4f5] dark:bg-white/[0.04]"
          )}>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-medium text-[#0a0a0a] dark:text-white">{m.label}</span>
              {m.type === "performance" && m.currentViews !== undefined && m.targetViews && (
                <span className="text-[11px] text-gray-400">
                  {(m.currentViews / 1000).toFixed(0)}K / {(m.targetViews / 1000).toFixed(0)}K views
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "text-[13px] font-bold",
                m.status === "released" ? "text-emerald-600 dark:text-emerald-400" : "text-[#0a0a0a] dark:text-white"
              )}>
                {m.amount}
              </span>
              {m.status === "released" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Lock className="h-3 w-3 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Master List Row ──────────────────────────────────────────────────────────

function DealRow({ deal, onClick }: { deal: WorkspaceDeal; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-white/[0.03]"
    >
      {/* Brand logo */}
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[14px] border border-[#efefef] bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
        <BrandLogo domain={deal.domain} name={deal.brand} className="absolute inset-0 h-full w-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-[14px] font-bold text-[#0a0a0a] dark:text-white">{deal.brand}</p>
        <p className="truncate text-[12px] text-gray-400 dark:text-white/40">{deal.subtitle}</p>
      </div>

      {/* Status pill */}
      <div className="shrink-0 hidden sm:block">
        <StatusPill stage={deal.stage} deal={deal} />
      </div>

      {/* Total */}
      <p className="shrink-0 text-[14px] font-bold text-[#0a0a0a] dark:text-white">
        {deal.total}
      </p>

      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 dark:text-white/20 transition-transform group-hover:translate-x-0.5" />
    </button>
  )
}

// ─── Individual Workspace View ────────────────────────────────────────────────

function IndividualWorkspace({ deal, onBack }: { deal: WorkspaceDeal; onBack: () => void }) {
  const activeStageLabel = STEPPER_STAGES.find(s => s.key === deal.stage)?.label.replace("\n", " & ") ?? ""

  function renderActivePanel() {
    switch (deal.stage) {
      case "contract": return <ContractStagePanel deal={deal} />
      case "content": return <ContentStagePanel deal={deal} />
      case "tracking": return <TrackingStagePanel deal={deal} />
      case "completed":
        return (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="text-[14px] font-bold text-emerald-700 dark:text-emerald-400">Deal complete — all payments released</p>
                <p className="text-[12px] text-emerald-600/70 dark:text-emerald-400/60 mt-0.5">
                  Great work! This deal has been archived.
                </p>
              </div>
            </div>
          </div>
        )
      default: return null
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex w-fit items-center gap-2 text-[14px] font-semibold text-gray-400 transition hover:text-[#0a0a0a] dark:hover:text-white shrink-0 px-6 pt-6"
      >
        <ChevronLeft className="h-4 w-4" />
        All deals
      </button>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row gap-5 px-6 pb-6 overflow-y-auto lg:overflow-hidden">
        {/* ── Left panel ── */}
        <div className="flex flex-1 flex-col min-h-0">
          <ScrollShadow hideScrollBar className="flex-1 overflow-y-auto">
            {/* Header */}
            <div className="rounded-2xl border border-[#efefef] bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-[#efefef] bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
                  <BrandLogo domain={deal.domain} name={deal.brand} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-gray-400">{deal.brand}</p>
                  <h1 className="text-[17px] font-bold leading-snug text-[#0a0a0a] dark:text-white">{deal.title}</h1>
                </div>
                <p className="shrink-0 text-[18px] font-bold text-[#0a0a0a] dark:text-white">{deal.total}</p>
              </div>

              {/* Horizontal stepper */}
              <HorizontalStepper currentStage={deal.stage} />
            </div>

            {/* Active stage panel */}
            {deal.stage !== "completed" && (
              <div className="mt-4 rounded-2xl border border-[#efefef] bg-white p-5 dark:border-white/10 dark:bg-[#111111]">
                <div className="flex items-center gap-2">
                  <span className="text-[15px]">
                    {deal.stage === "contract" ? "📝" : deal.stage === "content" ? "🎬" : "📊"}
                  </span>
                  <p className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">
                    {activeStageLabel} — <span className="text-[#0060ff] dark:text-[#4d90fe]">in progress</span>
                  </p>
                </div>
                {renderActivePanel()}
              </div>
            )}

            {deal.stage === "completed" && renderActivePanel()}
          </ScrollShadow>
        </div>

        {/* ── Right rail ── */}
        <div className="flex w-full flex-col gap-4 lg:w-[300px] xl:w-[320px] shrink-0">
          <TimelineCard events={deal.timeline} />
          <PaymentMilestonesCard milestones={deal.paymentMilestones} />

          <button
            type="button"
            onClick={() => toast.info("Opening message thread…", { description: `Starting conversation with ${deal.brand}` })}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0a0a0a] text-[14px] font-bold text-white transition hover:bg-black/80 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/10 border dark:border-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Message Brand
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Master List ──────────────────────────────────────────────────────────────

function MasterList({ onSelect }: { onSelect: (deal: WorkspaceDeal) => void }) {
  const [tab, setTab] = useState<"active" | "completed">("active")

  const activeDeals = WORKSPACE_DEALS.filter(d => d.stage !== "completed")
  const completedDeals = WORKSPACE_DEALS.filter(d => d.stage === "completed")
  const deals = tab === "active" ? activeDeals : completedDeals

  return (
    <div className="flex flex-col h-full overflow-hidden px-6 pt-6 pb-6">
      {/* Header */}
      <div className="mb-5 shrink-0">
        <h1 className="text-[26px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Workspace</h1>
      </div>

      {/* Tab pills */}
      <div className="mb-4 flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all",
            tab === "active"
              ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
              : "bg-[#f4f4f5] text-gray-500 hover:bg-[#efefef] dark:bg-white/[0.06] dark:text-white/40 dark:hover:bg-white/10"
          )}
        >
          Active ({activeDeals.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("completed")}
          className={cn(
            "rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all",
            tab === "completed"
              ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
              : "bg-[#f4f4f5] text-gray-500 hover:bg-[#efefef] dark:bg-white/[0.06] dark:text-white/40 dark:hover:bg-white/10"
          )}
        >
          Completed ({completedDeals.length})
        </button>
      </div>

      {/* Deal list */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[#efefef] bg-white dark:border-white/10 dark:bg-[#111111] divide-y divide-[#f4f4f5] dark:divide-white/[0.06]">
        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f4f5] dark:bg-white/5">
              <Zap className="h-5 w-5 text-gray-300 dark:text-white/20" />
            </div>
            <p className="text-[15px] font-semibold text-gray-400 dark:text-white/30">
              {tab === "active" ? "No active deals" : "No completed deals yet"}
            </p>
            <p className="mt-1 text-[13px] text-gray-300 dark:text-white/20">
              {tab === "active"
                ? "Deals appear here once a bid is confirmed"
                : "Completed deals will be archived here"}
            </p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealRow key={deal.id} deal={deal} onClick={() => onSelect(deal)} />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function WorkspaceApp() {
  const [selectedDeal, setSelectedDeal] = useState<WorkspaceDeal | null>(null)

  const openDeal = (deal: WorkspaceDeal) => {
    setSelectedDeal(deal)
    window.history.pushState({ modal: "workspace-deal" }, "")
  }

  const closeDeal = () => {
    if (window.history.state?.modal === "workspace-deal") {
      window.history.back()
    } else {
      setSelectedDeal(null)
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      if (selectedDeal) setSelectedDeal(null)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [selectedDeal])

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      {selectedDeal ? (
        <IndividualWorkspace deal={selectedDeal} onBack={closeDeal} />
      ) : (
        <MasterList onSelect={openDeal} />
      )}
    </div>
  )
}
