"use client"

import { useState } from "react"
import { Typography } from "@heroui/react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { ChartPie } from "@gravity-ui/icons"
import { IncomeBreakdown as IncomeBreakdownType } from "./finance-data"

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 p-3 rounded-xl shadow-lg flex flex-col gap-1.5 min-w-[120px] z-[100] relative">
        <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">{data.name}</span>
        <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white leading-none">{data.value}%</span>
      </div>
    );
  }
  return null;
}

export function IncomeBreakdown({ data }: { data: IncomeBreakdownType[] }) {
  const [activePlatformIndex, setActivePlatformIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col rounded-2xl p-6 relative overflow-hidden h-[160px] border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-[#27272a] dark:bg-[#0a0a0a] w-full">
      <div className="flex flex-col z-10 w-full relative">
        <div className="flex items-center gap-2 mb-2">
          <ChartPie className="text-[#a1a1aa] dark:text-[#737373] size-5" />
          <Typography type="body-sm" className="font-semibold text-[#737373] dark:text-[#a1a1aa]">Income Breakdown</Typography>
        </div>
        <Typography type="h2" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white mt-1 leading-none">{data.length}</Typography>
        <div className="flex items-center gap-1.5 mt-3 text-[13px] font-medium">
          <span className="text-[#db2777]">Instagram Deals (45%)</span>
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
              data={data} 
              cx="50%" cy="50%" 
              innerRadius={35} 
              outerRadius={60} 
              paddingAngle={2} 
              dataKey="value" 
              stroke="none"
              onMouseEnter={(_, index) => setActivePlatformIndex(index)}
              onMouseLeave={() => setActivePlatformIndex(null)}
            >
              {data.map((entry, index) => {
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
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
  )
}
