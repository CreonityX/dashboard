import { useMemo, useState } from "react"
import { Typography, ScrollShadow } from "@heroui/react"
import { Eye, HandPointDown, Heart, Person, ArrowUp, ArrowDown, ChartColumn, Globe, Pencil } from "@gravity-ui/icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faXTwitter, faTiktok, faSnapchat } from "@fortawesome/free-brands-svg-icons"
import { cn } from "@/lib/utils"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts"
import { getGlobalAnalyticsData, AnalyticsTimeframe } from "./platform-analytics-data"

const labels: Record<string, string> = {
  "7d": "last 7d",
  "30d": "last 30d",
  "90d": "last 90d",
  "all": "all time",
}

export function OverviewGridExpandable({ timeframe = "7d" }: { timeframe?: string }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [activePlatform, setActivePlatform] = useState<string>("all")
  
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

  const handleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  // Determine KPI Strip span logic for desktop grid
  let kpiColSpan = "col-span-4"
  let kpiColStart = "col-start-1"

  if (expandedId === "reach") {
    kpiColSpan = "col-span-3"
    kpiColStart = "col-start-2"
  } else if (expandedId === "engagements") {
    kpiColSpan = "col-span-2"
    kpiColStart = "col-start-3"
  } else if (expandedId === "followers") {
    kpiColSpan = "col-span-2"
    kpiColStart = "col-start-1"
  } else if (["engagement_rate", "impressions", "posts", "visits"].includes(expandedId || "")) {
    kpiColSpan = "col-span-3"
    kpiColStart = "col-start-1"
  }

  const activeSmallMetric = smallMetricsWithData.find(sm => sm.id === expandedId);
  const isSmallExpanded = !!activeSmallMetric;

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

  const renderExpandedContent = (metric: any) => {
    const platformStyles = [
      { id: "all", label: "ALL", color: metric.isPositive ? "#0ea5e9" : "#ef4444", textClass: "text-[#0ea5e9]" },
      { id: "ig", label: "IG", icon: faInstagram, color: "#e1306c", textClass: "text-[#e1306c]" },
      { id: "x", label: "X", icon: faXTwitter, color: "#737373", textClass: "text-gray-900 dark:text-white" },
      { id: "tt", label: "TT", icon: faTiktok, color: "#06b6d4", textClass: "text-[#06b6d4]" },
      { id: "snap", label: "Snap", icon: faSnapchat, color: "#eab308", textClass: "text-[#eab308]" },
    ];

    const activeStyle = platformStyles.find(p => p.id === activePlatform) || platformStyles[0];

    return (
      <div className="mt-4 pt-6 border-t border-gray-100 dark:border-white/10 w-full flex flex-col flex-1 animate-in fade-in duration-300 relative z-10">
        
        {/* Platform Switcher */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-10 mb-6 px-2">
          {platformStyles.map(p => {
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={(e) => { e.stopPropagation(); setActivePlatform(p.id); }}
                className={cn(
                  "font-semibold transition-all flex items-center justify-center cursor-pointer hover:scale-110",
                  isActive ? p.textClass : "text-[#a1a1aa] hover:text-[#737373] dark:hover:text-gray-300"
                )}
              >
                {p.id === "all" ? (
                  <span className="text-[13px] tracking-wide">{p.label}</span>
                ) : (
                  <FontAwesomeIcon icon={p.icon!} className="size-[20px]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Detailed Chart */}
        <div className="flex-1 w-full min-h-[200px] pb-4 pr-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metric.data} margin={{ top: 10, right: 0, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id={`color-expanded-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeStyle.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={activeStyle.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} dy={10} minTickGap={20} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} dx={-10} tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val} />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={activeStyle.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-expanded-${metric.id})`}
                activeDot={{ r: 5, strokeWidth: 0, fill: activeStyle.color }}
                isAnimationActive={true}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  const KpiRow = ({ className }: { className?: string }) => (
    <div className={cn("flex w-full flex-row items-center justify-between rounded-[14px] border border-[#e4e4e7] bg-white py-2 px-1 dark:border-[#27272a] dark:bg-[#0a0a0a] overflow-x-auto scrollbar-none", className)}>
      <div className="flex flex-col justify-center flex-1 border-r border-gray-100 dark:border-white/10 px-3 sm:px-5 py-1 shrink-0">
        <span className="text-[11px] sm:text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] mb-0.5 whitespace-nowrap">Engmt Rate</span>
        <div className="flex items-end gap-1.5 sm:gap-2">
          <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">4.8%</span>
          <span className="text-[12px] font-medium text-emerald-500 leading-none">12%</span>
        </div>
      </div>
      <div className="flex flex-col justify-center flex-1 border-r border-gray-100 dark:border-white/10 px-3 sm:px-5 py-1 shrink-0">
        <span className="text-[11px] sm:text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] mb-0.5 whitespace-nowrap">Niche Avg</span>
        <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">3.2%</span>
      </div>
      <div className="flex flex-col justify-center flex-1 px-3 sm:px-5 py-1 shrink-0">
        <span className="text-[11px] sm:text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] mb-0.5 whitespace-nowrap">Top 10%</span>
        <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">5.4%</span>
      </div>
    </div>
  )

  return (
    <>
      {/* --- DESKTOP GRID LAYOUT --- */}
      <div 
        className="hidden sm:grid grid-cols-4 gap-5 px-6 mb-8 w-full transition-all duration-300" 
        style={{ gridTemplateRows: expandedId ? "160px max-content" : "160px max-content" }}
      >
        {/* Render 3 Big Cards */}
        {metricsWithData.map((metric) => {
          const isExpanded = expandedId === metric.id;
          return (
            <div
              key={metric.id}
              onClick={() => handleExpand(metric.id)}
              className={cn(
                "flex flex-col rounded-2xl p-6 relative overflow-hidden transition-all duration-300 cursor-pointer",
                metric.id === "reach" 
                  ? "border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a]"
                  : "border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]",
                isExpanded ? "row-span-2 h-[420px] z-20" : "h-[160px] hover:border-gray-300 dark:hover:border-white/20"
              )}
            >
              <div className="flex flex-col z-10 w-full relative">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="text-[#a1a1aa] dark:text-[#737373] size-5" />
                  <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">{metric.label}</Typography>
                </div>
                <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{metric.value}</Typography>
                <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
                  <span className={metric.isPositive ? "text-emerald-500" : "text-red-500"}>
                    {metric.isPositive ? "↑" : "↓"} {metric.trend}
                  </span>
                  <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">{label}</span>
                </div>
              </div>

              {/* Background Sparkline Chart (Hidden when expanded) */}
              {!isExpanded && (
                <div 
                  className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0 transition-opacity duration-300"
                  style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metric.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <YAxis hide domain={['dataMin', 'dataMax']} />
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      <defs>
                        <linearGradient id={`color-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={metric.isPositive ? "#0ea5e9" : "#ef4444"} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={metric.isPositive ? "#0ea5e9" : "#ef4444"} stopOpacity={0} />
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
              )}
              
              {isExpanded && renderExpandedContent(metric)}
            </div>
          )
        })}

        {/* Small Metrics 2x2 Grid (4th Column) */}
        <div 
          className={cn(
            "relative transition-all duration-300 w-full", 
            isSmallExpanded ? "row-span-2 h-[420px] z-20" : "h-[160px]"
          )}
        >
          {smallMetricsWithData.map((sm, idx) => {
            const isThisExpanded = expandedId === sm.id;
            const isHidden = isSmallExpanded && !isThisExpanded;
            
            // Calculate absolute position for grid layout
            const isRight = idx % 2 === 1;
            const isBottom = idx >= 2;
            
            // Base positioning classes
            const basePos = cn(
              "absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
              isThisExpanded ? "top-0 left-0 w-full h-full z-30" : cn(
                 "w-[calc(50%-6px)] h-[calc(50%-6px)]", // accounting for gap-3 (12px / 2 = 6px)
                 isBottom ? "bottom-0" : "top-0",
                 isRight ? "right-0" : "left-0"
              )
            );

            return (
              <div
                key={sm.id}
                onClick={() => handleExpand(sm.id)}
                className={cn(
                  basePos,
                  "flex flex-col rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a] overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-white/20",
                  isHidden ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                )}
              >
                {/* BIG CONTENT */}
                <div className={cn("transition-opacity duration-300 flex flex-col h-full w-full", isThisExpanded ? "opacity-100 p-6 delay-150" : "opacity-0 absolute pointer-events-none inset-0 p-6")}>
                  <div className="flex flex-col z-10 w-full relative">
                    <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa] mb-1">{sm.label}</Typography>
                    <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{sm.value}</Typography>
                    {sm.chartType === "arrow" && (
                      <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
                        <span className={sm.isPositive ? "text-emerald-500" : "text-red-500"}>
                          {sm.isPositive ? "↑" : "↓"} {sm.trend}
                        </span>
                        <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">{label}</span>
                      </div>
                    )}
                  </div>
                  {isThisExpanded && renderExpandedContent(sm)}
                </div>

                {/* MINI CONTENT */}
                <div className={cn("transition-opacity duration-200 flex flex-col h-full w-full justify-center relative", isThisExpanded ? "opacity-0 absolute pointer-events-none inset-0 px-4 py-3" : "opacity-100 px-4 py-3 delay-150")}>
                  <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] relative z-10 truncate">{sm.label}</span>
                  <div className="flex items-center justify-between mt-1 relative z-10">
                    <span className="text-[16px] xl:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none truncate">{sm.value}</span>
                    {sm.chartType === "arrow" && (
                      <div className={cn("flex items-center gap-0.5", sm.isPositive ? "text-emerald-500" : "text-red-500")}>
                        <span className="text-[12px] font-bold">{sm.trend}</span>
                        {sm.isPositive ? <ArrowUp className="size-3 stroke-[2px]" /> : <ArrowDown className="size-3 stroke-[2px]" />}
                      </div>
                    )}
                  </div>
                  {sm.chartType === "line" && (
                    <div 
                      className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0"
                      style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sm.data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                          <YAxis hide domain={['dataMin', 'dataMax']} />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Line type="monotone" dataKey="value" stroke={sm.isPositive ? "#0ea5e9" : "#ef4444"} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Dynamic KPI Row (Row 2 on Desktop) */}
        <div className={cn("flex self-start transition-all duration-300 row-start-2", kpiColSpan, kpiColStart)}>
           <KpiRow />
        </div>
      </div>

      {/* --- MOBILE SCROLL LAYOUT --- */}
      <div className="sm:hidden block w-full mb-8">
        <ScrollShadow orientation="horizontal" className="w-full pb-6 pt-2" hideScrollBar>
          <div className="flex gap-3 px-6 w-full min-w-max items-start">
            
            {/* Big Cards Mobile */}
            {metricsWithData.map((metric) => {
              const isExpanded = expandedId === metric.id;
              return (
                <div
                  key={metric.id}
                  onClick={() => handleExpand(metric.id)}
                  className={cn(
                    "flex flex-col w-[calc(100vw-48px)] shrink-0 rounded-2xl p-5 relative overflow-hidden transition-all duration-300",
                    metric.id === "reach" 
                      ? "border border-[#e4e4e7] bg-white shadow-none dark:border-[#27272a] dark:bg-[#0a0a0a]"
                      : "border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]",
                    isExpanded ? "z-20 h-[420px]" : "h-[150px]"
                  )}
                >
                  <div className="flex flex-col z-10 w-full relative">
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon className="text-[#a1a1aa] dark:text-[#737373] size-5" />
                      <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">{metric.label}</Typography>
                    </div>
                    <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{metric.value}</Typography>
                    <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
                      <span className={metric.isPositive ? "text-emerald-500" : "text-red-500"}>
                        {metric.isPositive ? "↑" : "↓"} {metric.trend}
                      </span>
                      <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">{label}</span>
                    </div>
                  </div>

                  {/* Background Sparkline Chart (Hidden when expanded) */}
                  {!isExpanded && (
                    <div 
                      className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0 transition-opacity duration-300"
                      style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metric.data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                          <YAxis hide domain={['dataMin', 'dataMax']} />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <defs>
                            <linearGradient id={`color-mobile-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={metric.isPositive ? "#0ea5e9" : "#ef4444"} stopOpacity={0.25} />
                              <stop offset="95%" stopColor={metric.isPositive ? "#0ea5e9" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={metric.isPositive ? "#0ea5e9" : "#ef4444"}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#color-mobile-${metric.id})`}
                            isAnimationActive={true}
                            animationDuration={400}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  {isExpanded && renderExpandedContent(metric)}
                </div>
              )
            })}

            {/* Small Metrics Grid Mobile */}
            <div 
              className={cn(
                "relative transition-all duration-300 w-[calc(100vw-48px)] shrink-0",
                isSmallExpanded ? "h-[420px] z-20" : "h-[150px]"
              )}
            >
              {smallMetricsWithData.map((sm, idx) => {
                const isThisExpanded = expandedId === sm.id;
                const isHidden = isSmallExpanded && !isThisExpanded;
                
                const isRight = idx % 2 === 1;
                const isBottom = idx >= 2;
                
                const basePos = cn(
                  "absolute transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  isThisExpanded ? "top-0 left-0 w-full h-full z-30" : cn(
                     "w-[calc(50%-4px)] h-[calc(50%-4px)]", // gap-2 = 8px -> 4px
                     isBottom ? "bottom-0" : "top-0",
                     isRight ? "right-0" : "left-0"
                  )
                );

                return (
                  <div
                    key={sm.id}
                    onClick={() => handleExpand(sm.id)}
                    className={cn(
                      basePos,
                      "flex flex-col rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a] overflow-hidden cursor-pointer",
                      isHidden ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                    )}
                  >
                    {/* BIG CONTENT */}
                    <div className={cn("transition-opacity duration-300 flex flex-col h-full w-full", isThisExpanded ? "opacity-100 p-5 delay-150" : "opacity-0 absolute pointer-events-none inset-0 p-5")}>
                      <div className="flex flex-col z-10 w-full relative">
                        <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa] mb-1">{sm.label}</Typography>
                        <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{sm.value}</Typography>
                        {sm.chartType === "arrow" && (
                          <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
                            <span className={sm.isPositive ? "text-emerald-500" : "text-red-500"}>
                              {sm.isPositive ? "↑" : "↓"} {sm.trend}
                            </span>
                            <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">{label}</span>
                          </div>
                        )}
                      </div>
                      {isThisExpanded && renderExpandedContent(sm)}
                    </div>

                    {/* MINI CONTENT */}
                    <div className={cn("transition-opacity duration-200 flex flex-col h-full w-full justify-center relative", isThisExpanded ? "opacity-0 absolute pointer-events-none inset-0 px-4 py-3" : "opacity-100 px-4 py-3 delay-150")}>
                      <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] relative z-10 truncate">{sm.label}</span>
                      <div className="flex items-center justify-between mt-1 relative z-10">
                        <span className="text-[16px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none truncate">{sm.value}</span>
                        {sm.chartType === "arrow" && (
                          <div className={cn("flex items-center gap-0.5", sm.isPositive ? "text-emerald-500" : "text-red-500")}>
                            <span className="text-[12px] font-bold">{sm.trend}</span>
                            {sm.isPositive ? <ArrowUp className="size-3 stroke-[2px]" /> : <ArrowDown className="size-3 stroke-[2px]" />}
                          </div>
                        )}
                      </div>
                      {sm.chartType === "line" && (
                        <div 
                          className="absolute right-0 bottom-0 top-[35%] w-[55%] z-0"
                          style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sm.data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                              <YAxis hide domain={['dataMin', 'dataMax']} />
                              <Tooltip content={<CustomTooltip />} cursor={false} />
                              <Line type="monotone" dataKey="value" stroke={sm.isPositive ? "#0ea5e9" : "#ef4444"} strokeWidth={1.5} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </ScrollShadow>

        {/* Hide KPI Row on mobile if any card is expanded */}
        <div className={cn("px-6 transition-all duration-300", expandedId ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto")}>
          <KpiRow />
        </div>
      </div>
    </>
  )
}
