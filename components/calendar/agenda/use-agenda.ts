import { useState } from "react"
import { CalendarEvent } from "@/lib/calendar-data"
import { AgendaView } from "./agenda-context"

interface UseAgendaProps {
  events: CalendarEvent[]
  defaultView?: AgendaView
  defaultDate?: Date
  onEventClick?: (event: CalendarEvent) => void
  onDayClick?: (date: string) => void
}

export function useAgenda({
  events,
  defaultView = "week",
  defaultDate,
  onEventClick,
  onDayClick
}: UseAgendaProps) {
  const [view, setView] = useState<AgendaView>(defaultView)
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate || new Date())
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [draftEvent, setDraftEvent] = useState<CalendarEvent | null>(null)

  return {
    view,
    setView,
    currentDate,
    setCurrentDate,
    events,
    draftEvent,
    setDraftEvent,
    selectedEventId,
    setSelectedEventId,
    onEventClick,
    onDayClick
  }
}
