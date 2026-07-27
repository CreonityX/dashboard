"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUp, CalendarDays, CheckCircle2, CircleDollarSign, ClipboardCheck, Eye, Inbox, Layers3, MessageSquare, Target, UsersRound, Wallet } from "lucide-react"
import { Typography } from "@heroui/react"
import { useAccount } from "@/context/account-context"
import { EVENT_TYPE_CONFIG, formatTime, type CalendarEvent } from "@/lib/calendar-data"
import { formatAnalyticsNumber, type BrandAnalyticsCampaign, type BrandAnalyticsCreator } from "@/lib/brand-analytics-data"
import { cn } from "@/lib/utils"

const cardClass = "rounded-2xl border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a]"
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`
const engagementRate = (engagements: number, impressions: number) => impressions ? `${((engagements / impressions) * 100).toFixed(1)}%` : "—"

function Header({ icon: Icon, title, action }: { icon: typeof Wallet; title: string; action?: React.ReactNode }) {
  return <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Icon className="size-5 text-[#a1a1aa] dark:text-[#737373]" /><Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">{title}</Typography></div>{action}</div>
}

function ScheduleRow({ event }: { event: CalendarEvent }) {
  const config = EVENT_TYPE_CONFIG[event.type]
  const time = event.allDay ? "All day" : `${formatTime(event.startTime ?? "09:00")} · ${formatTime(event.endTime ?? "10:00")}`
  return <Link href={`/calendar?eventId=${event.id}`} className="block rounded-xl border-l-4 px-3 py-2.5 transition hover:brightness-95 dark:hover:brightness-110" style={{ background: `${config.color}15`, borderLeftColor: config.color }}><p className="truncate text-[12px] font-semibold text-[#0a0a0a] dark:text-white">{event.title}</p><p className="mt-1 truncate text-[11px] font-medium text-[#737373] dark:text-[#a1a1aa]">{event.creator || event.campaign || config.label} · {time}</p></Link>
}

export function BrandHomeApp() {
  const { account, brand, brandAnalytics, brandCalendarEvents, brandTasks, brandConversations, brandFinance } = useAccount()
  const member = brand?.team.find(item => item.email === account?.email) ?? brand?.team.find(item => item.role === "Owner")
  const greeting = useMemo(() => new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening", [])
  const liveCampaigns = brandAnalytics.campaigns.filter(campaign => campaign.status === "Live")
  const spotlight = liveCampaigns[0] ?? brandAnalytics.campaigns[0]
  const spotlightBudget = brandFinance.campaignBudgets.find(item => item.id === spotlight?.id)
  const spotlightProgress = spotlight?.deliverables.total ? Math.round(spotlight.deliverables.completed / spotlight.deliverables.total * 100) : 0
  const scheduled = [...brandCalendarEvents, ...brandTasks].filter(event => !event.completed).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)
  const pendingPayments = brandFinance.creatorPayments.filter(payment => payment.status === "pending")
  const reviews = brandConversations.flatMap(conversation => [...conversation.messages, ...(conversation.channels?.flatMap(channel => channel.messages ?? []) ?? [])]).filter(message => message.kind === "review" && message.status === "pending")
  const requestedChanges = brandCalendarEvents.filter(event => event.workflowStatus === "changes_requested").length
  const totalBudget = brandFinance.campaignBudgets.reduce((sum, campaign) => sum + campaign.totalBudget, 0)
  const committed = brandFinance.campaignBudgets.reduce((sum, campaign) => sum + campaign.committed, 0)
  const totalReach = brandAnalytics.campaigns.reduce((sum, campaign) => sum + campaign.reach, 0)
  const actionItems = [
    ...reviews.slice(0, 2).map(review => ({ id: review.id, title: `Review ${review.title}`, detail: `${review.creator} · ${review.campaign}`, href: "/messages", tone: "bg-sky-500", label: "Review" })),
    ...pendingPayments.slice(0, 1).map(payment => ({ id: payment.id, title: `Release payment to ${payment.creatorName}`, detail: `${payment.milestone} · ${money(payment.amount)}`, href: "/earnings", tone: "bg-emerald-500", label: "Payment" })),
    ...brandTasks.filter(task => !task.completed).slice(0, 1).map(task => ({ id: task.id, title: task.title, detail: task.assignee ?? "Team task", href: "/calendar", tone: "bg-amber-500", label: "Task" })),
  ].slice(0, 4)
  const creators = brandAnalytics.creators.slice().sort((a, b) => b.attributedValue - a.attributedValue).slice(0, 3)

  return <div className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-[#0a0a0a]"><div className="w-full px-6 pb-12 pt-8">
    <header className="mb-7"><Typography type="h2" className="text-3xl font-bold tracking-tight text-[#0a0a0a] dark:text-white">{greeting}, {member?.name.split(" ")[0] ?? "there"}</Typography><p className="mt-2 text-[14px] font-medium text-[#737373] dark:text-[#a1a1aa]">{brand?.name} workspace · {member?.role ?? "Team member"} · {reviews.length} approvals need attention</p></header>

    <div className="mb-7 grid grid-cols-1 gap-5 lg:grid-cols-4">
      <div className="flex flex-col gap-5 lg:col-span-3">
        <section className="relative overflow-hidden rounded-2xl border border-gray-200/70 bg-[url('/topo-light.jpg')] bg-cover bg-center p-6 text-[#0a0a0a] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[url('/topo-dark.jpg')] dark:text-white">
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#0060ff]">Live campaign</p><h2 className="mt-2 text-[24px] font-bold tracking-tight">{spotlight?.name ?? "No campaign selected"}</h2><p className="mt-1 text-[13px] text-[#52525b] dark:text-[#d4d4d8]">{spotlight?.creatorIds.length ?? 0} creators assigned · {spotlight?.deliverables.completed ?? 0}/{spotlight?.deliverables.total ?? 0} deliverables complete · {money(spotlightBudget?.committed ?? 0)} committed</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/15"><div className="h-full rounded-full bg-[#0060ff]" style={{ width: `${spotlightProgress}%` }} /></div><p className="mt-2 text-[11px] font-semibold text-[#52525b] dark:text-[#d4d4d8]">{spotlightProgress}% delivery complete · next review due this week</p></div><div className="flex flex-wrap gap-2"><Link href="/messages" className="rounded-xl bg-[#0a0a0a] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-[#0a0a0a]">Review submissions</Link><Link href="/campaign" className="rounded-xl border border-[#d4d4d8] bg-white/75 px-4 py-2.5 text-[13px] font-semibold text-[#0a0a0a] transition hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white">View campaign</Link></div></div>
        </section>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Link href="/campaign" className={cn(cardClass, "group p-5 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10")}><Header icon={Layers3} title="Campaign health" /><p className="text-[31px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{liveCampaigns.length}</p><p className="mt-2 text-[12px] font-medium text-emerald-500">{spotlightProgress}% on-track delivery</p><div className="mt-6 grid grid-cols-2 gap-2"><Mini label="Live now" value={`${liveCampaigns.length}`} /><Mini label="Reach" value={formatAnalyticsNumber(totalReach)} /></div></Link>
          <Link href="/earnings" className={cn(cardClass, "group p-5 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10")}><Header icon={Wallet} title="Finance" /><p className="text-[31px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{money(brandFinance.walletBalance)}</p><p className="mt-2 text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">Available workspace balance</p><div className="mt-6 grid grid-cols-2 gap-2"><Mini label="Committed" value={money(committed)} /><Mini label="Due" value={money(pendingPayments.reduce((sum, payment) => sum + payment.amount, 0))} /></div></Link>
          <Link href="/messages" className={cn(cardClass, "group p-5 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10")}><Header icon={ClipboardCheck} title="Approvals" /><p className="text-[31px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{reviews.length}</p><p className="mt-2 text-[12px] font-medium text-sky-500">Creator submissions awaiting review</p><div className="mt-6 grid grid-cols-2 gap-2"><Mini label="Changes" value={`${requestedChanges}`} /><Mini label="Payments" value={`${pendingPayments.length}`} /></div></Link>
        </div>
      </div>

      <aside className={cn(cardClass, "flex flex-col px-4 pb-4 pt-5")}><Header icon={CalendarDays} title="Today’s schedule" action={<Link href="/calendar" className="text-[11px] font-semibold text-[#0060ff]">Calendar</Link>} /><div className="flex flex-1 flex-col gap-3">{scheduled.length ? scheduled.map(event => <ScheduleRow key={event.id} event={event} />) : <p className="text-[13px] text-[#737373]">Nothing scheduled.</p>}</div></aside>
    </div>

    <section className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-5"><div className={cn(cardClass, "p-5 xl:col-span-3")}><Header icon={CheckCircle2} title="Action queue" action={<Link href="/messages" className="flex items-center gap-1 text-[12px] font-semibold text-[#0060ff]">Open inbox <ArrowRight className="size-3.5" /></Link>} /><div className="divide-y divide-[#eeeeee] dark:divide-[#27272a]">{actionItems.map(item => <Link href={item.href} key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className={cn("size-2 rounded-full", item.tone)} /><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{item.title}</p><p className="mt-0.5 truncate text-[11px] text-[#737373] dark:text-[#a1a1aa]">{item.detail}</p></div><span className="hidden rounded-full bg-[#f4f4f5] px-2 py-1 text-[10px] font-bold text-[#737373] dark:bg-white/10 sm:inline">{item.label}</span><ArrowRight className="size-4 text-[#a1a1aa]" /></Link>)}</div></div><div className={cn(cardClass, "p-5 xl:col-span-2")}><Header icon={UsersRound} title="Creator performance" action={<Link href="/analytics" className="text-[12px] font-semibold text-[#0060ff]">Analytics</Link>} /><div className="space-y-3">{creators.map((creator: BrandAnalyticsCreator) => <div key={creator.id} className="flex items-center gap-3"><Image src={creator.avatarUrl} width={34} height={34} alt="" className="size-[34px] rounded-full" /><div className="min-w-0 flex-1"><p className="truncate text-[12px] font-semibold text-[#0a0a0a] dark:text-white">{creator.name}</p><p className="text-[10px] text-[#737373]">{formatAnalyticsNumber(creator.reach)} reach · {engagementRate(creator.engagements, creator.impressions)} ER</p></div><p className="text-[12px] font-bold text-[#0a0a0a] dark:text-white">{money(creator.attributedValue)}</p></div>)}</div></div></section>

    <section><div className="mb-4 flex items-end justify-between"><div><Typography type="h3" className="text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Active campaigns</Typography><p className="mt-1 text-[13px] text-[#737373] dark:text-[#a1a1aa]">Delivery, investment, and creator contribution at a glance.</p></div><Link href="/campaign" className="hidden items-center gap-1 text-[13px] font-bold text-[#737373] transition hover:text-[#0a0a0a] dark:text-[#a1a1aa] sm:flex">Campaigns <ArrowRight className="size-4" /></Link></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{brandAnalytics.campaigns.map((campaign: BrandAnalyticsCampaign) => { const budget = brandFinance.campaignBudgets.find(item => item.id === campaign.id); const complete = campaign.deliverables.total ? Math.round(campaign.deliverables.completed / campaign.deliverables.total * 100) : 0; return <Link href="/campaign" key={campaign.id} className={cn(cardClass, "p-5 transition hover:-translate-y-0.5 hover:ring-2 hover:ring-black/5 dark:hover:ring-white/10")}><div className="flex items-start justify-between gap-3"><div><p className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">{campaign.name}</p><p className="mt-1 text-[11px] text-[#737373]">{campaign.dates} · {campaign.creatorIds.length} creators</p></div><span className={cn("rounded-full px-2 py-1 text-[10px] font-bold", campaign.status === "Live" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" : campaign.status === "Planning" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300" : "bg-[#f4f4f5] text-[#737373]")}>{campaign.status}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-[#f4f4f5] dark:bg-[#27272a]"><div className="h-full rounded-full bg-[#0060ff]" style={{ width: `${complete}%` }} /></div><div className="mt-3 grid grid-cols-3 gap-2"><Mini label="Delivery" value={`${complete}%`} /><Mini label="Reach" value={formatAnalyticsNumber(campaign.reach)} /><Mini label="Spend" value={money(budget?.committed ?? 0)} /></div></Link> })}</div></section>
  </div></div>
}

function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-[#f8f8f9] px-3 py-2.5 dark:bg-[#111111]"><p className="text-[10px] font-medium text-[#737373] dark:text-[#a1a1aa]">{label}</p><p className="mt-1 truncate text-[13px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{value}</p></div> }
