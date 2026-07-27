"use client"

import React from "react"
import { CalendarEvent, EVENT_TYPE_CONFIG } from "@/lib/calendar-data"
import { cn } from "@/lib/utils"
import { useAgendaContext } from "./agenda-context"
import { Typography } from "@heroui/react"
import { EventPopover } from "../event-popover"
import { CreateEventPopover } from "../create-event-popover"



import { Lock } from "lucide-react"

interface AgendaEventProps {
  event: CalendarEvent
  className?: string
}

export function AgendaEvent({ event, className }: AgendaEventProps) {
  const { selectedEventId, onEventSave } = useAgendaContext()
  const isSelected = selectedEventId === event.id
  
  const config = EVENT_TYPE_CONFIG[event.type]
  const color = config.color
  
  const PopoverWrapper = event.id === "draft" ? CreateEventPopover : EventPopover
  const notInvited = event.notInvited
  
  return (
    <PopoverWrapper event={event} allowAutoOpen={true} onSave={onEventSave}>
      <button
        type="button"
        className={cn(
          "absolute inset-0 mx-1 rounded-md text-left overflow-hidden group transition-colors",
          isSelected ? "ring-2 ring-black dark:ring-white ring-offset-1" : "hover:brightness-95 dark:hover:brightness-110",
          notInvited && "opacity-70",
          className
        )}
        style={notInvited ? {
          backgroundColor: "transparent",
          backgroundImage: `repeating-linear-gradient(45deg, ${color}10, ${color}10 10px, transparent 10px, transparent 20px)`,
          border: `1px dashed ${color}60`,
          borderLeft: `3px solid ${color}80`
        } : {
          backgroundColor: `${color}1A`, // 10% opacity
          borderLeft: `3px solid ${color}`
        }}
      >
        <div className="px-2 py-1 flex flex-col h-full">
          <Typography type="body-xs" className="font-semibold leading-tight text-gray-900 dark:text-gray-100 line-clamp-1 flex items-center gap-1">
            {event.title}
            {notInvited && <Lock className="w-3 h-3 text-gray-500 shrink-0" />}
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
  const { onEventSave } = useAgendaContext()
  const config = EVENT_TYPE_CONFIG[event.type]
  const color = config.color
  
  const PopoverWrapper = event.id === "draft" ? CreateEventPopover : EventPopover
  const notInvited = event.notInvited

  return (
    <PopoverWrapper event={event} allowAutoOpen={true} onSave={onEventSave}>
      <button
        type="button"
        className={cn(
          "rounded-md text-left overflow-hidden transition-transform hover:scale-[1.02] flex items-center px-2 py-1 text-white gap-1",
          notInvited && "opacity-70",
          className
        )}
        style={notInvited ? {
          gridColumn: `${colStart + 1} / span ${colSpan}`,
          gridRow: `${row + 1}`,
          backgroundColor: "transparent",
          backgroundImage: `repeating-linear-gradient(45deg, ${color}33, ${color}33 10px, transparent 10px, transparent 20px)`,
          border: `1px dashed ${color}`,
          color: color,
        } : {
          gridColumn: `${colStart + 1} / span ${colSpan}`,
          gridRow: `${row + 1}`,
          backgroundColor: color
        }}
      >
        <span className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex-1">
          {event.title}
        </span>
        {notInvited && <Lock className="w-3 h-3 shrink-0" style={{ color: color }} />}
      </button>
    </PopoverWrapper>
  )
}
