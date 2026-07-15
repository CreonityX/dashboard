"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Campaign, getCardBudget } from "./campaign-data"
import { BrandLogo } from "@/components/ui/brand-logo"

const BRAND_COLORS: Record<string, { r: number, g: number, b: number }> = {
  "apple.com": { r: 0, g: 0, b: 0 },
  "nike.com": { r: 0, g: 0, b: 0 },
  "airbnb.com": { r: 255, g: 90, b: 95 },
  "patagonia.com": { r: 25, g: 25, b: 50 },
  "ubereats.com": { r: 6, g: 193, b: 103 },
  "spotify.com": { r: 30, g: 215, b: 96 },
}

function useBrandColor(domain: string) {
  const [colors, setColors] = useState<{bg: string, border: string} | null>(null);

  useEffect(() => {
    if (!domain) return;
    
    const brand = BRAND_COLORS[domain];
    if (brand) {
      setColors({
        bg: `rgba(${brand.r}, ${brand.g}, ${brand.b}, 0.08)`,
        border: `rgba(${brand.r}, ${brand.g}, ${brand.b}, 0.3)`
      });
      return;
    }

    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    setColors({
      bg: `hsla(${h}, 70%, 50%, 0.08)`,
      border: `hsla(${h}, 70%, 50%, 0.2)`
    });
  }, [domain]);

  return colors;
}

const statusStyles: Record<string, string> = {
  Open: "bg-[#0ea5e9]/10 text-[#0ea5e9]",
  "Closing Soon": "bg-[#f59e0b]/10 text-[#f59e0b]",
  Filled: "bg-[#737373]/10 text-[#737373]",
  Closed: "bg-[#737373]/10 text-[#737373]",
}

function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md px-2.5 text-[10.5px] font-bold uppercase tracking-wide", statusStyles[status])}>{status}</span>
}

function BrandMark({ campaign, size = "md" }: { campaign: Campaign; size?: "sm" | "md" }) {
  return (
    <div className={cn(
      "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#efefef] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:border-[#27272a] dark:bg-[#111111]",
      size === "sm" ? "h-8 w-8" : "h-10 w-10"
    )}>
      <BrandLogo domain={campaign.domain} name={campaign.brand} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  )
}

import Link from "next/link"

export function RecommendedCampaignCard({ campaign, className }: { campaign: Campaign; className?: string }) {
  const isUnavailable = campaign.status === "Filled" || campaign.status === "Closed"
  const brandColors = useBrandColor(campaign.domain)
  
  const cardStyle = brandColors ? {
    background: `linear-gradient(135deg, ${brandColors.bg} 0%, transparent 100%)`,
    borderColor: brandColors.border
  } : {}

  return (
    <button
      type="button"
      style={cardStyle}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-5 text-left shadow-none transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:bg-[#0a0a0a]",
        !brandColors && "border-[#e4e4e7] hover:border-gray-300 dark:border-[#27272a] dark:hover:border-gray-600",
        isUnavailable && "opacity-60",
        "h-[280px] w-full",
        className
      )}
    >
      <div className="mb-4 flex h-9 items-center justify-between gap-3 w-full">
        <Link href={`/brand/${campaign.brand.toLowerCase().replace(/\\s+/g, '')}`} onClick={(e) => e.stopPropagation()} className="flex min-w-0 items-center gap-3 hover:opacity-80 transition-opacity">
          <BrandMark campaign={campaign} />
          <div className="min-w-0 flex flex-col justify-center gap-0.5">
            <p className="truncate text-[14px] font-bold leading-none text-[#0a0a0a] dark:text-white">{campaign.brand}</p>
            <p className="truncate text-[12px] font-medium leading-none text-gray-500">{campaign.niche} · {campaign.location}</p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          {campaign.match ? (
            <span className="inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md bg-[#0060ff]/10 px-2.5 text-[11px] font-bold text-[#0060ff] dark:bg-[#4d90fe]/15 dark:text-[#4d90fe]">{campaign.match}% match</span>
          ) : null}
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <h3 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-tight text-[#0a0a0a] dark:text-white w-full">{campaign.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 w-full">{campaign.description}</p>

      <div className="mt-3 flex items-center text-[12.5px] font-medium text-gray-500 dark:text-gray-400 w-full">
        <span className="truncate">{campaign.deliverables.slice(0, 3).join(" • ")}</span>
      </div>

      <div className="mt-auto pt-3 w-full">
        <div className="grid h-[62px] grid-cols-3 overflow-hidden rounded-[12px] border border-gray-200 bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="flex flex-col justify-center border-r border-gray-200 px-3 dark:border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Budget</p>
            <p className="mt-1 truncate text-[11.5px] font-bold text-[#0a0a0a] dark:text-white">{getCardBudget(campaign)}</p>
          </div>
          <div className="flex flex-col justify-center border-r border-gray-200 px-3 dark:border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Left</p>
            <p className="mt-1 text-[12px] font-bold text-[#0a0a0a] dark:text-white">{campaign.daysLeft ? `${campaign.daysLeft}d` : "Filled"}</p>
          </div>
          <div className="flex flex-col justify-center px-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Bids</p>
            <p className="mt-1 text-[12px] font-bold text-[#0a0a0a] dark:text-white">{campaign.bids}</p>
          </div>
        </div>
      </div>
    </button>
  )
}
