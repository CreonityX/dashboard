import { createContext, useContext } from "react"
import { CalendarEvent } from "@/lib/calendar-data"

export type AgendaView = "day" | "week" | "month"

export interface AgendaState {
  view: AgendaView
  setView: (view: AgendaView) => void
  currentDate: Date
  setCurrentDate: (date: Date) => void
  events: CalendarEvent[]
  draftEvent: CalendarEvent | null
  setDraftEvent: (event: CalendarEvent | null) => void
  selectedEventId: string | null
  setSelectedEventId: (id: string | null) => void
  onEventClick?: (event: CalendarEvent) => void
  onDayClick?: (date: string) => void
}

export const AgendaContext = createContext<AgendaState | null>(null)

export function useAgendaContext() {
  const context = useContext(AgendaContext)
  if (!context) {
    throw new Error("useAgendaContext must be used within an Agenda provider")
  }
  return context
}
