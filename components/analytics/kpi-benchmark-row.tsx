"use client"

import { Typography } from "@heroui/react"

export function KpiBenchmarkRow() {
  return (
    <div className="w-full px-6 mb-8 mt-2">
      <div className="flex w-full flex-row items-center justify-between rounded-[14px] border border-[#e4e4e7] bg-white py-2 px-1 dark:border-[#27272a] dark:bg-[#0a0a0a] overflow-x-auto scrollbar-none">
        
        {/* Engmt Rate */}
        <div className="flex flex-col justify-center flex-1 border-r border-gray-100 dark:border-white/10 px-3 sm:px-5 py-1 shrink-0">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] mb-0.5 whitespace-nowrap">Engmt Rate</span>
          <div className="flex items-end gap-1.5 sm:gap-2">
            <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">4.8%</span>
            <span className="text-[12px] font-medium text-emerald-500 leading-none">12%</span>
          </div>
        </div>

        {/* Niche Avg */}
        <div className="flex flex-col justify-center flex-1 border-r border-gray-100 dark:border-white/10 px-3 sm:px-5 py-1 shrink-0">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] mb-0.5 whitespace-nowrap">Niche Avg</span>
          <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">3.2%</span>
        </div>

        {/* Top 10% */}
        <div className="flex flex-col justify-center flex-1 px-3 sm:px-5 py-1 shrink-0">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] mb-0.5 whitespace-nowrap">Top 10%</span>
          <span className="text-[16px] sm:text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">5.4%</span>
        </div>

      </div>
    </div>
  )
}
