"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUp,
  CalendarDays,
  Gem,
  Inbox,
  Target,
  Wallet,
  ChevronDown,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Check
} from "lucide-react"
import { StoriesBar } from "@/components/home/stories-bar"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"
import { Typography } from "@heroui/react"
import { Radar, RadarChart, PolarGrid, ResponsiveContainer } from "recharts"
import { RecommendedCampaignCard } from "@/components/campaign/recommended-campaign-card"
import { CAMPAIGNS, PIPELINE_DEALS } from "@/components/campaign/campaign-data"
import { getFinanceData } from "@/components/finance/finance-data"
import { getGlobalAnalyticsData, type AnalyticsTimeframe } from "@/components/analytics/platform-analytics-data"
import { EVENT_TYPE_CONFIG, formatTime, getUpcomingEvents, type CalendarEvent } from "@/lib/calendar-data"
import { useProfile } from "@/context/profile-context"
import { useAccount } from "@/context/account-context"
import { BrandLogo } from "@/components/ui/brand-logo"
import { cn } from "@/lib/utils"
import { BrandHomeApp } from "./brand-home-app"

const cardClass = "rounded-2xl border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a]"
const brandGradients = [
  "from-[#ff7a00] via-[#ff004d] to-[#8000ff]",
  "from-[#0ea5e9] via-[#0060ff] to-[#111827]",
  "from-[#84cc16] via-[#22c55e] to-[#0f766e]",
  "from-[#f97316] via-[#f43f5e] to-[#7c3aed]",
]

function formatCurrency(value: number, currency = "₹") {
  return `${currency}${value.toLocaleString("en-IN")}`
}

function getBrandInitials(name: string) {
  const words = name.split(/\s+/).filter(Boolean)
  return words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase()
}

function getBrandGradient(name: string) {
  const index = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % brandGradients.length
  return brandGradients[index]
}

function BrandMark({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", getBrandGradient(name), className)}>
      <span className="text-[12px] font-black tracking-tight">{getBrandInitials(name)}</span>
    </div>
  )
}

function CardHeader({ icon: Icon, title, action }: { icon: typeof Wallet; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#a1a1aa] dark:text-[#737373]" />
        <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">{title}</Typography>
      </div>
      {action}
    </div>
  )
}

function TodayEventRow({ event }: { event: CalendarEvent }) {
  const config = EVENT_TYPE_CONFIG[event.type]
  const time = event.allDay ? "All day" : `${formatTime(event.startTime ?? "09:00")} - ${formatTime(event.endTime ?? "10:00")}`

  return (
    <Link href={`/calendar?eventId=${event.id}`} className="block w-full">
      <button
        type="button"
        className={cn(
          "w-full rounded-lg text-left overflow-hidden transition-all duration-200 border",
          "hover:brightness-95 dark:hover:brightness-110 border-transparent hover:border-[#efefef] dark:hover:border-[#27272a]"
        )}
        style={{
          backgroundColor: `${config.color}15`,
          borderLeft: `4px solid ${config.color}`
        }}
      >
        <div className="px-3 py-2.5 flex flex-col h-full">
          <Typography type="body-sm" className="font-semibold leading-tight text-[#0a0a0a] dark:text-gray-100 line-clamp-1 mb-0.5">
            {event.title}
          </Typography>
          <Typography type="body-xs" className="flex items-center gap-1.5 font-medium text-gray-500 dark:text-gray-400">
            <span style={{ color: config.color }}>{config.label}</span>
            <span>•</span>
            <span>{time}</span>
          </Typography>
        </div>
      </button>
    </Link>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center rounded-xl bg-[#f8f8f9] px-4 py-3 dark:bg-[#111111]">
      <p className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">{label}</p>
      <p className="mt-1 text-[18px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{value}</p>
    </div>
  )
}

function ScoreRing({ score, scoreData }: { score: number, scoreData: Array<{ metric: string, score: number }> }) {
  return (
    <div className="relative flex h-56 w-full shrink-0 items-center justify-center overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="85%" data={scoreData}>
          <defs>
            <linearGradient id="scoreGradientHome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <PolarGrid stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="url(#scoreGradientHome)"
            isAnimationActive={true}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-[52px] font-black stroke-[#fcfcfc] dark:stroke-[#0a0a0a] fill-transparent pointer-events-none" strokeWidth="6" strokeLinejoin="round">
            {score}
          </text>
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-[52px] font-black fill-[#2b3b5a] dark:fill-white pointer-events-none">
            {score}
          </text>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function HomeApp() {
  const { isBrand } = useAccount()
  return isBrand ? <BrandHomeApp /> : <CreatorHomeApp />
}

function CreatorHomeApp() {
  const { profile } = useProfile()
  const router = useRouter()
  const finance = useMemo(() => getFinanceData(), [])
  const analytics = useMemo(() => getGlobalAnalyticsData("7d" as AnalyticsTimeframe), [])

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }, [])

  const firstName = profile?.name ? profile.name.split(" ")[0] : "User"
  const urgentEvents = useMemo(() => getUpcomingEvents(12).filter((event) => event.priority === "high" || event.type === "deadline"), [])
  const todayEvents = useMemo(() => getUpcomingEvents(12).filter((event) => event.type !== "personal").slice(0, 3), [])
  const exclusiveInvite = useMemo(() => CAMPAIGNS.find((campaign) => campaign.invited && campaign.exclusive) ?? CAMPAIGNS.find((campaign) => campaign.invited), [])
  const spotlightCampaign = exclusiveInvite ?? CAMPAIGNS[0]
  const recommendations = useMemo(() => CAMPAIGNS.filter((campaign) => campaign.match && campaign.status !== "Filled").sort((a, b) => (b.match ?? 0) - (a.match ?? 0)).slice(0, 5), [])
  const nextDeal = useMemo(() => PIPELINE_DEALS.find((deal) => deal.stage !== "completed") ?? PIPELINE_DEALS[0], [])
  const nextCampaign = CAMPAIGNS.find((campaign) => campaign.id === nextDeal?.campaignId) ?? CAMPAIGNS[0]

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const paymentMethods = [
    { id: 1, bank: "HDFC", type: "Debit", last4: "2345", domain: "hdfcbank.com", iconUrl: "https://www.google.com/s2/favicons?domain=hdfcbank.com&sz=128" },
    { id: 2, bank: "ICICI", type: "Account", last4: "9876", domain: "icicibank.com", iconUrl: "https://www.google.com/s2/favicons?domain=icicibank.com&sz=128" },
  ]
  const [selectedMethodId, setSelectedMethodId] = useState(1)
  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId) || paymentMethods[0]
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const pipelineStages = [
    { id: "bid", title: "Bid sent", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-[#eef2f9] dark:bg-[#1a202c]", deals: PIPELINE_DEALS.filter(d => d.stage === "bid") },
    { id: "negotiation", title: "Negotiation", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-500", bg: "bg-[#f8f2e7] dark:bg-[#2c271e]", deals: PIPELINE_DEALS.filter(d => d.stage === "negotiation") },
    { id: "content", title: "Content due", dot: "bg-red-500", text: "text-red-600 dark:text-red-500", bg: "bg-[#f9eced] dark:bg-[#2c1e20]", deals: PIPELINE_DEALS.filter(d => d.stage === "content") },
    { id: "approval", title: "Approval", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-500", bg: "bg-[#ecf7f1] dark:bg-[#1e2c24]", deals: PIPELINE_DEALS.filter(d => d.stage === "approval") },
  ]

  const scoreData = [
    { label: "Reach", value: analytics.overview[0].value, trend: analytics.overview[0].trend },
    { label: "Engagement", value: analytics.overview[3].value, trend: analytics.overview[3].trend },
    { label: "Followers", value: analytics.overview[1].value, trend: analytics.overview[1].trend },
  ]

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-[#0a0a0a]">
      <div className="flex w-full flex-col px-6 pb-12 pt-8">
        <header className="mb-7">
          <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white text-3xl">
            {greeting}, {firstName}
          </Typography>
          <p className="mt-2 text-[14px] font-medium text-[#737373] dark:text-[#a1a1aa]">
            {formatCurrency(finance.overview.availableWallet, finance.overview.currency)} ready to withdraw · {urgentEvents.length} urgent items need attention today
          </p>
        </header>

        <StoriesBar />

        <div className="mb-7 grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* MAIN SECTION (3 Cols on Left) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Top Campaign Card */}
            <section 
              className="relative overflow-hidden rounded-2xl p-6 text-black dark:text-white bg-cover bg-center border border-gray-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:shadow-none bg-[url('/topo-light.jpg')] dark:bg-[url('/topo-dark.jpg')]"
            >
              <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative z-10 min-w-0 pr-20 md:pr-0">
                  <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.14em] text-black/70 dark:text-white/70 [text-shadow:0px_0px_8px_rgba(255,255,255,1)] dark:[text-shadow:0px_0px_8px_rgba(0,0,0,1)]">Exclusive invitation</p>
                  <h2 className="mt-2 text-[20px] md:text-[25px] font-bold leading-tight tracking-tight [text-shadow:0px_0px_12px_rgba(255,255,255,1)] dark:[text-shadow:0px_0px_12px_rgba(0,0,0,1)]">{spotlightCampaign.brand} wants you for {spotlightCampaign.title}</h2>
                  <p className="mt-0.5 max-w-3xl text-[12px] md:text-[14px] leading-relaxed text-black/80 dark:text-white/80 [text-shadow:0px_0px_8px_rgba(255,255,255,1)] dark:[text-shadow:0px_0px_8px_rgba(0,0,0,1)]">{spotlightCampaign.description}</p>
                </div>
                <div className="absolute -right-8 -top-6 pointer-events-none md:right-12 md:-top-16">
                  <img src="/spotlight-image.png" alt="Spotlight item" className="h-64 md:h-72 w-auto object-contain drop-shadow-2xl" />
                </div>
              </div>
            </section>

            {/* 3 Smaller Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Wallet */}
              <div 
                onClick={() => router.push('/earnings')}
                className={cn(cardClass, "flex flex-col p-6 cursor-pointer hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10 transition-all hover:-translate-y-1")}
              >
                <CardHeader icon={Wallet} title="Wallet" />
                <p className="text-[32px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white mt-1">{formatCurrency(finance.overview.availableWallet, finance.overview.currency)}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[13px] font-medium">
                  <span className="text-emerald-500">↑ 12.5%</span>
                  <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">last month</span>
                </div>
                <div className="mt-8 mb-auto flex flex-col gap-5 pt-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] font-medium">Held in escrow</span>
                    <span className="text-[24px] tracking-tight text-[#0a0a0a] dark:text-white font-bold">{formatCurrency(finance.overview.inEscrow, finance.overview.currency)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa] font-medium">All-time total</span>
                    <span className="text-[24px] tracking-tight text-[#0a0a0a] dark:text-white font-bold">{formatCurrency(finance.overview.totalEarned, finance.overview.currency)}</span>
                  </div>
                </div>

                <div className="mt-auto flex flex-col pt-4 -mx-2 -mb-2 relative">
                  <div className="flex items-center justify-between px-2 mb-3">
                    <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">Available to withdraw</span>
                    <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">{formatCurrency(finance.overview.availableWallet * 0.8, finance.overview.currency)}</span>
                  </div>
                  <div ref={dropdownRef} className="flex flex-col relative w-full">
                    {/* Payment Method Chip */}
                    <div className="flex items-center justify-between px-4 pt-3.5 pb-6 rounded-t-[16px] border border-[#e4e4e7] dark:border-[#27272a] border-b-0 bg-[#fafafa] dark:bg-[#111111]/80 w-full -mb-4 relative z-0">
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedMethod.iconUrl} alt={selectedMethod.bank} className="size-5 object-contain" />
                        <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{selectedMethod.bank} {selectedMethod.type}</span>
                        <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa] ml-1">•••• {selectedMethod.last4}</span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsDropdownOpen(!isDropdownOpen)
                        }}
                        className="text-[12px] font-semibold text-red-500 hover:text-red-600 transition-colors relative z-20"
                      >
                        Change account
                      </button>
                    </div>

                    {/* Withdraw Button */}
                    <button 
                      onClick={() => toast.success("Withdrawal initiated", { description: "Funds will arrive in 1-3 business days." })}
                      className="w-full bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-semibold text-[14px] h-[48px] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center shrink-0 z-10 relative shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-none"
                    >
                      Withdraw Funds
                    </button>
                    
                    {/* Full-width Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute top-0 left-0 w-full bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-[100] flex flex-col py-1.5">
                        {paymentMethods.map(method => (
                          <button 
                            key={method.id}
                            onClick={() => { 
                              setSelectedMethodId(method.id); 
                              setIsDropdownOpen(false); 
                              toast.success("Payment method changed", { description: `You are now using ${method.bank} •••• ${method.last4}` });
                            }}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 mx-2 my-0.5 rounded-lg text-left transition-colors",
                              selectedMethodId === method.id ? "bg-[#f4f4f5] dark:bg-[#27272a]" : "hover:bg-gray-50 dark:hover:bg-white/5"
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={method.iconUrl} alt={method.bank} className="size-5 object-contain shrink-0" />
                            <span className={cn("text-[14px] font-medium", selectedMethodId === method.id ? "text-[#0a0a0a] dark:text-white" : "text-[#737373] dark:text-[#a1a1aa]")}>
                              {method.bank} {method.type}
                            </span>
                            <span className="text-[14px] font-medium text-[#737373] dark:text-[#a1a1aa] ml-auto">
                              •••• {method.last4}
                            </span>
                            {selectedMethodId === method.id && (
                              <Check className="size-4 text-[#0a0a0a] dark:text-white shrink-0 ml-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={cn(cardClass, "flex flex-col p-5")}>
                <CardHeader icon={Inbox} title="Pipeline Status" />
                <div className="flex flex-1 flex-col gap-3 mt-1">
                  {pipelineStages.map((stage) => {
                    const count = stage.deals.length;
                    
                    const uniqueCampaigns = Array.from(
                      new Map(
                        stage.deals
                          .map(d => CAMPAIGNS.find(c => c.id === d.campaignId))
                          .filter(c => c !== undefined)
                          .map(c => [c.brand, c])
                      ).values()
                    );

                    return (
                      <Link href="/campaigns?tab=pipeline" key={stage.id} className={cn("flex flex-1 flex-col justify-start items-start gap-2 rounded-xl px-4 pt-3 pb-2 transition-transform hover:-translate-y-0.5", stage.bg)}>
                        <div className="flex items-center gap-2.5">
                          <span className={cn("w-2 h-2 rounded-full", stage.dot)} />
                          <span className={cn("text-[13.5px] font-bold", stage.text)}>
                            {stage.title}
                            <span className="opacity-60 ml-1.5">{count}</span>
                          </span>
                        </div>
                        {count > 0 && (
                          <div className="flex -space-x-1.5">
                            {uniqueCampaigns.slice(0, 3).map((campaign, i) => (
                              <BrandLogo key={i} domain={campaign.domain} name={campaign.brand} className="w-6 h-6 rounded-md object-cover bg-white" />
                            ))}
                            {uniqueCampaigns.length > 3 && (
                              <div className={cn("flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-bold bg-black/5 dark:bg-white/10", stage.text)}>
                                +{uniqueCampaigns.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className={cn(cardClass, "flex flex-col p-6")}>
                <CardHeader icon={Target} title="Performance" />
                <div className="flex flex-col items-center gap-4">
                  <ScoreRing score={87} scoreData={analytics.performance.scoreData} />
                  <div className="grid w-full grid-cols-1 gap-2 mt-2">
                    {scoreData.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-xl border border-[#e4e4e7] px-4 py-2.5 dark:border-[#27272a]">
                        <div>
                          <p className="text-[11px] font-medium text-[#737373] dark:text-[#a1a1aa]">{item.label}</p>
                          <p className="mt-0.5 text-[15px] font-bold leading-none text-[#0a0a0a] dark:text-white">{item.value}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                          <ArrowUp className="h-3 w-3" />
                          {item.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR SECTION (1 Col on Right) */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <div className={cn(cardClass, "flex flex-col h-full px-4 pb-4 pt-5")}>
              <CardHeader
                icon={CalendarDays}
                title="Today's Schedule"
              />
              <div className="flex flex-col gap-3">
                {todayEvents.map((event) => <TodayEventRow key={event.id} event={event} />)}
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Recommended for you</h2>
            </div>
            <Link href="/campaign" className="hidden items-center gap-1 text-[13px] font-bold text-[#737373] transition hover:text-[#0a0a0a] dark:text-[#a1a1aa] dark:hover:text-white sm:flex">
              Campaigns
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-2">
            {recommendations.slice(0, 4).map((campaign) => <RecommendedCampaignCard key={campaign.id} campaign={campaign} />)}
          </div>
        </section>
      </div>
    </div>
  )
}
