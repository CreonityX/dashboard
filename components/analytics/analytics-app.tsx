"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faXTwitter, faTiktok, faSnapchat, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ChartAreaStacked } from "@gravity-ui/icons"
import { OverviewGrid } from "./overview-grid"
import { PerformanceCharts } from "./performance-charts"
import { PlatformAnalyticsDashboard } from "./platform-analytics-dashboard"
import { CreonityCampaignAnalytics } from "./creonity-campaign-analytics"
import type { AnalyticsTimeframe, PlatformAnalyticsId } from "./platform-analytics-data"
import { cn } from "@/lib/utils"

const TIMEFRAMES = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
  { id: "all", label: "ALL" },
]

const PLATFORMS = [
  { id: "all", label: "Analytics", gravityIcon: ChartAreaStacked, color: "text-[#0ea5e9]", activeBg: "bg-[#0ea5e9]/10 dark:bg-[#0ea5e9]/20" },
  { id: "ig", label: "Instagram", icon: faInstagram, color: "text-[#e1306c]", activeBg: "bg-[#e1306c]/10 dark:bg-[#e1306c]/20" },
  { id: "tt", label: "TikTok", icon: faTiktok, color: "text-gray-900 dark:text-white", activeBg: "bg-gray-100 dark:bg-white/10" },
  { id: "yt", label: "YouTube", icon: faYoutube, color: "text-[#ff0000]", activeBg: "bg-[#ff0000]/10 dark:bg-[#ff0000]/20" },
  { id: "x", label: "X (Twitter)", icon: faXTwitter, isDisabled: true, color: "text-gray-900 dark:text-white", activeBg: "bg-gray-100 dark:bg-white/10" },
  { id: "snap", label: "Snapchat", icon: faSnapchat, isDisabled: true, color: "text-[#eab308]", activeBg: "bg-[#eab308]/10 dark:bg-[#eab308]/20" },
]

export function AnalyticsApp() {
  const [timeframe, setTimeframe] = useState("7d")
  const [activePlatform, setActivePlatform] = useState("all")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const activePlatformData = PLATFORMS.find(p => p.id === activePlatform) || PLATFORMS[0]

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0a0a0a] overflow-y-auto">
      {/* Header */}
      <div className="flex shrink-0 flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6 lg:pt-8">
        <div className="relative z-50">
            <button
              data-testid="platform-selector"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen((open) => !open)}
              className="group flex h-[32px] cursor-pointer items-center gap-2 outline-none transition-opacity hover:opacity-80"
            >
              {activePlatformData.id !== "all" && (
                <>
                  {activePlatformData.gravityIcon ? (
                    <activePlatformData.gravityIcon className={cn("text-[32px] shrink-0", activePlatformData.color)} />
                  ) : activePlatformData.icon ? (
                    <FontAwesomeIcon 
                      icon={activePlatformData.icon} 
                      className={cn("text-[32px] shrink-0", activePlatformData.color)} 
                    />
                  ) : null}
                </>
              )}
              <span className="text-[28px] font-bold tracking-tight leading-none text-[#0a0a0a] dark:text-white">
                {activePlatformData.label}
              </span>
              {isDropdownOpen ? (
                <ChevronUp className="size-5 text-[#a1a1aa]" />
              ) : (
                <ChevronDown className="size-5 text-[#a1a1aa]" />
              )}
            </button>
          {isDropdownOpen && (
            <div role="listbox" aria-label="Select Platform" className="absolute left-0 top-[calc(100%+8px)] z-50 w-[220px] rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-[#18181b]">
              {PLATFORMS.map((p) => {
                const isSelected = activePlatform === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={p.isDisabled}
                    onClick={() => {
                      setActivePlatform(p.id)
                      setIsDropdownOpen(false)
                    }}
                    className={cn(
                      "flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-left transition-colors",
                      isSelected ? p.activeBg : "hover:bg-gray-50 dark:hover:bg-white/5",
                      p.isDisabled && "cursor-not-allowed opacity-45",
                    )}
                  >
                    {p.gravityIcon ? (
                      <p.gravityIcon className={cn("size-[18px] shrink-0", isSelected ? p.color : "text-[#737373] dark:text-[#a1a1aa]")} />
                    ) : p.icon ? (
                      <FontAwesomeIcon 
                        icon={p.icon} 
                        className={cn("size-[18px] shrink-0", isSelected ? p.color : "text-[#737373] dark:text-[#a1a1aa]")} 
                      />
                    ) : null}
                    <span className={cn("text-[14px] font-medium", isSelected ? p.color : "text-[#0a0a0a] dark:text-white")}>{p.label}</span>
                    {p.isDisabled && <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-400 dark:bg-white/10">Soon</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex w-full items-center overflow-hidden rounded-xl border border-[#efefef] bg-[#f4f4f5] p-0.5 dark:border-[#27272a] dark:bg-[#111111] sm:w-auto sm:shrink-0">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={cn(
                "flex h-[30px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] text-[12.5px] font-medium transition-all sm:w-[52px] sm:flex-none",
                timeframe === tf.id
                  ? "bg-white dark:bg-[#27272a] text-[#0a0a0a] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                  : "text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white"
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      {activePlatform === "all" ? (
        <>
          <OverviewGrid timeframe={timeframe} />
          <PerformanceCharts timeframe={timeframe as AnalyticsTimeframe} />
          <div className="-mt-7 px-6 pb-12">
            <CreonityCampaignAnalytics timeframe={timeframe as AnalyticsTimeframe} />
          </div>
        </>
      ) : (
        <PlatformAnalyticsDashboard platform={activePlatform as PlatformAnalyticsId} timeframe={timeframe as AnalyticsTimeframe} />
      )}
    </div>
  )
}
