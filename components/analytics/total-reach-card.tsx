"use client"

import React from "react"
import { Globe, ArrowUp } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

const mockData = [
  { value: 10 },
  { value: 12 },
  { value: 10 },
  { value: 20 },
  { value: 18 },
  { value: 30 },
  { value: 28 },
  { value: 45 },
  { value: 40 },
  { value: 65 },
  { value: 62 },
  { value: 85 },
]

export function TotalReachCard() {
  return (
    <div className="relative overflow-hidden w-full max-w-[360px] h-[190px] bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col p-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-[18px] h-[18px] text-[#9ca3af]" />
        <span className="font-semibold text-[#6b7280] text-[15px]">Total Reach</span>
      </div>

      {/* Main Metric */}
      <div className="text-[44px] font-bold text-[#0a0a0a] tracking-tight leading-none mb-3 z-10">
        307.3K
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-[14px] z-10">
        <div className="flex items-center font-bold text-[#10b981]">
          <ArrowUp className="w-[14px] h-[14px] mr-0.5" strokeWidth={3} />
          24.5%
        </div>
        <span className="text-[#9ca3af] font-medium">last 7d</span>
      </div>

      {/* Background Chart */}
      <div className="absolute right-0 bottom-0 w-[65%] h-[60%] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 0, left: 0, bottom: -5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
