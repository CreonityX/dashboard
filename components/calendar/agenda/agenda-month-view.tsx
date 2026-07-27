"use client"

import React from "react"
import { useAgendaContext } from "./agenda-context"
import { Typography } from "@heroui/react"
import { cn } from "@/lib/utils"

function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days: Date[] = []
  
  // Padding start
  const startPadding = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Start on Monday
  for (let i = startPadding; i > 0; i--) {
    days.push(new Date(year, month, 1 - i))
  }
  
  // Month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i))
  }
  
  // Padding end
  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
}

export function AgendaMonthView() {
  const { currentDate, events, onEventClick } = useAgendaContext()
  const d = new Date()
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const currentMonth = currentDate.getMonth()

  const days = getDaysInMonth(currentDate)
  const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/10 shrink-0">
        {DAY_NAMES.map(name => (
          <div key={name} className="py-2 text-center text-[12px] font-semibold text-gray-500 uppercase">
            {name}
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr overflow-y-auto">
        {days.map((day, i) => {
          const yyyy = day.getFullYear()
          const mm = String(day.getMonth() + 1).padStart(2, '0')
          const dd = String(day.getDate()).padStart(2, '0')
          const dateStr = `${yyyy}-${mm}-${dd}`
          const isCurrentMonth = day.getMonth() === currentMonth
          const isToday = dateStr === todayStr
          
          const dayEvents = events.filter(e => e.date === dateStr || (e.multiDay && e.endDate && dateStr >= e.date && dateStr <= e.endDate))
          
          return (
            <div 
              key={i} 
              className={cn(
                "border-r border-b border-gray-100 dark:border-white/10 p-1 flex flex-col gap-1 min-h-[100px]",
                !isCurrentMonth && "bg-gray-50/50 dark:bg-white/[0.02]"
              )}
            >
              <div className="flex justify-end p-1">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold",
                  isToday 
                    ? "bg-[#e8443a] text-white" 
                    : isCurrentMonth 
                      ? "text-gray-900 dark:text-gray-100" 
                      : "text-gray-400"
                )}>
                  {day.getDate()}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col gap-1">
                {dayEvents.slice(0, 3).map(event => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      "w-full text-left px-1.5 py-1 rounded-[4px] text-[10px] truncate transition-colors",
                      event.allDay 
                        ? "font-semibold text-white hover:brightness-110" 
                        : "font-medium text-gray-900 dark:text-gray-100 hover:brightness-95 dark:hover:brightness-110"
                    )}
                    style={{ 
                      backgroundColor: event.allDay ? (event.color || "#3897f0") : `${event.color || "#3897f0"}1A`,
                      borderLeft: event.allDay ? undefined : `3px solid ${event.color || "#3897f0"}`
                    }}
                  >
                    {event.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <Typography type="body-xs" className="text-gray-500 font-medium px-1">
                    +{dayEvents.length - 3} more
                  </Typography>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
