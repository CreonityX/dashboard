"use client"

import { useMemo } from "react"
import { Typography, ScrollShadow } from "@heroui/react"
import { Eye, HandPointDown, Heart, Person, ArrowUp, ArrowDown, ChartColumn, Globe, Pencil } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts"

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="font-bold text-[15px] tracking-tight text-[#0a0a0a] dark:text-white bg-white dark:bg-[#18181b] shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-none dark:border dark:border-white/10 px-3 py-1.5 rounded-[10px]">
        {Number(payload[0].value).toFixed(1)}
      </div>
    );
  }
  return null;
};

import { getGlobalAnalyticsData, AnalyticsTimeframe } from "./platform-analytics-data"

const labels: Record<string, string> = {
  "7d": "last 7d",
  "30d": "last 30d",
  "90d": "last 90d",
  "all": "all time",
}

export function OverviewStrip({ timeframe = "7d" }: { timeframe?: string }) {
  const label = labels[timeframe] || "last 7d";

  const { overview: globalOverview, smallMetrics: globalSmallMetrics } = useMemo(() => getGlobalAnalyticsData(timeframe as AnalyticsTimeframe), [timeframe]);
  
  const getMetricSeries = (id: string) => {
    return Array.from({ length: 20 }, (_, i) => ({
      name: i.toString(),
      value: Math.max(5, (id === "engagements" || id === "impressions" || id === "posts" ? 82 - i * 2.4 : 12 + i * 3.2) + Math.sin(i * 1.4) * 4),
    }));
  };

  const metricsWithData = useMemo(() => {
    return [
      { id: "reach", label: "Total Reach", value: globalOverview[0].value, trend: globalOverview[0].trend, isPositive: globalOverview[0].isPositive, icon: Globe, data: getMetricSeries("reach") },
      { id: "engagements", label: "Total Engagements", value: globalSmallMetrics.find(m => m.id === "likes")?.value, trend: globalSmallMetrics[0].trend, isPositive: true, icon: Heart, data: getMetricSeries("likes") },
      { id: "followers", label: "Total Followers", value: globalOverview[1].value, trend: globalOverview[1].trend, isPositive: globalOverview[1].isPositive, icon: Person, data: getMetricSeries("followers") },
    ]
  }, [globalOverview, globalSmallMetrics])

  const smallMetricsWithData = useMemo(() => {
    return [
      { id: "engagement_rate", label: "Avg Engagement Rate", value: globalOverview[3].value, trend: globalOverview[3].trend, chartType: "line", isPositive: globalOverview[3].isPositive, data: getMetricSeries("engagement") },
      { id: "impressions", label: "Impressions", value: globalOverview[2].value, trend: globalOverview[2].trend, chartType: "arrow", isPositive: globalOverview[2].isPositive, data: getMetricSeries("impressions") },
      { id: "posts", label: "Posts Published", value: timeframe === "7d" ? "12" : timeframe === "30d" ? "48" : "142", trend: "", chartType: "line", isPositive: true, data: getMetricSeries("posts") },
      { id: "visits", label: "Profile Visits", value: globalSmallMetrics.find(m => m.id === "profile_visits")?.value, trend: globalSmallMetrics.find(m => m.id === "profile_visits")?.trend, chartType: "arrow", isPositive: true, data: getMetricSeries("profile_visits") },
    ]
  }, [globalOverview, globalSmallMetrics])

  return (
    <ScrollShadow orientation="horizontal" className="w-full pb-6 pt-2" hideScrollBar>
      <div className="flex gap-3 sm:gap-5 px-6 w-full min-w-max">
        {metricsWithData.map((metric) => (
          <div
            key={metric.id}
            className={cn(
              "flex w-[calc(100vw-48px)] sm:w-auto sm:flex-1 min-w-[280px] shrink-0 rounded-2xl p-5 sm:p-6 relative overflow-hidden",
              metric.id === "reach" 
                ? "border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a]"
                : "border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]"
            )}
          >
            {/* Left Content */}
            <div className="flex flex-col z-10 w-[60%]">
              <div className="flex items-center gap-2 text-[#737373] dark:text-[#a1a1aa]">
                <metric.icon className="size-[18px]" />
                <span className="text-[14.5px] font-semibold">{metric.label}</span>
              </div>
              <div className="text-[32px] font-bold text-[#0a0a0a] dark:text-white mt-4 tracking-tight leading-none">
                {metric.value}
              </div>
              <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
                <span className={metric.isPositive ? "text-emerald-500" : "text-red-500"}>
                  {metric.isPositive ? "↑" : "↓"} {metric.trend}
                </span>
                <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">{label}</span>
              </div>
            </div>

            {/* Right Chart */}
            <div 
              className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0 pointer-events-none"
              style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metric.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`color-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={metric.isPositive ? "#0ea5e9" : "#ef4444"} 
                        stopOpacity={0.25}
                      />
                      <stop 
                        offset="95%" 
                        stopColor={metric.isPositive ? "#0ea5e9" : "#ef4444"} 
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={metric.isPositive ? "#0ea5e9" : "#ef4444"}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#color-${metric.id})`}
                    isAnimationActive={true}
                    animationDuration={400}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}

        {/* Small Metrics 2x2 Grid */}
        <div className="flex w-[calc(100vw-48px)] sm:w-auto sm:flex-1 min-w-[280px] shrink-0 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3">
          {smallMetricsWithData.map((sm) => (
            <div
              key={sm.id}
              className="flex flex-col justify-center rounded-2xl border border-[#e4e4e7] bg-white px-4 py-3 shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a] relative overflow-hidden"
            >
              <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] relative z-10">{sm.label}</span>
              
              <div className="flex items-center justify-between mt-1 relative z-10">
                <span className="text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">{sm.value}</span>
                {sm.chartType === "arrow" && (
                  <div className={cn("flex items-center gap-0.5", sm.isPositive ? "text-emerald-500" : "text-red-500")}>
                    <span className="text-[13px] font-bold">{sm.trend}</span>
                    {sm.isPositive ? <ArrowUp className="size-3.5 stroke-[2px]" /> : <ArrowDown className="size-3.5 stroke-[2px]" />}
                  </div>
                )}
              </div>

              {sm.chartType === "line" && (
                <div 
                  className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0 transition-opacity duration-300"
                  style={{ maskImage: "linear-gradient(to right, transparent, black 35%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 35%, black 90%, transparent)" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sm.data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={sm.isPositive ? "#0ea5e9" : "#ef4444"}
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={400}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollShadow>
  )
}
