"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, CheckCircle2, ChevronRight, CircleDollarSign, FileText, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { useAccount } from "@/context/account-context"
import { useCampaigns } from "@/context/campaigns-context"
import { toUiCampaignStatus, type UiCampaignStatus } from "@/lib/api"
import { cn } from "@/lib/utils"

const statuses: { id: "all" | UiCampaignStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "planning", label: "Planning" },
  { id: "completed", label: "Completed" },
  { id: "archived", label: "Archived" },
]

const card = "rounded-2xl border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]"
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`

export function BrandCampaignApp() {
  const { account } = useAccount()
  const { campaigns: apiCampaigns, applicationsByCampaign, refreshApplications } = useCampaigns()
  const router = useRouter()
  const [tab, setTab] = useState<"all" | UiCampaignStatus>("all")
  const [query, setQuery] = useState("")
  void account
  const canManage = true

  // Pull application counts per campaign so cards can show review progress.
  useEffect(() => {
    for (const c of apiCampaigns) {
      if (!applicationsByCampaign[c.id]) void refreshApplications(c.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiCampaigns.length])

  const campaigns = apiCampaigns
    .map((c) => ({ ...c, uiStatus: toUiCampaignStatus(c.status) }))
    .filter((campaign) =>
      (tab === "all" || campaign.uiStatus === tab) && campaign.title.toLowerCase().includes(query.toLowerCase()),
    )
  const stats = useMemo(() => {
    const counts = apiCampaigns.map((c) => {
      const items = applicationsByCampaign[c.id]?.items ?? []
      return {
        pending: items.filter((a) => a.status === "pending").length,
        accepted: items.filter((a) => a.status === "accepted").length,
        total: items.length,
      }
    })
    const total = counts.reduce((n, c) => n + c.total, 0)
    const accepted = counts.reduce((n, c) => n + c.accepted, 0)
    const pending = counts.reduce((n, c) => n + c.pending, 0)
    const committed = apiCampaigns.reduce((n, c) => n + Number(c.budgetTotal || 0), 0)
    return {
      live: apiCampaigns.filter((campaign) => campaign.status === "active").length,
      delivery: total ? Math.round((accepted / total) * 100) : 0,
      reviews: pending,
      committed,
    }
  }, [apiCampaigns, applicationsByCampaign])

  return <div className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-[#0a0a0a]"><div className="px-6 pb-12 pt-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Campaigns</h1><p className="mt-1 text-[13px] text-[#737373]">Plan, manage, and measure creator campaigns.</p></div>
      {canManage && <button onClick={() => router.push("/campaign/new")} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] px-4 text-[13px] font-semibold text-white dark:bg-white dark:text-[#0a0a0a]"><Plus className="size-4" />Create campaign</button>}
    </div>
    <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Stat label="Live campaigns" value={String(stats.live)} icon={BarChart3} />
      <Stat label="Deliverables on track" value={`${stats.delivery}%`} icon={CheckCircle2} />
      <Stat label="Awaiting review" value={String(stats.reviews)} icon={FileText} />
      <Stat label="Committed budget" value={money(stats.committed)} icon={CircleDollarSign} />
    </div>
    <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-5 overflow-x-auto">{statuses.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={cn("relative shrink-0 pb-2.5 text-[13px] font-semibold", tab === item.id ? "text-[#0060ff]" : "text-[#737373] dark:text-[#a1a1aa]")}>{item.label}{tab === item.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#0060ff]" />}</button>)}</div>
      <label className="flex h-9 items-center gap-2 rounded-xl border border-[#e4e4e7] px-3 dark:border-[#27272a]"><Search className="size-4 text-[#a1a1aa]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campaigns" className="w-full bg-transparent text-[13px] outline-none sm:w-48" /></label>
    </div>
    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {campaigns.map((campaign) => {
        const items = applicationsByCampaign[campaign.id]?.items ?? []
        const accepted = items.filter((a) => a.status === "accepted").length
        return <CampaignCard key={campaign.id} campaign={campaign} accepted={accepted} total={items.length} onOpen={() => router.push(`/campaign/${campaign.id}`)} />
      })}
    </div>
    {!campaigns.length && <div className="mt-5 rounded-2xl border border-dashed border-[#d4d4d8] py-16 text-center text-[13px] text-[#737373]">No campaigns in this view.</div>}
  </div></div>
}

function Stat({ label, value, icon: Icon }: any) {
  return <div className={cn(card, "p-4")}><div className="flex items-center gap-2 text-[#737373]"><Icon className="size-4 text-[#a1a1aa]" /><span className="text-[12px] font-semibold">{label}</span></div><p className="mt-3 text-[24px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{value}</p></div>
}

function CampaignCard({ campaign, accepted, total, onOpen }: any) {
  const progress = total ? Math.round((accepted / total) * 100) : 0
  const tone = campaign.uiStatus === "live" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15" : campaign.uiStatus === "planning" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15" : "bg-[#f4f4f5] text-[#737373]"
  const dates = [campaign.campaignStartDate, campaign.campaignEndDate].filter(Boolean).map((d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })).join(" – ")
  return <button onClick={onOpen} className={cn(card, "p-5 text-left transition hover:-translate-y-0.5 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10")}>
    <div className="flex items-start justify-between gap-3"><div><p className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">{campaign.title}</p><p className="mt-1 text-[11px] text-[#737373]">{(campaign.nicheTags ?? []).join(" · ")}{dates ? ` · ${dates}` : ""}</p></div><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold capitalize", tone)}>{campaign.uiStatus}</span></div>
    <p className="mt-4 line-clamp-2 text-[12px] leading-relaxed text-[#737373]">{campaign.description}</p>
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#f4f4f5] dark:bg-[#27272a]"><div className="h-full rounded-full bg-[#0060ff]" style={{ width: `${progress}%` }} /></div>
    <div className="mt-2 flex justify-between text-[11px] text-[#737373]"><span>{accepted}/{total} accepted</span><span>{campaign.maxCreators} creators</span></div>
    <div className="mt-5 grid grid-cols-3 gap-2"><Metric label="Budget" value={money(Number(campaign.budgetTotal || 0))} /><Metric label="Per creator" value={money(Number(campaign.budgetPerCreator || 0))} /><Metric label="Deliverables" value={String(campaign.deliverables?.length ?? 0)} /></div>
    <div className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-[#0060ff]">Open campaign <ChevronRight className="size-4" /></div>
  </button>
}


function Metric({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl bg-[#f8f8f9] px-2.5 py-2 dark:bg-[#111111]"><p className="text-[9px] text-[#737373]">{label}</p><p className="mt-1 truncate text-[11px] font-bold text-[#0a0a0a] dark:text-white">{value}</p></div>
}
