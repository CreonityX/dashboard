"use client"

import { Icon } from "@iconify/react"
import { Button } from "@heroui/react"
import { cn } from "@/lib/utils"
import { Magnifier, FileText, ClockArrowRotateLeft, Rocket, Lock, CircleDollar, Play, CircleQuestion } from "@gravity-ui/icons"

const SHORTCUTS = [
  { id: "getting-started", title: "Getting Started", desc: "Learn the basics and set up your profile.", icon: Rocket },
  { id: "account-security", title: "Account & Security", desc: "Manage your account settings and 2FA.", icon: Lock },
  { id: "billing", title: "Billing & Payments", desc: "View invoices and manage subscriptions.", icon: CircleDollar },
  { id: "video-tutorials", title: "Video Tutorials", desc: "Step-by-step video guides for the platform.", icon: Play },
  { id: "community-guidelines", title: "Community Guidelines", desc: "Rules and policies to keep our community safe.", icon: FileText },
  { id: "faqs", title: "FAQs", desc: "Frequently asked questions and quick answers.", icon: CircleQuestion },
]

export function HelpCenterView({ onBack, onNavigate }: { onBack?: () => void, onNavigate?: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl pt-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <Icon icon="gravity-ui:chevron-left" className="size-5 text-[#0a0a0a] dark:text-white" />
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Help Center</h1>
        </div>
      </div>
      
      {/* SEARCH BAR & HISTORY BUTTON */}
      <div className="mb-10 flex flex-col sm:flex-row items-center gap-4 w-full">
        <div className="relative w-full flex-1">
          <Magnifier className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#a1a1aa]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-xl bg-[#f4f4f5] pl-10 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none transition-colors focus:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-white dark:focus:bg-[#27272a]"
          />
        </div>
        
        <div className="flex items-center rounded-xl bg-[#f4f4f5] dark:bg-[#1f1f1f] shrink-0 overflow-hidden self-stretch">
          <button
            onClick={() => onNavigate && onNavigate("my-tickets")}
            className="flex items-center justify-center gap-2 h-10 px-4 text-[13px] font-medium transition-all whitespace-nowrap text-[#737373] dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white"
            aria-label="History"
          >
            <ClockArrowRotateLeft className="size-4 shrink-0" />
            <span className="hidden sm:inline">Ticket History</span>
          </button>
        </div>
      </div>
      
      {/* SHORTCUTS GRID */}
      <h3 className="text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white mb-6">Popular Topics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHORTCUTS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate && onNavigate(item.id)}
            className="flex flex-col items-start p-5 text-left rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa]/50 dark:bg-[#0a0a0a] hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] hover:border-[#d4d4d8] dark:hover:border-[#3f3f46] transition-all duration-300 group shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-none"
          >
            <div className="mb-4 text-[#0a0a0a] dark:text-white group-hover:scale-105 transition-transform duration-200">
              <item.icon className="size-6" />
            </div>
            <h4 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white mb-1.5 leading-tight">{item.title}</h4>
            <p className="text-[14px] text-[#737373] dark:text-[#a1a1aa] leading-snug">{item.desc}</p>
          </button>
        ))}
      </div>

    </div>
  )
}
