"use client"

import { useState } from "react"
import { Dropdown, Button, Typography } from "@heroui/react"
import { CalendarEvent, EventType, calendarEvents } from "@/lib/calendar-data"
import { MiniCalendar } from "./mini-calendar"
import { UpNext } from "./sidebar/up-next"
import { TodoList } from "./sidebar/todo-list"
import { ChevronDown, Plus, ChevronLeft } from "lucide-react"
import { CircleCheck, CircleCheckFill } from "@gravity-ui/icons"

// Agenda components
import { useAgenda } from "./agenda/use-agenda"
import { Agenda } from "./agenda/agenda"
import { AgendaHeader, AgendaHeading, AgendaViewSelector, AgendaNavigation, AgendaNavButton, AgendaTodayButton } from "./agenda/agenda-header"
import { AgendaBody } from "./agenda/agenda-body"
import { AgendaWeekView } from "./agenda/agenda-week-view"
import { AgendaMonthView } from "./agenda/agenda-month-view"
import { AgendaDayView } from "./agenda/agenda-day-view"

const ALL_TYPES = Object.keys({ post: 1, campaign: 1, deadline: 1, meeting: 1, shoot: 1, review: 1, personal: 1 }) as EventType[]

export function CalendarApp() {
  const [activeTypes, setActiveTypes] = useState<EventType[]>(ALL_TYPES)

  const [isMobileMiniCalOpen, setIsMobileMiniCalOpen] = useState(false)
  const [isMobileTasksOpen, setIsMobileTasksOpen] = useState(false)

  const filteredEvents = calendarEvents.filter(e => activeTypes.includes(e.type))

  const agenda = useAgenda({
    events: filteredEvents,
    defaultView: "week",
    onDayClick: (dateStr) => {
      // Create a draft event when clicking a day on the grid
      agenda.setDraftEvent({
        id: "draft",
        title: "",
        type: "post",
        date: dateStr,
        startTime: "09:00",
        endTime: "10:00",
        allDay: false
      })
    }
  })

  return (
    <>
      <Agenda {...agenda} className="flex-row w-full">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-[300px] shrink-0 flex-col gap-6 px-5 pt-6 pb-6 bg-white dark:bg-[#0a0a0a] h-full">
          <div className="flex justify-between items-center h-[32px] shrink-0">
            <Typography type="h3" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">Calendar</Typography>
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger>
                <div 
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:opacity-80 transition-opacity"
                >
                  <Plus className="h-5 w-5" />
                </div>
              </Dropdown.Trigger>
              <Dropdown.Popover className="min-w-[160px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                <Dropdown.Menu 
                  onAction={(key) => {
                    const todayStr = new Date().toISOString().split("T")[0]
                    const currentHour = new Date().getHours()
                    const startStr = `${String(currentHour).padStart(2, "0")}:00`
                    const endStr = `${String(currentHour + 1).padStart(2, "0")}:00`
                    
                    agenda.setDraftEvent({
                      id: "draft",
                      title: "",
                      type: key === "event" ? "post" : "personal",
                      date: todayStr,
                      startTime: startStr,
                      endTime: endStr,
                      allDay: false
                    })
                  }}
                  className="p-1"
                >
                  <Dropdown.Item id="event" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                    Event
                  </Dropdown.Item>
                  <Dropdown.Item id="task" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                    Task
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
          <div className="shrink-0">
            <MiniCalendar value={agenda.currentDate} onChange={agenda.setCurrentDate} />
          </div>
          <div className="flex flex-col flex-1 min-h-0 gap-2">
            <UpNext />
            <TodoList />
          </div>
        </aside>

          {/* Main Panel */}
          <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-[#0a0a0a] pt-4 px-4 pb-0 lg:p-6 lg:pl-0 relative">
            <AgendaHeader className="flex-col md:flex-row items-stretch md:items-center justify-between">
              <div className="flex w-full items-center justify-between md:w-auto">
                {isMobileTasksOpen ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsMobileTasksOpen(false)} className="md:hidden flex items-center justify-center p-1 -ml-1">
                      <ChevronLeft className="w-7 h-7 text-[#0a0a0a] dark:text-white" />
                    </button>
                    <Typography type="h3" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">
                      To Do
                    </Typography>
                  </div>
                ) : (
                  <button 
                    className="flex flex-col items-start md:block text-left"
                    onClick={() => setIsMobileMiniCalOpen(!isMobileMiniCalOpen)}
                  >
                    <Typography type="h3" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center gap-2">
                      <span>{agenda.currentDate.toLocaleString("default", { month: "long" })}</span>
                      <span className="hidden md:inline text-[#0a0a0a] dark:text-white">
                        {agenda.currentDate.getFullYear()}
                      </span>
                      <ChevronDown className="h-6 w-6 md:hidden text-[#0a0a0a] dark:text-white" />
                    </Typography>
                  </button>
                )}
                {/* Mobile View Selector & Task */}
                <div className="flex items-center md:hidden gap-2">
                  {!isMobileTasksOpen && <AgendaViewSelector className="mr-0" />}
                  <Button 
                    isIconOnly 
                    variant="flat" 
                    className="h-10 w-10 min-w-0 bg-[#f4f4f5] dark:bg-[#27272a] text-[#0a0a0a] dark:text-white rounded-full flex items-center justify-center"
                    onPress={() => {
                      setIsMobileTasksOpen(!isMobileTasksOpen)
                      if (isMobileMiniCalOpen) setIsMobileMiniCalOpen(false)
                    }}
                  >
                    {isMobileTasksOpen ? <CircleCheckFill className="h-6 w-6" /> : <CircleCheck className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
              <div className="hidden md:flex items-center">
                <AgendaViewSelector />
                <AgendaNavigation>
                  <AgendaNavButton slot="previous" />
                  <AgendaTodayButton />
                  <AgendaNavButton slot="next" />
                </AgendaNavigation>
              </div>
            </AgendaHeader>

            {isMobileMiniCalOpen && (
              <div className="md:hidden pb-6 shrink-0 animate-in slide-in-from-top-2 flex w-full">
                <div className="w-full max-w-full">
                  <MiniCalendar value={agenda.currentDate} onChange={(d) => { agenda.setCurrentDate(d); setIsMobileMiniCalOpen(false); }} />
                </div>
              </div>
            )}

            {isMobileTasksOpen && (
              <div className="md:hidden flex-1 overflow-y-auto -mx-4 px-4 pt-2 flex flex-col w-full animate-in fade-in">
                <TodoList isMobileFullScreen />
              </div>
            )}

            <AgendaBody className={isMobileTasksOpen ? "max-md:hidden" : ""}>
              {agenda.view === "day" && <AgendaDayView />}
              {agenda.view === "week" && <AgendaWeekView />}
              {agenda.view === "month" && <AgendaMonthView />}
            </AgendaBody>

            {/* Mobile Floating Action Button */}
            <div className="md:hidden absolute bottom-4 right-4 z-50">
              <Dropdown placement="top-end" backdrop="opaque" offset={16}>
                <Dropdown.Trigger>
                  <div 
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] shadow-lg hover:opacity-80 transition-opacity"
                  >
                    <Plus className="h-6 w-6" />
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Popover className="min-w-[160px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                <Dropdown.Menu 
                  onAction={(key) => {
                    const todayStr = new Date().toISOString().split("T")[0]
                    const currentHour = new Date().getHours()
                    const startStr = `${String(currentHour).padStart(2, "0")}:00`
                    const endStr = `${String(currentHour + 1).padStart(2, "0")}:00`
                    
                    agenda.setDraftEvent({
                      id: "draft",
                      title: "",
                      type: key === "event" ? "post" : "personal",
                      date: todayStr,
                      startTime: startStr,
                      endTime: endStr,
                      allDay: false
                    })
                  }}
                  className="p-1"
                >
                  <Dropdown.Item id="event" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                    Event
                  </Dropdown.Item>
                  <Dropdown.Item id="task" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[14px] font-medium text-[#0a0a0a] dark:text-white">
                    Task
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
            </div>
          </div>
      </Agenda>
    </>
  )
}
