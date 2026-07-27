"use client"

import { Typography } from "@heroui/react"

import { useMemo, useState } from "react"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faTiktok, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUpRight, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, CircleDollarSign, Eye, Filter, Layers3, MousePointerClick, UsersRound, X } from "lucide-react"
import { ChartAreaStacked } from "@gravity-ui/icons"
import { useAccount } from "@/context/account-context"
import { brandAnalyticsPlatforms, formatAnalyticsNumber, type BrandAnalyticsCampaign, type BrandAnalyticsCreator } from "@/lib/brand-analytics-data"
import { cn } from "@/lib/utils"
import { AnalyticsBigMetricCard, AnalyticsSmallMetricCard, type AnalyticsMetric } from "./analytics-metric-cards"

const TIMEFRAMES = ["7D", "30D", "90D", "ALL"]
const TABS = ["Overview", "Campaigns", "Creators", "Platforms"] as const
type Tab = typeof TABS[number]
type SocialPlatform = "all" | "Instagram" | "TikTok" | "YouTube"

const SOCIAL_PLATFORMS = [
  { id: "all", label: "Analytics", icon: ChartAreaStacked, color: "text-[#0ea5e9]", activeBg: "bg-[#0ea5e9]/10 dark:bg-[#0ea5e9]/20" },
  { id: "Instagram", label: "Instagram", icon: faInstagram, color: "text-[#e1306c]", activeBg: "bg-[#e1306c]/10 dark:bg-[#e1306c]/20" },
  { id: "TikTok", label: "TikTok", icon: faTiktok, color: "text-[#14b8a6]", activeBg: "bg-[#14b8a6]/10 dark:bg-[#14b8a6]/20" },
  { id: "YouTube", label: "YouTube", icon: faYoutube, color: "text-[#ef4444]", activeBg: "bg-[#ef4444]/10 dark:bg-[#ef4444]/20" },
] as const

const currency = (value: number) => `₹${formatAnalyticsNumber(value)}`
const rate = (engagements: number, impressions: number) => impressions ? `${((engagements / impressions) * 100).toFixed(1)}%` : "—"
const timeframeScale: Record<string, number> = { "7D": 0.28, "30D": 1, "90D": 2.7, "ALL": 5.2 }
const cardSeries = (value: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, index) => ({ name, value: Math.max(0, Number((value * (0.7 + index * 0.055 + Math.sin(index * 1.7) * 0.06)).toFixed(2))) }))
const makeMetric = (id: string, label: string, value: number, change: number, suffix = ""): AnalyticsMetric => ({ id, label, value, suffix, change, series: cardSeries(value) })

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: { id: string; label: string }[]; onChange: (value: string) => void }) {
  return <label className="flex h-9 items-center gap-2 rounded-xl border border-[#e4e4e7] bg-white px-3 dark:border-[#27272a] dark:bg-[#111111]">
    <Filter className="size-3.5 text-[#a1a1aa]" /><span className="hidden text-[11px] font-medium text-[#737373] sm:inline">{label}</span>
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="max-w-[150px] bg-transparent text-[12px] font-semibold text-[#0a0a0a] outline-none dark:text-white">
      {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  </label>
}

export function BrandAnalyticsApp() {
  const { brandAnalytics, brandFinance } = useAccount()
  const [timeframe, setTimeframe] = useState("30D")
  const [tab, setTab] = useState<Tab>("Overview")
  const [campaignId, setCampaignId] = useState("all")
  const [creatorId, setCreatorId] = useState("all")
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>("all")
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false)
  const [detail, setDetail] = useState<{ kind: "campaign"; item: BrandAnalyticsCampaign } | { kind: "creator"; item: BrandAnalyticsCreator } | null>(null)

  const scope = useMemo(() => {
    const chosenCampaigns = brandAnalytics.campaigns.filter(campaign => campaignId === "all" || campaign.id === campaignId)
    const chosenCreators = brandAnalytics.creators.filter(creator => creatorId === "all" || creator.id === creatorId)
    const campaigns = creatorId === "all" ? chosenCampaigns : chosenCampaigns.filter(campaign => campaign.creatorIds.includes(creatorId))
    const creators = campaignId === "all" ? chosenCreators : chosenCreators.filter(creator => creator.campaignIds.includes(campaignId))
    return { campaigns, creators }
  }, [brandAnalytics, campaignId, creatorId])

  const activeSocialPlatform = SOCIAL_PLATFORMS.find(platform => platform.id === socialPlatform) || SOCIAL_PLATFORMS[0]
  const displayedCampaigns = useMemo(() => socialPlatform === "all" ? scope.campaigns : scope.campaigns.map(campaign => {
    const share = campaign.platformShare[socialPlatform] / 100
    return { ...campaign, reach: Math.round(campaign.reach * share), impressions: Math.round(campaign.impressions * share), engagements: Math.round(campaign.engagements * share), clicks: Math.round(campaign.clicks * share), conversions: Math.round(campaign.conversions * share), weeklyReach: campaign.weeklyReach.map(value => Math.round(value * share)) }
  }), [scope.campaigns, socialPlatform])
  const displayedCreators = useMemo(() => socialPlatform === "all" ? scope.creators : scope.creators.map(creator => {
    const share = creator.platformShare[socialPlatform] / 100
    return { ...creator, reach: Math.round(creator.reach * share), impressions: Math.round(creator.impressions * share), engagements: Math.round(creator.engagements * share), clicks: Math.round(creator.clicks * share), conversions: Math.round(creator.conversions * share), attributedValue: Math.round(creator.attributedValue * share) }
  }), [scope.creators, socialPlatform])

  const metrics = useMemo(() => {
    const total = <T extends keyof BrandAnalyticsCampaign>(key: T) => displayedCampaigns.reduce((sum, item) => sum + Number(item[key] || 0), 0)
    const completed = displayedCampaigns.reduce((sum, item) => sum + item.deliverables.completed, 0)
    const deliverables = displayedCampaigns.reduce((sum, item) => sum + item.deliverables.total, 0)
    const spend = displayedCampaigns.reduce((sum, item) => sum + (brandFinance.campaignBudgets.find(budget => budget.id === item.id)?.committed || 0), 0)
    const value = displayedCampaigns.reduce((sum, item) => sum + (brandFinance.campaignBudgets.find(budget => budget.id === item.id)?.attributedValue || 0), 0)
    const impressions = total("impressions")
    return { reach: total("reach"), impressions, engagements: total("engagements"), clicks: total("clicks"), conversions: total("conversions"), completed, deliverables, spend, value, engagementRate: rate(total("engagements"), impressions), roas: spend ? `${(value / spend).toFixed(1)}x` : "—" }
  }, [displayedCampaigns, brandFinance])

  const trendData = useMemo(() => {
    const multiplier = timeframe === "7D" ? 0.34 : timeframe === "90D" ? 1.55 : timeframe === "ALL" ? 2.15 : 1
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => ({ day, reach: Math.round(displayedCampaigns.reduce((sum, campaign) => sum + campaign.weeklyReach[index], 0) * multiplier) }))
  }, [displayedCampaigns, timeframe])

  const platformData = useMemo(() => brandAnalyticsPlatforms.filter(platform => socialPlatform === "all" || platform.id === socialPlatform).map(platform => ({ name: platform.id, color: platform.color, reach: Math.round(scope.campaigns.reduce((sum, campaign) => sum + campaign.reach * campaign.platformShare[platform.id] / 100, 0)), engagements: Math.round(scope.campaigns.reduce((sum, campaign) => sum + campaign.engagements * campaign.platformShare[platform.id] / 100, 0)), clicks: Math.round(scope.campaigns.reduce((sum, campaign) => sum + campaign.clicks * campaign.platformShare[platform.id] / 100, 0)) })), [scope.campaigns, socialPlatform])

  const overviewMetrics = useMemo(() => {
    const completion = metrics.deliverables ? metrics.completed / metrics.deliverables * 100 : 0
    const large = [
      makeMetric("reach", "Total Reach", metrics.reach, 18.5),
      makeMetric("engagement", "Engagement Rate", Number(metrics.engagementRate.replace("%", "")) || 0, 12.4, "%"),
      makeMetric("value", "Attributed Value", metrics.value, 21.8, "₹"),
    ]
    const comparable = [
      makeMetric("impressions", "Impressions", metrics.impressions, 14.8),
      makeMetric("clicks", "Clicks", metrics.clicks, 16.2),
      makeMetric("conversions", "Conversions", metrics.conversions, 11.6),
      makeMetric("engagement", "Content Complete", completion, 8.4, "%"),
      makeMetric("value", "Campaign Spend", metrics.spend, 6.9, "₹"),
      makeMetric("engagement", "ROAS", Number(metrics.roas.replace("x", "")) || 0, 19.3, "x"),
    ]
    if (socialPlatform === "all") return { large, small: comparable }

    const allReach = brandAnalytics.campaigns.reduce((sum, campaign) => sum + campaign.reach, 0) || 1
    const scopeCoverage = scope.campaigns.reduce((sum, campaign) => sum + campaign.reach, 0) / allReach
    const native = (brandAnalytics.platformNativeMetrics?.[socialPlatform] ?? []).map(item => {
      const shouldScale = item.suffix !== "m"
      const value = item.value * Math.max(scopeCoverage, 0.08) * (shouldScale ? timeframeScale[timeframe] : 1)
      return makeMetric(item.id, item.label, value, item.change, item.suffix)
    })
    return { large, small: [...comparable, ...native] }
  }, [brandAnalytics, metrics, scope.campaigns, socialPlatform, timeframe])

  const platformCardGroups = useMemo(() => {
    const platformIds = socialPlatform === "all" ? brandAnalyticsPlatforms.map(platform => platform.id) : [socialPlatform]
    const allReach = brandAnalytics.campaigns.reduce((sum, campaign) => sum + campaign.reach, 0) || 1
    const nativeCardIds: Record<Exclude<SocialPlatform, "all">, string[]> = {
      Instagram: ["profile_visits", "saves"],
      TikTok: ["video_views", "shares"],
      YouTube: ["watch_time", "subscribers"],
    }

    return platformIds.map(platformId => {
      const platform = brandAnalyticsPlatforms.find(item => item.id === platformId)!
      const scaledCampaigns = scope.campaigns.map(campaign => {
        const share = campaign.platformShare[platformId] / 100
        return { ...campaign, reach: campaign.reach * share, impressions: campaign.impressions * share, engagements: campaign.engagements * share }
      })
      const reach = scaledCampaigns.reduce((sum, campaign) => sum + campaign.reach, 0)
      const impressions = scaledCampaigns.reduce((sum, campaign) => sum + campaign.impressions, 0)
      const engagements = scaledCampaigns.reduce((sum, campaign) => sum + campaign.engagements, 0)
      const coverage = scope.campaigns.reduce((sum, campaign) => sum + campaign.reach, 0) / allReach
      const native = brandAnalytics.platformNativeMetrics?.[platformId] ?? []
      const nativeCards = nativeCardIds[platformId].map(id => native.find(metric => metric.id === id)).filter(Boolean).map(metric => {
        const shouldScale = metric!.suffix !== "m"
        return makeMetric(metric!.id, metric!.label, metric!.value * Math.max(coverage, 0.08) * (shouldScale ? timeframeScale[timeframe] : 1), metric!.change, metric!.suffix)
      })
      return {
        id: platformId,
        accent: platform.color,
        hasActivity: reach > 0,
        large: makeMetric("reach", `${platformId} Reach`, reach, platformId === "TikTok" ? 24.6 : platformId === "YouTube" ? 19.1 : 18.5),
        small: [
          makeMetric("engagement", "Engagement Rate", impressions ? engagements / impressions * 100 : 0, 12.4, "%"),
          makeMetric("value", "Attributed Value", brandFinance.campaignBudgets.reduce((sum, budget) => sum + budget.attributedValue, 0) * (reach / allReach), 21.8, "₹"),
          ...nativeCards,
        ]
      }
    })
  }, [brandAnalytics, brandFinance.campaignBudgets, scope.campaigns, socialPlatform, timeframe])

  const clearFilters = () => { setCampaignId("all"); setCreatorId("all") }
  const hasResults = scope.campaigns.length > 0 && scope.creators.length > 0

  return <div className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-[#0a0a0a]">
    <div className="flex shrink-0 flex-col gap-4 px-6 pb-4 pt-5 lg:pt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-50">
          <button type="button" aria-haspopup="listbox" aria-expanded={isPlatformMenuOpen} onClick={() => setIsPlatformMenuOpen(open => !open)} className="group flex h-[32px] cursor-pointer items-center gap-2 outline-none transition-opacity hover:opacity-80">
            {activeSocialPlatform.id !== "all" && <FontAwesomeIcon icon={activeSocialPlatform.icon} className={cn("text-[32px] shrink-0", activeSocialPlatform.color)} />}
            <span className="text-[28px] font-bold tracking-tight leading-none text-[#0a0a0a] dark:text-white">{activeSocialPlatform.label}</span>
            {isPlatformMenuOpen ? <ChevronUp className="size-5 text-[#a1a1aa]" /> : <ChevronDown className="size-5 text-[#a1a1aa]" />}
          </button>
          {isPlatformMenuOpen && <div role="listbox" aria-label="Select social platform" className="absolute left-0 top-[calc(100%+8px)] z-50 w-[220px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#18181b]">
            {SOCIAL_PLATFORMS.map(platform => { const PlatformIcon = platform.icon; const selected = platform.id === socialPlatform; return <button key={platform.id} type="button" role="option" aria-selected={selected} onClick={() => { setSocialPlatform(platform.id); setIsPlatformMenuOpen(false) }} className={cn("flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left transition-colors cursor-pointer", selected ? platform.activeBg : "hover:bg-gray-50 dark:hover:bg-white/5")}>
              {platform.id === "all" ? <PlatformIcon className={cn("size-[18px]", selected ? platform.color : "text-[#737373] dark:text-[#a1a1aa]")} /> : <FontAwesomeIcon icon={PlatformIcon} className={cn("size-[18px]", selected ? platform.color : "text-[#737373] dark:text-[#a1a1aa]")} />}
              <span className={cn("text-[14px] font-medium", selected ? platform.color : "text-[#0a0a0a] dark:text-white")}>{platform.label}</span>
            </button> })}
          </div>}
        </div>
        <div className="flex w-full items-center rounded-xl border border-[#efefef] bg-[#f4f4f5] p-0.5 dark:border-[#27272a] dark:bg-[#111111] sm:w-auto">
          {TIMEFRAMES.map(item => <button key={item} onClick={() => setTimeframe(item)} className={cn("h-[30px] flex-1 rounded-[10px] px-3 text-[12px] font-semibold transition-all sm:w-[48px]", timeframe === item ? "bg-white text-[#0a0a0a] shadow-sm dark:bg-[#27272a] dark:text-white" : "text-[#737373] dark:text-[#a1a1aa]")}>{item}</button>)}
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-5 overflow-x-auto">
          {TABS.map(item => <button key={item} onClick={() => setTab(item)} className={cn("relative shrink-0 pb-3 text-[13px] font-semibold", tab === item ? "text-[#0060ff]" : "text-[#737373] dark:text-[#a1a1aa]")}>{item}{tab === item && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#0060ff]" />}</button>)}
        </div>
        <div className="flex flex-wrap items-center gap-2"><SelectControl label="Campaign" value={campaignId} onChange={setCampaignId} options={[{ id: "all", label: "All campaigns" }, ...brandAnalytics.campaigns.map(c => ({ id: c.id, label: c.name }))]} /><SelectControl label="Creator" value={creatorId} onChange={setCreatorId} options={[{ id: "all", label: "All creators" }, ...brandAnalytics.creators.map(c => ({ id: c.id, label: c.name }))]} />{(campaignId !== "all" || creatorId !== "all") && <button onClick={clearFilters} className="text-[12px] font-semibold text-[#0060ff]">Clear</button>}</div>
      </div>
    </div>

    {!hasResults ? <EmptyState onClear={clearFilters} /> : <div className="px-6 pb-10">
      {tab === "Overview" && <Overview cardMetrics={overviewMetrics} platformCardGroups={platformCardGroups} accent={socialPlatform === "all" ? "#0ea5e9" : brandAnalyticsPlatforms.find(platform => platform.id === socialPlatform)?.color ?? "#0ea5e9"} trendData={trendData} campaigns={displayedCampaigns} creators={displayedCreators} platformData={platformData} budgets={brandFinance.campaignBudgets} onCampaign={item => setDetail({ kind: "campaign", item })} onCreator={item => setDetail({ kind: "creator", item })} />}
      {tab === "Campaigns" && <Campaigns campaigns={displayedCampaigns} budgets={brandFinance.campaignBudgets} onSelect={item => setDetail({ kind: "campaign", item })} />}
      {tab === "Creators" && <Creators creators={displayedCreators} campaigns={brandAnalytics.campaigns} onSelect={item => setDetail({ kind: "creator", item })} />}
      {tab === "Platforms" && <Platforms items={platformData} />}
    </div>}
    {detail && <DetailPanel detail={detail} campaigns={brandAnalytics.campaigns} creators={brandAnalytics.creators} budgets={brandFinance.campaignBudgets} onClose={() => setDetail(null)} />}
  </div>
}

function Overview({ cardMetrics, platformCardGroups, accent, trendData, campaigns, creators, platformData, budgets, onCampaign, onCreator }: any) {
  return <div className="space-y-5">
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">{cardMetrics.large.map((metric: AnalyticsMetric) => <AnalyticsBigMetricCard key={metric.id} metric={metric} accent={accent} />)}</section>
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5">{cardMetrics.small.map((metric: AnalyticsMetric, index: number) => <AnalyticsSmallMetricCard key={`${metric.id}-${index}`} metric={metric} accent={accent} />)}</section>
    <section className="pt-1">
      <div className="mb-4 flex items-center justify-between"><Typography type="h3" className="text-[20px] font-bold tracking-tight text-[#0a0a0a] dark:text-white md:text-[24px]">Platform performance</Typography><span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">Creator delivery by platform</span></div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">{platformCardGroups.map((group: any) => <div key={group.id} className="min-w-0 rounded-2xl border border-[#e4e4e7] p-3 dark:border-[#27272a]">
        <div className="mb-3 flex items-center justify-between px-1"><span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">{group.id}</span><span className="size-2.5 rounded-full" style={{ background: group.accent }} /></div>
        {group.hasActivity ? <><AnalyticsBigMetricCard metric={group.large} accent={group.accent} /><div className="mt-3 grid grid-cols-2 gap-3">{group.small.map((metric: AnalyticsMetric, index: number) => <AnalyticsSmallMetricCard key={`${group.id}-${metric.id}-${index}`} metric={metric} accent={group.accent} />)}</div></> : <div className="flex h-[170px] flex-col items-center justify-center rounded-xl bg-[#f8f8f8] px-5 text-center dark:bg-white/[0.04]"><p className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">No activity in this scope</p><p className="mt-1 text-[11px] text-[#737373]">Adjust filters to view {group.id} reporting.</p></div>}
      </div>)}</div>
    </section>
    <div className="grid gap-5 xl:grid-cols-5"><section className="min-h-[300px] rounded-2xl border border-[#e4e4e7] bg-white p-5 xl:col-span-3 dark:border-[#27272a] dark:bg-[#0a0a0a]"><div className="mb-5"><Typography type="h3" className="font-bold text-[#0a0a0a] dark:text-white mb-2 text-[20px] md:text-[24px]">Campaign reach trend</Typography><p className="mt-1 text-[13px] text-[#737373] dark:text-[#a1a1aa]">Paid and organic creator distribution.</p></div><ResponsiveContainer width="100%" height={205}><AreaChart data={trendData}><defs><linearGradient id="brand-analytics-reach" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25}/><stop offset="100%" stopColor="#0ea5e9" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#737373" }}/><YAxis hide/><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }}/><Area type="monotone" dataKey="reach" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#brand-analytics-reach)" /></AreaChart></ResponsiveContainer></section><section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 xl:col-span-2 dark:border-[#27272a] dark:bg-[#0a0a0a]"><Typography type="h3" className="font-bold text-[#0a0a0a] dark:text-white mb-2 text-[20px] md:text-[24px]">Platform contribution</Typography><p className="mt-1 text-[13px] text-[#737373] dark:text-[#a1a1aa]">Reach by creator platform.</p><div className="mt-5 flex items-center"><ResponsiveContainer width={135} height={135}><PieChart><Pie data={platformData} dataKey="reach" innerRadius={42} outerRadius={62} paddingAngle={3} stroke="none">{platformData.map((item: any) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }}/></PieChart></ResponsiveContainer><div className="space-y-3">{platformData.map((item: any) => <div key={item.name} className="flex items-center gap-2 text-[13px]"><span className="size-2 rounded-full" style={{ background: item.color }} /><span className="w-[62px] font-semibold text-[#737373] dark:text-[#a1a1aa]">{item.name}</span><strong className="text-[#0a0a0a] dark:text-white">{formatAnalyticsNumber(item.reach)}</strong></div>)}</div></div></section></div>
    <div className="grid gap-5 xl:grid-cols-5"><section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 xl:col-span-3 dark:border-[#27272a] dark:bg-[#0a0a0a]"><Header title="Campaign performance" action="View all" /><div className="mt-2 divide-y divide-[#eeeeee] dark:divide-[#27272a]">{campaigns.slice(0, 3).map((campaign: BrandAnalyticsCampaign) => { const budget = budgets.find((item: any) => item.id === campaign.id); return <button onClick={() => onCampaign(campaign)} key={campaign.id} className="flex w-full items-center gap-3 py-3 text-left"><span className={cn("size-2 rounded-full", campaign.status === "Live" ? "bg-emerald-500" : campaign.status === "Planning" ? "bg-amber-400" : "bg-[#a1a1aa]")} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{campaign.name}</p><p className="mt-0.5 text-[11px] text-[#737373]">{campaign.deliverables.completed}/{campaign.deliverables.total} deliverables · {campaign.creatorIds.length} creators</p></div><div className="hidden text-right sm:block"><p className="text-[12px] font-bold text-[#0a0a0a] dark:text-white">{formatAnalyticsNumber(campaign.reach)}</p><p className="text-[10px] text-[#737373]">reach · {currency(budget?.committed || 0)} spend</p></div><ChevronRight className="size-4 text-[#a1a1aa]" /></button> })}</div></section><section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 xl:col-span-2 dark:border-[#27272a] dark:bg-[#0a0a0a]"><Header title="Creator leaders" action="Compare" /> <div className="mt-2 space-y-3">{creators.slice().sort((a: BrandAnalyticsCreator, b: BrandAnalyticsCreator) => b.attributedValue - a.attributedValue).slice(0, 3).map((creator: BrandAnalyticsCreator) => <button onClick={() => onCreator(creator)} key={creator.id} className="flex w-full items-center gap-3 text-left"><Image src={creator.avatarUrl} width={32} height={32} alt="" className="size-8 rounded-full" /><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-[#0a0a0a] dark:text-white">{creator.name}</p><p className="text-[10px] text-[#737373]">{formatAnalyticsNumber(creator.reach)} reach · {rate(creator.engagements, creator.impressions)} ER</p></div><strong className="text-[12px] text-[#0a0a0a] dark:text-white">{currency(creator.attributedValue)}</strong></button>)}</div></section></div>
  </div>
}

function Header({ title, action }: { title: string; action?: string }) { return <div className="flex items-center justify-between mb-4"><Typography type="h3" className="font-bold text-[#0a0a0a] dark:text-white text-[20px] md:text-[24px] tracking-tight">{title}</Typography>{action && <span className="text-[13px] font-semibold text-[#0060ff] cursor-pointer hover:underline">{action}</span>}</div> }

function Campaigns({ campaigns, budgets, onSelect }: any) { return <section className="overflow-hidden rounded-2xl border border-[#e4e4e7] dark:border-[#27272a]"><div className="border-b border-[#eeeeee] px-5 py-5 dark:border-[#27272a]"><Typography type="h3" className="font-bold text-[#0a0a0a] dark:text-white mb-1 text-[20px] md:text-[24px] tracking-tight">Campaign performance</Typography><p className="text-[13px] text-[#737373]">Results, delivery progress, and investment by campaign.</p></div><div className="divide-y divide-[#eeeeee] dark:divide-[#27272a]">{campaigns.map((campaign: BrandAnalyticsCampaign) => { const budget = budgets.find((item: any) => item.id === campaign.id); const value = budget?.attributedValue || 0; return <button key={campaign.id} onClick={() => onSelect(campaign)} className="grid w-full grid-cols-[minmax(150px,1.5fr)_repeat(2,minmax(75px,1fr))_20px] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-white/[0.03] sm:grid-cols-[minmax(180px,1.6fr)_repeat(5,minmax(82px,1fr))_20px]"><div><p className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{campaign.name}</p><p className="mt-1 text-[11px] text-[#737373]">{campaign.status} · {campaign.dates}</p></div><CellMetric label="Reach" value={formatAnalyticsNumber(campaign.reach)} /><CellMetric label="ER" value={rate(campaign.engagements, campaign.impressions)} /><div className="hidden sm:block"><CellMetric label="Delivery" value={`${campaign.deliverables.completed}/${campaign.deliverables.total}`} /></div><div className="hidden sm:block"><CellMetric label="Spend" value={currency(budget?.committed || 0)} /></div><div className="hidden sm:block"><CellMetric label="ROAS" value={budget?.committed ? `${(value / budget.committed).toFixed(1)}x` : "—"} /></div><ChevronRight className="size-4 text-[#a1a1aa]" /></button> })}</div></section> }
function CellMetric({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] text-[#737373]">{label}</p><p className="mt-1 text-[12px] font-bold text-[#0a0a0a] dark:text-white">{value}</p></div> }
function Creators({ creators, campaigns, onSelect }: any) { return <section className="overflow-hidden rounded-2xl border border-[#e4e4e7] dark:border-[#27272a]"><div className="border-b border-[#eeeeee] px-5 py-5 dark:border-[#27272a]"><Typography type="h3" className="font-bold text-[#0a0a0a] dark:text-white mb-1 text-[20px] md:text-[24px] tracking-tight">Creator contribution</Typography><p className="text-[13px] text-[#737373]">How each creator is contributing to campaign outcomes.</p></div><div className="divide-y divide-[#eeeeee] dark:divide-[#27272a]">{creators.slice().sort((a: BrandAnalyticsCreator, b: BrandAnalyticsCreator) => b.attributedValue - a.attributedValue).map((creator: BrandAnalyticsCreator) => <button key={creator.id} onClick={() => onSelect(creator)} className="grid w-full grid-cols-[minmax(180px,1.6fr)_repeat(2,minmax(78px,1fr))_20px] items-center gap-3 px-5 py-4 text-left hover:bg-[#fafafa] dark:hover:bg-white/[0.03] sm:grid-cols-[minmax(210px,1.5fr)_repeat(5,minmax(80px,1fr))_20px]"><div className="flex min-w-0 items-center gap-3"><Image src={creator.avatarUrl} width={40} height={40} alt="" className="size-10 rounded-full" /><div className="min-w-0"><p className="truncate text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{creator.name}</p><p className="truncate text-[11px] text-[#737373]">{creator.campaignIds.map((id: string) => campaigns.find((c: BrandAnalyticsCampaign) => c.id === id)?.name).join(" · ")}</p></div></div><CellMetric label="Reach" value={formatAnalyticsNumber(creator.reach)} /><CellMetric label="ER" value={rate(creator.engagements, creator.impressions)} /><div className="hidden sm:block"><CellMetric label="Delivery" value={`${creator.deliverables.completed}/${creator.deliverables.total}`} /></div><div className="hidden sm:block"><CellMetric label="Value" value={currency(creator.attributedValue)} /></div><div className="hidden sm:block"><CellMetric label="Conversions" value={String(creator.conversions)} /></div><ChevronRight className="size-4 text-[#a1a1aa]" /></button>)}</div></section> }
function Platforms({ items }: any) { return <div className="grid gap-5 xl:grid-cols-5"><section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 xl:col-span-3 dark:border-[#27272a] dark:bg-[#0a0a0a]"><Header title="Platform reach" /><p className="mt-1 text-[12px] text-[#737373]">A secondary view of where campaign content is performing.</p><ResponsiveContainer width="100%" height={260}><BarChart data={items} margin={{ top: 30, left: -18, right: 10 }}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#737373" }}/><YAxis tickFormatter={(value) => formatAnalyticsNumber(value)} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#737373" }}/><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }}/><Bar dataKey="reach" radius={[8, 8, 0, 0]}>{items.map((item: any) => <Cell key={item.name} fill={item.color} />)}</Bar></BarChart></ResponsiveContainer></section><section className="rounded-2xl border border-[#e4e4e7] bg-white p-5 xl:col-span-2 dark:border-[#27272a] dark:bg-[#0a0a0a]"><Header title="Platform breakdown" /><div className="mt-5 space-y-5">{items.map((item: any) => <div key={item.name}><div className="mb-2 flex justify-between text-[12px]"><span className="font-semibold text-[#0a0a0a] dark:text-white">{item.name}</span><span className="text-[#737373]">{formatAnalyticsNumber(item.reach)} reach</span></div><div className="h-2 overflow-hidden rounded-full bg-[#f4f4f5] dark:bg-[#27272a]"><div className="h-full rounded-full" style={{ width: `${Math.max(...items.map((candidate: any) => candidate.reach)) ? item.reach / Math.max(...items.map((candidate: any) => candidate.reach)) * 100 : 0}%`, background: item.color }} /></div><p className="mt-2 text-[11px] text-[#737373]">{formatAnalyticsNumber(item.engagements)} engagements · {formatAnalyticsNumber(item.clicks)} clicks</p></div>)}</div></section></div> }
function EmptyState({ onClear }: { onClear: () => void }) { return <div className="mx-6 flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4d4d8] px-6 text-center dark:border-[#3f3f46]"><UsersRound className="size-7 text-[#a1a1aa]" /><h2 className="mt-3 text-[15px] font-bold text-[#0a0a0a] dark:text-white">No reporting activity in this view</h2><p className="mt-2 max-w-sm text-[13px] text-[#737373] dark:text-[#a1a1aa]">Try a different campaign or creator to see workspace performance.</p><button onClick={onClear} className="mt-4 text-[13px] font-semibold text-[#0060ff]">Clear filters</button></div> }
function DetailPanel({ detail, campaigns, creators, budgets, onClose }: any) { const isCampaign = detail.kind === "campaign"; const item = detail.item; const relatedCreators = isCampaign ? creators.filter((creator: BrandAnalyticsCreator) => item.creatorIds.includes(creator.id)) : []; const relatedCampaigns = !isCampaign ? campaigns.filter((campaign: BrandAnalyticsCampaign) => item.campaignIds.includes(campaign.id)) : []; const share = item.platformShare; const budget = isCampaign ? budgets.find((entry: any) => entry.id === item.id) : null; return <div className="fixed inset-0 z-[100] flex justify-end bg-black/25 backdrop-blur-[1px]" onMouseDown={onClose}><aside onMouseDown={event => event.stopPropagation()} className="flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-white p-6 shadow-2xl dark:bg-[#111111]"><div className="flex items-start justify-between border-b border-[#eeeeee] pb-5 dark:border-[#27272a]"><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0060ff]">{isCampaign ? "Campaign analytics" : "Creator analytics"}</p><h2 className="mt-2 text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">{item.name}</h2><p className="mt-1 text-[12px] text-[#737373]">{isCampaign ? `${item.status} · ${item.dates}` : item.handle}</p></div><button onClick={onClose} className="rounded-lg p-2 text-[#737373] hover:bg-[#f4f4f5] dark:hover:bg-white/10"><X className="size-5" /></button></div><div className="grid grid-cols-2 gap-3 py-5"><CellMetric label="Reach" value={formatAnalyticsNumber(item.reach)} /><CellMetric label="Engagement rate" value={rate(item.engagements, item.impressions)} /><CellMetric label="Clicks" value={formatAnalyticsNumber(item.clicks)} /><CellMetric label="Conversions" value={String(item.conversions)} />{isCampaign && <><CellMetric label="Delivery" value={`${item.deliverables.completed}/${item.deliverables.total}`} /><CellMetric label="ROAS" value={budget?.committed ? `${(budget.attributedValue / budget.committed).toFixed(1)}x` : "—"} /></>}</div><div className="border-t border-[#eeeeee] py-5 dark:border-[#27272a]"><Header title="Platform mix" /><div className="mt-4 space-y-3">{brandAnalyticsPlatforms.map(platform => <div key={platform.id} className="flex items-center gap-3"><span className="size-2 rounded-full" style={{ background: platform.color }} /><span className="w-20 text-[12px] text-[#737373]">{platform.id}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f4f4f5] dark:bg-[#27272a]"><div className="h-full rounded-full" style={{ width: `${share[platform.id]}%`, background: platform.color }} /></div><strong className="w-8 text-right text-[12px] text-[#0a0a0a] dark:text-white">{share[platform.id]}%</strong></div>)}</div></div><div className="border-t border-[#eeeeee] py-5 dark:border-[#27272a]"><Header title={isCampaign ? "Creator contribution" : "Campaign contribution"} /><div className="mt-3 space-y-3">{(isCampaign ? relatedCreators : relatedCampaigns).map((related: any) => <div key={related.id} className="flex items-center justify-between rounded-xl bg-[#f8f8f8] px-3 py-3 dark:bg-white/[0.04]"><div><p className="text-[12px] font-semibold text-[#0a0a0a] dark:text-white">{related.name}</p><p className="mt-1 text-[11px] text-[#737373]">{formatAnalyticsNumber(related.reach)} reach · {rate(related.engagements, related.impressions)} ER</p></div><ChevronRight className="size-4 text-[#a1a1aa]" /></div>)}</div></div></aside></div> }
