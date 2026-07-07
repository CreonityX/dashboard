"use client"

import { useMemo, useState, type ComponentType } from "react"
import { Typography, Tooltip as HeroTooltip } from "@heroui/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const PillBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  if (!width || height === undefined) return null;
  
  const actualHeight = Math.max(height, width);
  const baseline = y + height;
  const actualY = baseline - actualHeight;

  return (
    <rect x={x} y={actualY} width={width} height={actualHeight} fill={fill} rx={width / 2} ry={width / 2} />
  );
};
import {
  ArrowUpRight,
  Bulb,
  ChartColumn,
  ChevronRight,
  Clock,
  Comment,
  Eye,
  Globe,
  Heart,
  MapPin,
  Person,
} from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import {
  getPlatformAnalyticsData,
  type AnalyticsTimeframe,
  type PlatformAnalyticsId,
  type PlatformMetric,
} from "./platform-analytics-data"

type IconType = ComponentType<{ className?: string }>

const cardClass = "rounded-2xl border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]"
const genderColors = ["#0ea5e9", "#38bdf8", "#bae6fd"]

const metricIcons: Record<string, IconType> = {
  reach: Globe,
  followers: Person,
  impressions: Eye,
  engagement: ChartColumn,
  likes: Heart,
  comments: Comment,
  shares: ArrowUpRight,
}

const formatValue = (value: number, suffix = "") => {
  if (suffix === "%") return `${value.toFixed(1)}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K${suffix}`
  return `${value.toLocaleString()}${suffix}`
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-[120px] rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#18181b]">
      {label && <p className="mb-1.5 text-[11px] font-medium text-gray-400">{label}</p>}
      {payload.map((item) => (
        <div key={item.name ?? "value"} className="flex items-center justify-between gap-4 text-[12px]">
          <span className="text-gray-500 dark:text-gray-400">{item.name ?? "Value"}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{Number(item.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

function GeographyTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const country = payload[0].payload
  if (!country.cities) return null
  return (
    <div className="min-w-[140px] rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#18181b]">
      <p className="mb-2 text-[12px] font-semibold text-gray-900 dark:text-white">{country.name}</p>
      <div className="flex flex-col gap-2">
        {country.cities.map((city: any, i: number) => (
           <div key={city.name} className="flex items-center justify-between gap-4 text-[11px]">
             <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[i]?.color ?? payload[i]?.fill ?? "#fff", opacity: payload[i]?.payload?.fillOpacity ?? [1, 0.6, 0.2][i] }} />
                <span className="text-gray-500 dark:text-gray-400">{city.name}</span>
             </div>
             <span className="font-semibold text-gray-900 dark:text-white">{city.value}%</span>
           </div>
        ))}
      </div>
    </div>
  )
}

function BigMetricCard({ metric, accent }: { metric: PlatformMetric; accent: string }) {
  const Icon = metricIcons[metric.id] ?? ChartColumn
  return (
    <div className={cn(cardClass, "relative h-[170px] overflow-hidden p-5 lg:p-6")}>
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <Icon className="h-5 w-5 text-gray-400" />
          <Typography type="body-sm" className="font-semibold text-gray-500 dark:text-gray-400">{metric.label}</Typography>
        </div>
        <p className="text-[28px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{formatValue(metric.value, metric.suffix)}</p>
        <p className="mt-3 text-[12px]"><span className="font-semibold text-emerald-500">↑ {metric.change}%</span><span className="ml-1.5 text-gray-400">vs previous period</span></p>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 top-[36%] w-[58%] opacity-80" style={{ maskImage: "linear-gradient(to right, transparent, black 30%)" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metric.series} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs><linearGradient id={`metric-${metric.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={accent} stopOpacity={0.3} /><stop offset="95%" stopColor={accent} stopOpacity={0} /></linearGradient></defs>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Area type="monotone" dataKey="value" stroke={accent} strokeWidth={2} fill={`url(#metric-${metric.id})`} dot={false} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function SmallMetricCard({ metric, accent }: { metric: PlatformMetric; accent: string }) {
  return (
    <div className={cn(cardClass, "relative h-[92px] overflow-hidden px-4 py-3.5")}>
      <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <p className="text-[19px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{formatValue(metric.value, metric.suffix)}</p>
        <span className="text-[11px] font-semibold text-emerald-500">↑ {metric.change}%</span>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-[48%] opacity-50">
        <ResponsiveContainer width="100%" height="100%"><AreaChart data={metric.series}><Area type="monotone" dataKey="value" stroke={accent} fill="none" strokeWidth={1.5} dot={false} isAnimationActive={false} /></AreaChart></ResponsiveContainer>
      </div>
    </div>
  )
}

function SectionHeading({ icon: Icon, children }: { icon: IconType; children: string }) {
  return <div className="mb-4 flex items-center gap-2"><Icon className="h-5 w-5 text-gray-400" /><Typography type="body-sm" className="font-semibold text-gray-500 dark:text-gray-400">{children}</Typography></div>
}

export function PlatformAnalyticsDashboard({ platform, timeframe }: { platform: PlatformAnalyticsId; timeframe: AnalyticsTimeframe }) {
  const [geographyMode, setGeographyMode] = useState<"countries" | "cities">("countries")
  const data = useMemo(() => getPlatformAnalyticsData(platform, timeframe), [platform, timeframe])
  const geography = data.audience[geographyMode]
  const topGeographyValue = Math.max(...geography.map((item) => item.value), 1)
  const topContentChart = data.topContent.map((item) => ({ ...item, label: `${item.title} · ${item.type}` }))

  return (
    <div className="w-full animate-in pb-14 fade-in slide-in-from-bottom-2 duration-300">
      <section className="grid grid-cols-1 gap-4 px-6 sm:grid-cols-3 lg:gap-5">
        {data.overview.map((metric) => <BigMetricCard key={metric.id} metric={metric} accent={data.accent} />)}
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3 px-6 sm:grid-cols-4 lg:mt-5 lg:gap-5">
        {data.engagement.map((metric) => <SmallMetricCard key={metric.id} metric={metric} accent={data.accent} />)}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cn(cardClass, "flex min-h-[340px] flex-col p-6 sm:col-span-2")}>
          <SectionHeading icon={Bulb}>Insights</SectionHeading>
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            {data.insights.map((insight, index) => (
              <div key={insight} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: data.accent }}>{index + 1}</span>
                <p className="text-[13px] font-medium leading-relaxed text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-white/5">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-gray-400">Action item</p>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-white">{data.actionItem}</p>
          </div>
        </div>

        <div className={cn(cardClass, "min-h-[340px] p-5")}>
          <SectionHeading icon={ChartColumn}>Content Type Performance</SectionHeading>
          <div className="h-[255px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.contentTypes} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e4e4e7" opacity={0.45} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#737373" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a1a1aa" }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(161,161,170,.08)" }} />
                <Bar dataKey="value" name="Performance" fill={data.accent} maxBarSize={32} shape={(props: any) => <PillBar {...props} />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn(cardClass, "min-h-[340px] p-5 flex flex-col")}>
          <div className="flex justify-between items-start">
            <SectionHeading icon={Eye}>Overview</SectionHeading>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: data.accent}}/><span className="text-[11px] text-gray-500 font-medium">Reach</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: data.accent, opacity: 0.6}}/><span className="text-[11px] text-gray-500 font-medium">Impressions</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: data.accent, opacity: 0.2}}/><span className="text-[11px] text-gray-500 font-medium">Engagement</span></div>
            </div>
          </div>
          <div className="flex-1 -mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.reachVsImpressions} margin={{ top: 0, right: 0, left: -24, bottom: 0 }} barGap={1} barCategoryGap="25%">
                <CartesianGrid vertical={false} stroke="#e4e4e7" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#737373" }} tickMargin={8} />
                <YAxis width={30} tickMargin={0} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#a1a1aa" }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(161,161,170,.08)" }} />
                <Bar dataKey="reach" name="Reach" fill={data.accent} radius={[10, 10, 0, 0]} maxBarSize={12} />
                <Bar dataKey="impressions" name="Impressions" fill={data.accent} fillOpacity={0.6} radius={[10, 10, 0, 0]} maxBarSize={12} />
                <Bar dataKey="engagement" name="Engagement" fill={data.accent} fillOpacity={0.2} radius={[10, 10, 0, 0]} maxBarSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-5 px-6">
        <div className={cn(cardClass, "p-5 lg:p-6 lg:col-span-2")}>
          <SectionHeading icon={ArrowUpRight}>Top Performing Content</SectionHeading>
          <div className="mt-6 flex flex-col relative">
            {/* Y-axis line */}
            <div className="absolute left-[48px] top-0 bottom-6 w-px bg-gray-100 dark:bg-white/10 z-0" />
            
            <div className="flex flex-col gap-4 relative z-10">
              {topContentChart.map((item) => {
                const maxReach = Math.max(...topContentChart.map(c => c.reach))
                const widthPct = Math.max((item.reach / maxReach) * 100, 2)
                const typeLower = item.type.toLowerCase()
                const isVertical = typeLower.includes('reel') || typeLower.includes('short') || typeLower.includes('tiktok')
                const isHorizontal = typeLower.includes('video') || typeLower.includes('vlog') || typeLower.includes('breakdown') || typeLower.includes('tutorial')
                const ratioClass = isVertical ? 'aspect-[9/16]' : isHorizontal ? 'aspect-video' : 'aspect-square'
                const bgGradient = `linear-gradient(135deg, ${data.accent}40, ${data.accent}10)`
                
                return (
                  <div key={item.title} className="flex items-center gap-5">
                    <div className="relative group/thumb z-30">
                      <button className="h-9 w-9 rounded-[8px] shrink-0 overflow-hidden border border-gray-200/80 dark:border-white/10 transition-transform hover:scale-105 outline-none" style={{ background: bgGradient }} />
                      
                      {/* Pure CSS Tooltip */}
                      <div className="absolute opacity-0 group-hover/thumb:opacity-100 transition-opacity left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none z-50">
                        <div className="p-0 rounded-xl overflow-hidden bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl">
                          <div className={cn("relative w-[150px] bg-black/5 dark:bg-white/5", ratioClass)}>
                            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
                              <p className="text-[12px] font-bold leading-tight mb-0.5 line-clamp-2">{item.title}</p>
                              <p className="text-[10px] font-medium opacity-80">{item.type} • {formatValue(item.reach)} reach</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 h-[24px] flex items-center relative group">
                      <div 
                        className="h-full rounded-md transition-all duration-1000 ease-out relative" 
                        style={{ width: `${widthPct}%`, backgroundColor: data.accent }}
                      />
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity left-full ml-3 whitespace-nowrap bg-white dark:bg-[#18181b] border border-gray-100 dark:border-white/10 shadow-lg rounded-[10px] px-3 py-1.5 z-20 text-[12px] pointer-events-none">
                        <span className="font-medium text-gray-500 dark:text-gray-400 mr-2">Reach</span>
                        <span className="font-bold text-gray-900 dark:text-white">{Number(item.reach).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* X-axis labels */}
            <div className="flex items-center pl-[68px] pt-4 mt-2 border-t border-gray-100 dark:border-white/5 relative">
               {/* 3 axis ticks */}
               <div className="flex-1 flex justify-between text-[10px] font-medium text-gray-400">
                  <span>0</span>
                  <span>{formatValue(Math.round(Math.max(...topContentChart.map(c => c.reach)) / 2))}</span>
                  <span>{formatValue(Math.max(...topContentChart.map(c => c.reach)))}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Gender and Age Stack */}
        <div className="flex flex-col gap-5 lg:col-span-1">
          <div className={cn(cardClass, "pt-3.5 pb-3 px-5 flex flex-col")}>
            <SectionHeading icon={Person}>Gender</SectionHeading>
            <div className="flex items-center gap-6 mt-0.5">
              <div className="relative h-[104px] w-[104px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.audience.gender} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={50} paddingAngle={3} stroke="none">{data.audience.gender.map((entry, index) => <Cell key={entry.name} fill={genderColors[index]} />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer></div>
              <div className="flex flex-col justify-center gap-2.5">{data.audience.gender.map((item, index) => <div key={item.name} className="flex items-center"><span className="h-2 w-2 rounded-full shrink-0 mr-2" style={{ backgroundColor: genderColors[index] }} /><span className="text-[12px] text-gray-600 dark:text-gray-300 font-medium w-14">{item.name}</span><span className="text-[12px] text-gray-400 font-medium">{item.value}%</span></div>)}</div>
            </div>
          </div>

          <div className={cn(cardClass, "flex-1 p-5 flex flex-col")}>
            <SectionHeading icon={ChartColumn}>Age</SectionHeading>
            <div className="flex-1 mt-2 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.audience.age} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}><CartesianGrid vertical={false} stroke="#e4e4e7" opacity={0.4} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#737373" }} tickMargin={8} /><YAxis hide={true} /><Tooltip content={<ChartTooltip />} cursor={{fill: "transparent"}} /><Bar dataKey="value" name="Audience" fill={data.accent} maxBarSize={16} shape={(props: any) => <PillBar {...props} />} /></BarChart></ResponsiveContainer></div>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-1">
          <div className={cn(cardClass, "relative h-[120px] shrink-0 overflow-hidden p-5")}>
            <SectionHeading icon={Clock}>Best Time</SectionHeading>
            <div className="relative z-10 flex items-end gap-2"><span className="text-[24px] font-bold leading-none">{data.bestTime.time}</span><span className="text-[12px] font-semibold" style={{ color: data.accent }}>{data.bestTime.day}</span></div>
            <p className="relative z-10 mt-1 text-[10px] text-gray-400">{data.bestTime.note}</p>
            <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-[55%] opacity-60" style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.bestTime.series}>
                  <defs>
                    <linearGradient id="best-time-fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={data.accent} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={data.accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area dataKey="value" type="monotone" stroke={data.accent} fill="url(#best-time-fade)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={cn(cardClass, "overflow-hidden flex-1 flex flex-col")}>
            <div className="flex w-full items-center gap-3 p-5 pb-0 text-left">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold text-gray-600 dark:text-gray-300">Geography</span><span className="mt-0.5 block truncate text-[11px] text-gray-400">Top location: {geography[0]?.name}</span></span>
            </div>
            <div className="flex-1 w-full px-5 py-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geography} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={16}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={28} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#737373" }} tickMargin={6} tickFormatter={(v) => ({ 'United States': 'US', 'United Kingdom': 'UK', 'India': 'IN', 'Canada': 'CA', 'Germany': 'DE', 'Australia': 'AU', 'Philippines': 'PH' }[v as string] || v)} />
                  <Tooltip content={<GeographyTooltip />} cursor={{fill: "rgba(161,161,170,.08)"}} />
                  <Bar dataKey="cities[0].value" stackId="a" fill={data.accent} radius={[4, 0, 0, 4]} />
                  <Bar dataKey="cities[1].value" stackId="a" fill={data.accent} fillOpacity={0.6} />
                  <Bar dataKey="cities[2].value" stackId="a" fill={data.accent} fillOpacity={0.2} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {data.youtube && (
        <section className="mt-5 grid grid-cols-1 gap-5 px-6 lg:grid-cols-4">
          <div className={cn(cardClass, "min-h-[240px] p-5 lg:col-span-3 flex flex-col")}>
            <SectionHeading icon={Eye}>Audience Retention</SectionHeading>
            <div className="flex-1 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.youtube.retention} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="elapsed" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#737373" }} tickMargin={10} minTickGap={30} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(161,161,170,.2)", strokeWidth: 1, strokeDasharray: "3 3" }} />
                  <Line dataKey="retention" name="Retention" type="monotone" stroke={data.accent} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-1">
            <div className={cn(cardClass, "relative flex-1 overflow-hidden p-5 flex items-center justify-between")}>
              <div className="relative z-10 flex flex-col justify-center">
                <span className="text-[12px] font-medium text-gray-500 leading-tight">Average View<br/>Duration</span>
                <span className="mt-1 text-[22px] font-bold tracking-tight text-gray-900 dark:text-white">{data.youtube.averageViewDuration}</span>
              </div>
              <div className="absolute right-0 inset-y-0 w-[60%] opacity-80" style={{ maskImage: "linear-gradient(to right, transparent, black 30%)" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.youtube.retention}>
                    <YAxis hide domain={["dataMin", "dataMax"]} />
                    <Line type="monotone" dataKey="retention" stroke={data.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={cn(cardClass, "relative flex-1 overflow-hidden p-5 flex items-center justify-between")}>
              <div className="relative z-10 flex flex-col justify-center">
                <span className="text-[12px] font-medium text-gray-500 leading-tight">Watch<br/>Time</span>
                <span className="mt-1 text-[22px] font-bold tracking-tight text-gray-900 dark:text-white">{formatValue(data.youtube.watchTimeHours)}h</span>
              </div>
              <div className="absolute right-0 inset-y-0 w-[60%] opacity-80" style={{ maskImage: "linear-gradient(to right, transparent, black 30%)" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.bestTime.series}>
                    <YAxis hide domain={["dataMin", "dataMax"]} />
                    <Line type="monotone" dataKey="value" stroke={data.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
