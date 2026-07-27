"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { useAgendaContext } from "./agenda-context"
import { 
  AgendaTimeGrid, 
  AgendaWeekHeader, 
  AgendaAllDaySection, 
  AgendaTimeAxis, 
  AgendaCurrentTimeIndicator, 
  AgendaDayColumn 
} from "./agenda-time-grid"
import { AgendaEvent, AgendaAllDayEvent } from "./agenda-event"
import { timeToMinutes } from "@/lib/calendar-data"

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateStr(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function AgendaWeekView() {
  const { currentDate, events, draftEvent } = useAgendaContext()
  const [allDayCollapsed, setAllDayCollapsed] = useState(false)
  
  const allEvents = draftEvent ? [...events, draftEvent] : events

  const monday = getMondayOfWeek(currentDate)
  const visibleDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const allDayEvents = allEvents.filter(e => e.allDay)
  
  // Compute basic all-day layout (simplified stacking for week view)
  const allDayLayout = []
  let currentRow = 0
  
  // Very simplified layout algorithm for all-day events across the week
  // Ideally, this uses a proper packing algorithm.
  for (const event of allDayEvents) {
    const startStr = event.date
    const endStr = event.endDate || startStr
    
    // Find column start and span relative to this week
    const weekStartStr = formatDateStr(visibleDays[0])
    const weekEndStr = formatDateStr(visibleDays[6])
    
    if (endStr < weekStartStr || startStr > weekEndStr) continue // Outside this week
    
    let colStart = 0
    let colSpan = 7
    
    for (let i = 0; i < 7; i++) {
      const dayStr = formatDateStr(visibleDays[i])
      if (dayStr === startStr) colStart = i
      if (dayStr === endStr) colSpan = i - colStart + 1
    }
    
    // Cap spans at boundaries
    if (startStr < weekStartStr) {
      colStart = 0
      // recompute colSpan based on end
      const endIdx = visibleDays.findIndex(d => formatDateStr(d) === endStr)
      colSpan = endIdx >= 0 ? endIdx + 1 : 7
    }
    if (endStr > weekEndStr) {
      colSpan = 7 - colStart
    }

    allDayLayout.push({ event, colStart, colSpan, row: currentRow })
    currentRow++ // just stack them vertically for simplicity
  }

  const allDayCounts = visibleDays.map(day => {
    const dayStr = formatDateStr(day)
    return allDayEvents.filter(e => {
      const startStr = e.date
      const endStr = e.endDate || startStr
      return dayStr >= startStr && dayStr <= endStr
    }).length
  })

  const collapsedContent = (
    <>
      {allDayCounts.map((count, i) => (
        <div key={i} className={cn("text-center text-[12px] text-gray-500 dark:text-gray-400 font-medium h-full flex items-center justify-center", i > 0 && "border-l border-gray-100 dark:border-white/10")}>
          {count > 0 ? `${count} ${count === 1 ? 'event' : 'events'}` : ""}
        </div>
      ))}
    </>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AgendaWeekHeader visibleDays={visibleDays} />
      
      {allDayLayout.length > 0 && (
        <AgendaAllDaySection 
          isCollapsed={allDayCollapsed}
          onToggle={() => setAllDayCollapsed(!allDayCollapsed)}
          columns={7}
          collapsedContent={collapsedContent}
        >
          {allDayLayout.map(item => (
            <AgendaAllDayEvent
              key={item.event.id}
              event={item.event}
              colStart={item.colStart}
              colSpan={item.colSpan}
              row={item.row}
            />
          ))}
        </AgendaAllDaySection>
      )}

      <AgendaTimeGrid>
        <AgendaTimeAxis />
        <div className="flex flex-1 relative">
          <AgendaCurrentTimeIndicator />
          {visibleDays.map((day, di) => {
            const dateStr = formatDateStr(day)
            const dayEvents = allEvents.filter(e => !e.allDay && e.date === dateStr && e.startTime)
            if (dayEvents.length > 0) {
              console.log("DAY EVENTS FOR", dateStr, dayEvents)
            }
            return (
              <AgendaDayColumn key={di} date={day}>
                {dayEvents.map(event => {
                  const startMin = timeToMinutes(event.startTime!)
                  const endMin = event.endTime ? timeToMinutes(event.endTime) : startMin + 60
                  const top = startMin // 1 min = 1px
                  const height = Math.max(endMin - startMin, 20)
                  
                  return (
                    <div key={event.id} style={{ position: "absolute", top, height, left: 0, right: 0, zIndex: 10 }}>
                      <AgendaEvent event={event} />
                    </div>
                  )
                })}
              </AgendaDayColumn>
            )
          })}
        </div>
      </AgendaTimeGrid>
    </div>
  )
}
