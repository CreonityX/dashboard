"use client"

import { type ComponentType } from "react"
import { Typography } from "@heroui/react"
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts"
import { ArrowUpRight, ChartColumn, Comment, Eye, Globe, Heart, Person } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"

export type AnalyticsMetric = { id: string; label: string; value: number; suffix?: string; change: number; series: Array<{ name: string; value: number }> }
type IconType = ComponentType<{ className?: string }>

const metricIcons: Record<string, IconType> = { reach: Globe, followers: Person, subscribers: Person, impressions: Eye, engagement: ChartColumn, likes: Heart, comments: Comment, shares: ArrowUpRight, clicks: ArrowUpRight, conversions: ChartColumn, value: ArrowUpRight, profile_visits: Eye, saves: Heart, video_views: Eye, watch_time: ChartColumn, average_view_duration: ChartColumn }

export const analyticsCardClass = "rounded-2xl border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]"

export function formatAnalyticsMetric(value: number, suffix = "") {
  if (suffix === "%") return `${value.toFixed(1)}%`
  if (suffix === "x") return `${value.toFixed(1)}x`
  if (suffix === "₹") return `₹${value >= 1000 ? `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K` : value.toLocaleString("en-IN")}`
  if (suffix === "h") return `${value.toLocaleString("en-IN")}h`
  if (suffix === "m") return `${value.toFixed(1)}m`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K${suffix}`
  return `${value.toLocaleString("en-IN")}${suffix}`
}

export function AnalyticsBigMetricCard({ metric, accent }: { metric: AnalyticsMetric; accent: string }) {
  const Icon = metricIcons[metric.id] ?? ChartColumn
  const gradientId = `metric-${metric.id}-${accent.replace("#", "")}`
  return <div className={cn(analyticsCardClass, "relative h-[170px] overflow-hidden p-5 lg:p-6")}>
    <div className="relative z-10"><div className="mb-3 flex items-center gap-2"><Icon className="h-5 w-5 text-gray-400" /><Typography type="body-sm" className="font-semibold text-gray-500 dark:text-gray-400">{metric.label}</Typography></div><p className="text-[28px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{formatAnalyticsMetric(metric.value, metric.suffix)}</p><p className="mt-3 text-[12px]"><span className="font-semibold text-emerald-500">↑ {metric.change}%</span><span className="ml-1.5 text-gray-400">vs previous period</span></p></div>
    <div className="pointer-events-none absolute bottom-0 right-0 top-[36%] w-[58%] opacity-80" style={{ maskImage: "linear-gradient(to right, transparent, black 30%)" }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={metric.series} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.3} /><stop offset="95%" stopColor={accent} stopOpacity={0} /></linearGradient></defs><YAxis hide domain={["dataMin", "dataMax"]} /><Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>
  </div>
}

export function AnalyticsSmallMetricCard({ metric, accent }: { metric: AnalyticsMetric; accent: string }) {
  return <div className={cn(analyticsCardClass, "relative h-[92px] overflow-hidden px-4 py-3.5")}><p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{metric.label}</p><div className="mt-2 flex items-end justify-between gap-2"><p className="text-[19px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{formatAnalyticsMetric(metric.value, metric.suffix)}</p><span className="text-[11px] font-semibold text-emerald-500">↑ {metric.change}%</span></div><div className="pointer-events-none absolute bottom-0 right-0 h-8 w-[48%] opacity-50"><ResponsiveContainer width="100%" height="100%"><AreaChart data={metric.series}><Area type="monotone" dataKey="value" stroke={accent} fill="none" strokeWidth={1.5} dot={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div></div>
}
