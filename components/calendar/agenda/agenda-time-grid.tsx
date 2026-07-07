"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useAgendaContext } from "./agenda-context"
import { Typography } from "@heroui/react"
import { ChevronDown, ChevronRight } from "lucide-react"

export function AgendaTimeGrid({ children, className }: { children: React.ReactNode, className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to current time roughly (minus 1 hour)
      const now = new Date()
      const startHour = 0 // In this implementation, we show 0-24
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const scrollTo = Math.max((currentMinutes - 60 - startHour * 60) / 60 * 60, 0) // 60px per hour
      scrollRef.current.scrollTop = scrollTo
    }
  }, [])

  return (
    <div ref={scrollRef} className={cn("flex-1 overflow-y-auto overflow-x-hidden relative", className)}>
      <div className="flex" style={{ height: `${24 * 60}px`, position: "relative" }}>
        {children}
      </div>
    </div>
  )
}

export function AgendaWeekHeader({ visibleDays, className }: { visibleDays: Date[], className?: string }) {
  const todayStr = new Date().toISOString().split("T")[0]
  
  const offset = new Date().getTimezoneOffset()
  const sign = offset > 0 ? "-" : "+"
  const absOffset = Math.abs(offset)
  const hours = Math.floor(absOffset / 60)
  const minutes = absOffset % 60
  const timeZoneStr = "GMT" + sign + hours + (minutes > 0 ? ":" + minutes : "")

  return (
    <div className={cn("flex border-b border-gray-100 dark:border-white/10 shrink-0", className)}>
      <div className="w-[58px] shrink-0 flex items-end justify-center pb-3">
        <Typography type="body-xs" className="font-semibold text-gray-400 dark:text-gray-500">{timeZoneStr}</Typography>
      </div>
      {visibleDays.map((day, i) => {
        const dateStr = day.toISOString().split("T")[0]
        const isToday = dateStr === todayStr
        const dayName = day.toLocaleString("en-US", { weekday: "short" })

        return (
          <div
            key={i}
            className={cn(
              "flex-1 py-3 text-center border-l border-gray-100 dark:border-white/10 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2",
              isToday && "bg-gray-50/50 dark:bg-white/[0.02]"
            )}
          >
            <Typography type="body-sm" className={cn(
              "font-semibold uppercase md:capitalize",
              isToday ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
            )}>
              {dayName}
            </Typography>
            <div className={cn(
              "w-7 h-7 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[16px] md:text-[13px] font-bold",
              isToday ? "bg-[#e8443a] text-white" : "text-gray-900 dark:text-gray-100"
            )}>
              {day.getDate()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface AgendaAllDaySectionProps {
  children?: React.ReactNode
  className?: string
  isCollapsed?: boolean
  onToggle?: () => void
  columns?: number
  collapsedContent?: React.ReactNode
}

export function AgendaAllDaySection({ children, className, isCollapsed, onToggle, columns = 7, collapsedContent }: AgendaAllDaySectionProps) {
  return (
    <div className={cn("flex border-b border-gray-100 dark:border-white/10 shrink-0", className)}>
      <div className="w-[58px] shrink-0 flex items-center justify-center border-r border-transparent">
        <button 
          onClick={onToggle}
          className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="flex-1 border-l border-gray-100 dark:border-white/10 relative p-1.5 min-h-[44px]">
        {isCollapsed && collapsedContent ? (
          <div className="grid h-full items-center" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {collapsedContent}
          </div>
        ) : (
          <div className="grid gap-1 relative" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function AgendaTimeAxis({ className }: { className?: string }) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i)
  
  return (
    <div className={cn("w-[58px] shrink-0 border-r border-gray-100 dark:border-white/10", className)}>
      {HOURS.map(h => (
        <div
          key={h}
          className="relative h-[60px]"
        >
          {h > 0 && (
            <Typography type="body-xs" className="absolute -top-[9px] right-2 font-medium text-gray-400">
              {h === 12 ? "12 PM" : h > 12 ? `${h - 12} PM` : `${h} AM`}
            </Typography>
          )}
        </div>
      ))}
    </div>
  )
}

export function AgendaCurrentTimeIndicator({ className }: { className?: string }) {
  const [currentMinutes, setCurrentMinutes] = useState(0)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes())
    }
    update()
    const timer = setInterval(update, 60000)
    return () => clearInterval(timer)
  }, [])

  const top = currentMinutes // 1px = 1 min
  const now = new Date()
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <div
      className={cn("absolute left-0 right-0 z-20 pointer-events-none flex items-center", className)}
      style={{ top: `${top}px` }}
    >
      <div className="w-[58px] flex justify-end pr-1">
        <div className="bg-[#e8443a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full -mt-2">
          {timeStr}
        </div>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-[#e8443a] -ml-[3px]" />
      <div className="flex-1 h-px bg-[#e8443a]" />
    </div>
  )
}

export function AgendaDayColumn({ date, children, className }: { date: Date, children: React.ReactNode, className?: string }) {
  const { setDraftEvent } = useAgendaContext()
  const todayStr = new Date().toISOString().split("T")[0]
  const dateStr = date.toISOString().split("T")[0]
  const isToday = dateStr === todayStr
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  
  const HOURS = Array.from({ length: 24 }, (_, i) => i)

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return

    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const hour = Math.floor(y / 60)
    
    const startStr = `${String(hour).padStart(2, "0")}:00`
    const endStr = `${String(hour + 1).padStart(2, "0")}:00`
    
    setDraftEvent({
      id: "draft",
      title: "",
      type: "post",
      date: dateStr,
      startTime: startStr,
      endTime: endStr,
      allDay: false
    })
  }

  return (
    <div
      onClick={handleGridClick}
      className={cn(
        "flex-1 border-l border-gray-100 dark:border-white/10 relative",
        isWeekend && "bg-gray-50/30 dark:bg-white/[0.01]",
        isToday && "bg-[#e8443a]/[0.02]", // Subtle tint for today
        className
      )}
    >
      {/* Hour lines */}
      {HOURS.map(h => (
        <div
          key={h}
          className="absolute left-0 right-0 border-t border-gray-100 dark:border-white/10 h-[60px]"
          style={{ top: `${h * 60}px` }}
        />
      ))}
      {children}
    </div>
  )
}
