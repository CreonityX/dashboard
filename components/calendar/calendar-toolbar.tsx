"use client"

import { ChevronLeft, ChevronRight, Plus } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"

type View = "month" | "week" | "agenda"

interface CalendarToolbarProps {
  view: View
  onViewChange: (v: View) => void
  currentDate: Date
  onNavigate: (dir: "prev" | "next" | "today") => void
  onNewEvent: () => void
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getWeekTitle(date: Date): string {
  const monday = new Date(date)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(date.getDate() + diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const mMonth = SHORT_MONTHS[monday.getMonth()]
  const sMonth = SHORT_MONTHS[sunday.getMonth()]
  const mDay = monday.getDate()
  const sDay = sunday.getDate()
  const mYear = monday.getFullYear()
  const sYear = sunday.getFullYear()

  if (mYear !== sYear) {
    return `${mMonth} ${mDay}, ${mYear} \u2013 ${sMonth} ${sDay}, ${sYear}`
  }
  if (monday.getMonth() !== sunday.getMonth()) {
    return `${mMonth} ${mDay} \u2013 ${sMonth} ${sDay}, ${sYear}`
  }
  return `${mMonth} ${mDay} \u2013 ${sDay}, ${sYear}`
}

function getPeriodTitle(view: View, date: Date): string {
  if (view === "month") return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
  if (view === "week") return getWeekTitle(date)
  return "Upcoming"
}

export function CalendarToolbar({ view, onViewChange, currentDate, onNavigate, onNewEvent }: CalendarToolbarProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/8 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
      {/* LEFT: Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate("prev")}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={() => onNavigate("today")}
          className="px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-white/12 hover:bg-gray-100 dark:hover:bg-white/8 transition-colors text-gray-700 dark:text-gray-200"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate("next")}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* CENTER: Period title */}
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 absolute left-1/2 -translate-x-1/2">
        {getPeriodTitle(view, currentDate)}
      </h2>

      {/* RIGHT: View toggle + New Event */}
      <div className="flex items-center gap-2">
        {/* Segmented view toggle */}
        <div className="flex items-center rounded-lg border border-gray-200 dark:border-white/12 overflow-hidden">
          {(["month", "week", "agenda"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                view === v
                  ? "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a]"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
              )}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* New Event button */}
        <button
          onClick={onNewEvent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3897f0] hover:bg-[#2d86df] text-white text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Event
        </button>
      </div>
    </div>
  )
}
