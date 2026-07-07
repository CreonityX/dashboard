"use client"

import { useState, useMemo } from "react"
import { Typography } from "@heroui/react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell } from "recharts"
import { Clock, Bulb, ChartPie } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { CreonityScore } from "./creonity-score"

import { getGlobalAnalyticsData, AnalyticsTimeframe } from "./platform-analytics-data"

const AVG_ENGAGEMENT = 3.5;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#18181b] border border-gray-100 dark:border-white/10 p-3 rounded-xl shadow-lg min-w-[140px] z-[100] relative">
        <p className="text-[12px] font-medium text-[#737373] mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].value >= AVG_ENGAGEMENT ? '#0ea5e9' : '#f43f5e' }} />
          <span className="text-[13px] font-medium text-[#737373] flex-1">Expected:</span>
          <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">
            {payload[0].value}%
          </span>
        </div>
      </div>
    )
  }
  return null
}

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

export function PerformanceCharts({ timeframe = "7d" }: { timeframe?: AnalyticsTimeframe }) {
  const [activePlatformIndex, setActivePlatformIndex] = useState<number | null>(null)
  const { performance } = useMemo(() => getGlobalAnalyticsData(timeframe), [timeframe])
  const { bestTimeData, platformShareData, scoreData } = performance


  // --- SQUIGGLY SVG PIE CHART LOGIC ---
  const cx = 60;
  const cy = 60;
  const R_outer = 50; 
  
  const totalShare = platformShareData.reduce((sum, d) => sum + d.value, 0);
  
  // Calculate slice geometry
  const pieSlices = useMemo(() => {
    let currentAngle = 0; 
    return platformShareData.map((d) => {
      const startAngle = currentAngle;
      const sweep = (d.value / totalShare) * 360;
      const endAngle = currentAngle + sweep;
      currentAngle = endAngle;
      return { ...d, startAngle, endAngle, sweep };
    });
  }, [totalShare]);

  // Wavy S-Curve boundary generator
  const getBoundary = (angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const V = { x: R_outer * Math.cos(angleRad), y: R_outer * Math.sin(angleRad) };
    const P = { x: cx + V.x, y: cy + V.y };
    const Perp = { x: -V.y, y: V.x };
    const b = 0.25; // S-Curve bend amplitude
    
    const c1 = { x: cx + V.x * 0.33 + Perp.x * b, y: cy + V.y * 0.33 + Perp.y * b };
    const c2 = { x: cx + V.x * 0.66 - Perp.x * b, y: cy + V.y * 0.66 - Perp.y * b };
    
    return { P, c1, c2 };
  };

  // Calculate gradient offset for best time chart
  const maxEng = Math.max(...bestTimeData.map(d => d.engagement))
  const minEng = Math.min(...bestTimeData.map(d => d.engagement))
  const gradientOffset = (maxEng - AVG_ENGAGEMENT) / (maxEng - minEng)

  return (
    <div className="w-full pb-12 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 px-6 w-full">

        {/* SUMMARY BOX (Span 2) */}
        <div className="sm:col-span-2 flex flex-col rounded-2xl p-6 border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a] h-auto sm:h-full">
          <div className="flex flex-col z-10 w-full relative h-full">
            <div className="flex items-center gap-2 mb-2">
              <Bulb className="text-[#a1a1aa] dark:text-[#737373] size-5" />
              <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">
                Insights
              </Typography>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3 flex-1 overflow-hidden">
              <div className="flex flex-col gap-4">
                <p className="text-[13px] font-medium leading-relaxed text-[#0a0a0a] dark:text-[#d4d4d8]">
                  Audience is most active in the <span className="font-bold text-[#0ea5e9]">evening (6 PM)</span>, driving 2x higher engagement.
                </p>
                <p className="text-[13px] font-medium leading-relaxed text-[#0a0a0a] dark:text-[#d4d4d8]">
                  Posts made on <span className="font-bold text-emerald-500">Thursdays</span> currently yield the highest reach out of your weekly schedule.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-[13px] font-medium leading-relaxed text-[#0a0a0a] dark:text-[#d4d4d8]">
                  Your <span className="font-bold text-[#e1306c]">Instagram Reels</span> are driving 60% of all new follower growth this week.
                </p>
                <p className="text-[13px] font-medium leading-relaxed text-[#0a0a0a] dark:text-[#d4d4d8]">
                  Short-form content under <span className="font-bold text-amber-500">15 seconds</span> has a 40% higher completion rate.
                </p>
              </div>
            </div>
            
            <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/5">
              <p className="text-[11px] font-semibold text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider mb-1">Action Item</p>
              <p className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white leading-relaxed">Schedule upcoming Reels between 5:30 PM - 6:30 PM.</p>
            </div>
          </div>
        </div>

        {/* TIME & PLATFORM SHARE WRAPPER (Span 1) */}
        <div className="sm:col-span-1 flex flex-col gap-5">


        {/* CHART 1: Best Time to Post (Span 1 - Right) */}
        <div className="sm:col-span-1 flex flex-col rounded-2xl p-6 border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a] relative overflow-hidden h-[160px]">
          <div className="flex flex-col z-10 w-full relative">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-[#a1a1aa] dark:text-[#737373] size-5" />
              <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">
                Time
              </Typography>
            </div>
            <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">
              {bestTimeData.find(d => d.engagement === maxEng)?.time || "6 PM"}
            </Typography>
            <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
              <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">Peak Engagement</span>
            </div>
          </div>
          
          <div 
            className="absolute right-0 bottom-0 top-[30%] w-full z-0 pointer-events-none"
            style={{ maskImage: "linear-gradient(to top, black 20%, transparent)", WebkitMaskImage: "linear-gradient(to top, black 20%, transparent)" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bestTimeData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="splitColorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={gradientOffset} stopColor="#0ea5e9" stopOpacity={1} />
                    <stop offset={gradientOffset} stopColor="#f43f5e" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a1a1aa', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="engagement" stroke="url(#splitColorTime)" strokeWidth={2.5} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Platform Share (Span 1 - Right) */}
        <div className="sm:col-span-1 flex flex-col rounded-2xl p-6 relative overflow-hidden h-[160px] border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a]">
          <div className="flex flex-col z-10 w-full relative">
            <div className="flex items-center gap-2 mb-2">
              <ChartPie className="text-[#a1a1aa] dark:text-[#737373] size-5" />
              <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Platform Share</Typography>
            </div>
            <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{platformShareData.length}</Typography>
            <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
              <span className="text-[#e1306c]">Instagram (45%)</span>
              <span className="text-[#a1a1aa] dark:text-[#737373] font-normal">leading</span>
            </div>
          </div>
          
          <div 
            className="absolute -right-8 -bottom-8 w-[160px] h-[160px] z-20 mix-blend-multiply dark:mix-blend-screen transition-all duration-300"
            style={{ 
              filter: activePlatformIndex !== null ? 'none' : 'grayscale(100%)', 
              opacity: activePlatformIndex !== null ? 1 : 0.4 
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={platformShareData} 
                  cx="50%" cy="50%" 
                  innerRadius={35} 
                  outerRadius={60} 
                  paddingAngle={2} 
                  dataKey="value" 
                  stroke="none"
                  onMouseEnter={(_, index) => setActivePlatformIndex(index)}
                  onMouseLeave={() => setActivePlatformIndex(null)}
                >
                  {platformShareData.map((entry, index) => {
                    const baseColor = entry.stops[1]?.c || entry.stops[0].c;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={baseColor}
                        opacity={activePlatformIndex === null || activePlatformIndex === index ? 1 : 0.3}
                        style={{ transition: 'all 0.3s ease', outline: 'none' }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>

        {/* CHART 3: Creonity Score (Span 1 - Right) */}
        <CreonityScore scoreData={scoreData} />

      </div>
    </div>
  )
}
