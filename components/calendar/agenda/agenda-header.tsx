"use client"

import React from "react"
import { useAgendaContext, AgendaView } from "./agenda-context"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function AgendaHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex items-center pb-6 shrink-0 h-[32px] box-content", className)}>
      {children}
    </div>
  )
}

export function AgendaHeading({ className }: { className?: string }) {
  const { currentDate } = useAgendaContext()
  const monthName = currentDate.toLocaleString("default", { month: "long" })
  const year = currentDate.getFullYear()
  
  return (
    <h2 className={cn("text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white flex-1 leading-none", className)}>
      {monthName} {year}
    </h2>
  )
}

export function AgendaViewSelector({ className }: { className?: string }) {
  const { view, setView } = useAgendaContext()
  const views: AgendaView[] = ["day", "week", "month"]
  
  return (
    <div className={cn("flex items-center p-1 rounded-full bg-[#f4f4f5] dark:bg-[#27272a] mr-6", className)}>
      {views.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setView(v)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize",
            view === v 
              ? "bg-white text-[#0a0a0a] shadow-sm dark:bg-[#3f3f46] dark:text-white" 
              : "text-[#52525b] hover:text-[#0a0a0a] dark:text-[#a1a1aa] dark:hover:text-white"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

export function AgendaNavigation({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

export function AgendaNavButton({ slot, className }: { slot: "previous" | "next", className?: string }) {
  const { currentDate, setCurrentDate, view } = useAgendaContext()
  
  const handleNav = () => {
    const d = new Date(currentDate)
    const multiplier = slot === "next" ? 1 : -1
    
    if (view === "day") {
      d.setDate(d.getDate() + 1 * multiplier)
    } else if (view === "week") {
      d.setDate(d.getDate() + 7 * multiplier)
    } else {
      d.setMonth(d.getMonth() + 1 * multiplier)
    }
    setCurrentDate(d)
  }
  
  return (
    <button
      type="button"
      onClick={handleNav}
      className={cn("p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors", className)}
    >
      {slot === "previous" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
    </button>
  )
}

export function AgendaTodayButton({ className }: { className?: string }) {
  const { setCurrentDate } = useAgendaContext()
  
  return (
    <button
      type="button"
      onClick={() => setCurrentDate(new Date())}
      className={cn("px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 text-sm font-medium text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors", className)}
    >
      Today
    </button>
  )
}
