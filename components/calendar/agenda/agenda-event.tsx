"use client"

import React from "react"
import { CalendarEvent, EVENT_TYPE_CONFIG } from "@/lib/calendar-data"
import { cn } from "@/lib/utils"
import { useAgendaContext } from "./agenda-context"
import { Typography } from "@heroui/react"
import { EventPopover } from "../event-popover"
import { CreateEventPopover } from "../create-event-popover"



interface AgendaEventProps {
  event: CalendarEvent
  className?: string
}

export function AgendaEvent({ event, className }: AgendaEventProps) {
  const { selectedEventId } = useAgendaContext()
  const isSelected = selectedEventId === event.id
  
  const config = EVENT_TYPE_CONFIG[event.type]
  const color = config.color
  
  const PopoverWrapper = event.id === "draft" ? CreateEventPopover : EventPopover
  
  return (
    <PopoverWrapper event={event} allowAutoOpen={true}>
      <button
        type="button"
        className={cn(
          "absolute inset-x-0 mx-1 rounded-md text-left overflow-hidden group transition-colors",
          isSelected ? "ring-2 ring-black dark:ring-white ring-offset-1" : "hover:brightness-95 dark:hover:brightness-110",
          className
        )}
        style={{
          backgroundColor: `${color}1A`, // 10% opacity
          borderLeft: `3px solid ${color}`
        }}
      >
        <div className="px-2 py-1 flex flex-col h-full">
          <Typography type="body-xs" className="font-semibold leading-tight text-gray-900 dark:text-gray-100 line-clamp-1">
            {event.title}
          </Typography>
          <Typography type="body-xs" className="text-gray-600 dark:text-gray-400 mt-0.5 whitespace-nowrap">
            {event.startTime} - {event.endTime}
          </Typography>
        </div>
      </button>
    </PopoverWrapper>
  )
}

export function AgendaAllDayEvent({ event, colStart, colSpan, row, className }: { event: CalendarEvent, colStart: number, colSpan: number, row: number, className?: string }) {
  const config = EVENT_TYPE_CONFIG[event.type]
  const color = config.color
  
  const PopoverWrapper = event.id === "draft" ? CreateEventPopover : EventPopover

  return (
    <PopoverWrapper event={event} allowAutoOpen={true}>
      <button
        type="button"
        className={cn(
          "rounded-md text-left overflow-hidden transition-transform hover:scale-[1.02] flex items-center px-2 py-1 text-white",
          className
        )}
        style={{
          gridColumn: `${colStart + 1} / span ${colSpan}`,
          gridRow: `${row + 1}`,
          backgroundColor: color
        }}
      >
        <span className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {event.title}
        </span>
      </button>
    </PopoverWrapper>
  )
}
