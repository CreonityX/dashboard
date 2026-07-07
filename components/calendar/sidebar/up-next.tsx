"use client"

import React from "react"
import { getUpcomingEvents, EVENT_TYPE_CONFIG } from "@/lib/calendar-data"
import { EventPopover } from "../event-popover"
import { useAgendaContext } from "../agenda/agenda-context"
import { Typography } from "@heroui/react"
import { cn } from "@/lib/utils"

export function UpNext() {
  const { selectedEventId, setSelectedEventId } = useAgendaContext()
  
  // Get next 3 upcoming non-task events
  const events = getUpcomingEvents(30)
    .filter(e => e.type !== "personal")
    .slice(0, 3)

  if (events.length === 0) return null

  return (
    <div className="flex flex-col gap-3 mt-2 shrink-0">
      <Typography type="h6" className="font-semibold text-[#0a0a0a] dark:text-white mb-1">Up Next</Typography>
      <div className="flex flex-col gap-2">
        {events.map(event => {
          const config = EVENT_TYPE_CONFIG[event.type]
          const isSelected = selectedEventId === event.id

          return (
            <EventPopover key={event.id} event={event}>
              <button
                type="button"
                onMouseEnter={() => setSelectedEventId(event.id)}
                onMouseLeave={() => setSelectedEventId(null)}
                className={cn(
                  "w-full rounded-lg text-left overflow-hidden transition-all duration-200 border",
                  isSelected 
                    ? "ring-2 ring-[#0a0a0a]/20 dark:ring-white/20 ring-offset-1 border-transparent shadow-sm" 
                    : "hover:brightness-95 dark:hover:brightness-110 border-transparent hover:border-[#efefef] dark:hover:border-[#27272a]"
                )}
                style={{
                  backgroundColor: `${config.color}15`, // approx 8% opacity
                  borderLeft: `4px solid ${config.color}`
                }}
              >
                <div className="px-3 py-2.5 flex flex-col h-full">
                  <Typography type="body-sm" className="font-semibold leading-tight text-[#0a0a0a] dark:text-gray-100 line-clamp-1 mb-0.5">
                    {event.title}
                  </Typography>
                  <Typography type="body-xs" className="flex items-center gap-1.5 font-medium text-gray-500 dark:text-gray-400">
                    <span style={{ color: config.color }}>{config.label}</span>
                    <span>•</span>
                    <span>
                      {event.allDay 
                        ? "All day" 
                        : `${event.startTime} - ${event.endTime}`
                      }
                    </span>
                  </Typography>
                </div>
              </button>
            </EventPopover>
          )
        })}
      </div>
    </div>
  )
}
