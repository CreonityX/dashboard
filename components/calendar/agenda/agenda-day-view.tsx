"use client"

import React, { useState } from "react"
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

function formatDateStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

export function AgendaDayView() {
  const { currentDate, events, draftEvent } = useAgendaContext()
  const [allDayCollapsed, setAllDayCollapsed] = useState(false)
  
  const allEvents = draftEvent ? [...events, draftEvent] : events

  const visibleDays = [currentDate]

  const allDayEvents = allEvents.filter(e => e.allDay)
  
  const allDayLayout = []
  let currentRow = 0
  
  for (const event of allDayEvents) {
    const startStr = event.date
    const endStr = event.endDate || startStr
    
    const dayStr = formatDateStr(currentDate)
    
    if (startStr <= dayStr && endStr >= dayStr) {
      allDayLayout.push({ event, colStart: 0, colSpan: 1, row: currentRow })
      currentRow++
    }
  }

  const collapsedContent = (
    <div className="text-center text-[12px] text-gray-500 dark:text-gray-400 font-medium h-full flex items-center justify-center border-l border-transparent">
      {allDayLayout.length > 0 ? `${allDayLayout.length} ${allDayLayout.length === 1 ? 'event' : 'events'}` : ""}
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AgendaWeekHeader visibleDays={visibleDays} />
      
      {allDayLayout.length > 0 && (
        <AgendaAllDaySection 
          isCollapsed={allDayCollapsed}
          onToggle={() => setAllDayCollapsed(!allDayCollapsed)}
          columns={1}
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

            return (
              <AgendaDayColumn key={di} date={day}>
                {dayEvents.map(event => {
                  const startMin = timeToMinutes(event.startTime!)
                  const endMin = event.endTime ? timeToMinutes(event.endTime) : startMin + 60
                  const top = startMin
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
