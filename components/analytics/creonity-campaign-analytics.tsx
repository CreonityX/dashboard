"use client"

import { useMemo, useState } from "react"
import { Typography } from "@heroui/react"
import { 
  PieChart, Pie, Cell, Tooltip,
  AreaChart, Area, ResponsiveContainer, YAxis
} from "recharts"
import { Briefcase, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react"
import { ChartColumn, Globe, ArrowUpRight, ArrowUp, ArrowDown } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"

import { getGlobalAnalyticsData, AnalyticsTimeframe } from "./platform-analytics-data"

// Monochromatic lime shades
const categoryColors = ['#84cc16', '#a3e635', '#bef264', '#d9f99d', '#ecfccb', '#f7fee7']

const getMetricBg = (label: string, valueStr: string) => {
  if (label === "On-time delivery") {
    const val = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
    if (val >= 100) return "bg-gradient-to-b from-[#84cc16]/25 to-transparent border-[#84cc16]/30";
    if (val >= 90) return "bg-gradient-to-b from-[#a3e635]/25 to-transparent border-[#a3e635]/30";
    if (val >= 75) return "bg-gradient-to-b from-[#eab308]/25 to-transparent border-[#eab308]/30";
    if (val >= 50) return "bg-gradient-to-b from-[#ef4444]/25 to-transparent border-[#ef4444]/30";
    return "bg-gradient-to-b from-black/10 dark:from-white/10 to-transparent border-black/10 dark:border-white/10";
  }
  return "bg-white border-[#e4e4e7] dark:bg-[#0a0a0a] dark:border-[#27272a]";
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-3 rounded-xl shadow-lg flex flex-col gap-1.5 min-w-[120px] z-[100] relative">
        <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">{data.name}</span>
        <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white leading-none">{data.value}%</span>
      </div>
    );
  }
  return null;
}

export function CreonityCampaignAnalytics({ timeframe = "7d" }: { timeframe?: AnalyticsTimeframe }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null)
  const { campaigns } = useMemo(() => getGlobalAnalyticsData(timeframe), [timeframe])
  const { metrics, performanceData, categoryData, earningsData } = campaigns
  
  const totalEarnings = useMemo(() => earningsData.reduce((acc, curr) => acc + curr.amount, 0), [earningsData])

  return (
    <div className="w-full flex flex-col">
      {/* Section Header */}
      <div className="flex items-center mb-5 px-1">
        <span className="font-bold text-[#0a0a0a] dark:text-white text-[20px] tracking-tight">
          Campaign Analytics
        </span>
      </div>

      {/* Charts & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 w-full">
        
        {/* Card 1: Campaign ER */}
        <div className="flex flex-col rounded-2xl p-6 relative overflow-hidden h-[160px] border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a]">
          <div className="flex flex-col z-10 w-full relative">
            <div className="flex items-center gap-2 mb-2">
              <ChartColumn className="text-[#a1a1aa] dark:text-[#737373] size-5" />
              <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Campaign ER</Typography>
            </div>
            <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">6.2%</Typography>
            <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
              <span className="text-[#84cc16]">↑ 1.4%</span>
              <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">vs organic</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0 transition-opacity duration-300" style={{ maskImage: "linear-gradient(to right, transparent, black 35%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 35%, black 90%, transparent)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip 
                  cursor={false}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-2 rounded-xl shadow-lg z-[100] relative min-w-[80px]">
                          <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] block mb-1">{payload[0].payload.month}</span>
                          <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white leading-none block">{payload[0].value}%</span>
                        </div>
                      )
                    }
                    return null;
                  }}
                />
                <defs>
                  <linearGradient id="color-campaign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="campaign" stroke="#84cc16" strokeWidth={2} fillOpacity={1} fill="url(#color-campaign)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Brand Categories */}
        <div className="flex flex-col rounded-2xl p-6 relative overflow-hidden h-[160px] border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a]">
          <div className="flex flex-col z-10 w-full relative">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="text-[#a1a1aa] dark:text-[#737373] size-5" />
              <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Categories</Typography>
            </div>
            <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{categoryData.length}</Typography>
            <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
              <span className="text-[#84cc16]">Fashion (35%)</span>
              <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">leading</span>
            </div>
          </div>
          <div 
            className="absolute -right-8 -bottom-8 w-[160px] h-[160px] z-20 mix-blend-multiply dark:mix-blend-screen transition-all duration-300"
            style={{ 
              filter: activeCategoryIndex !== null ? 'none' : 'grayscale(100%)', 
              opacity: activeCategoryIndex !== null ? 1 : 0.4 
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" cy="50%" 
                  innerRadius={35} 
                  outerRadius={60} 
                  paddingAngle={2} 
                  dataKey="value" 
                  stroke="none"
                  onMouseEnter={(_, index) => setActiveCategoryIndex(index)}
                  onMouseLeave={() => setActiveCategoryIndex(null)}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={categoryColors[index]}
                      opacity={activeCategoryIndex === null || activeCategoryIndex === index ? 1 : 0.3}
                      style={{ transition: 'all 0.3s ease', outline: 'none' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Earnings */}
        <div className="flex flex-col rounded-2xl p-6 relative overflow-hidden h-[160px] border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a]">
          <div className="flex flex-col z-10 w-full relative">
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="text-[#a1a1aa] dark:text-[#737373] size-5" />
              <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Earnings</Typography>
            </div>
            <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">₹{(totalEarnings/1000).toFixed(1)}k</Typography>
            <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
              <span className="text-[#84cc16]">All time</span>
              <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">total</span>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0 transition-opacity duration-300" style={{ maskImage: "linear-gradient(to right, transparent, black 35%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 35%, black 90%, transparent)" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Tooltip 
                  cursor={false}
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-2 rounded-xl shadow-lg z-[100] relative min-w-[80px]">
                          <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] block mb-1">{payload[0].payload.month}</span>
                          <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white leading-none block">₹{(payload[0].value/1000).toFixed(1)}k</span>
                        </div>
                      )
                    }
                    return null;
                  }}
                />
                <defs>
                  <linearGradient id="color-earnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="amount" stroke="#84cc16" strokeWidth={2} fillOpacity={1} fill="url(#color-earnings)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2x2 Metrics Grid (Col 4) */}
        <div className="lg:col-span-1 h-[160px] w-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full">
            {metrics.map((metric, i) => (
              <div key={i} className={cn("flex flex-col justify-center px-4 py-3 rounded-2xl border shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden", getMetricBg(metric.label, metric.value))}>
                <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] truncate">{metric.label}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[16px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none truncate">{metric.value}</span>
                  {metric.trend && (
                    <div className={cn("flex items-center gap-0.5", metric.isPositive ? "text-emerald-500" : "text-red-500")}>
                      <span className="text-[12px] font-bold">{metric.trend}</span>
                      {metric.isPositive ? <ArrowUp className="w-3 h-3 stroke-[3]" /> : <ArrowDown className="w-3 h-3 stroke-[3]" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
