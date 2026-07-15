"use client"

import React, { useState, useEffect } from "react"
import { Popover, PopoverTrigger, PopoverContent, Button, Checkbox, Dropdown, Drawer, Typography } from "@heroui/react"
import { parseDate, parseTime } from "@internationalized/date"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { CustomTimePicker } from "@/components/ui/custom-time-picker"
import { CalendarEvent, EVENT_TYPE_CONFIG } from "@/lib/calendar-data"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { X, Clock, MapPin, AlignLeft, Users, Bell } from "lucide-react"
import { useAgendaContext } from "./agenda/agenda-context"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CreateEventPopoverProps {
  children: React.ReactNode
  event?: CalendarEvent
  allowAutoOpen?: boolean
  onSave?: (event: CalendarEvent) => void
}

function DateButton({ date, onChange }: { date: string, onChange: (d: string) => void }) {
  const [open, setOpen] = useState(false)
  let formatted = "Select date"
  if (date) {
    const [y, m, d] = date.split("-").map(Number)
    formatted = new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return (
    <Popover isOpen={open} onOpenChange={setOpen} placement="bottom-start">
      <PopoverTrigger>
        <button className="h-9 px-3 flex items-center whitespace-nowrap shrink-0 rounded-[10px] bg-[#f4f4f5] dark:bg-[#27272a] hover:bg-[#e4e4e7] dark:hover:bg-[#3f3f46] text-[13px] font-semibold text-[#0a0a0a] dark:text-white transition-colors">
          {formatted}
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border border-[#e4e4e7] dark:border-[#27272a] shadow-xl rounded-[20px] overflow-hidden">
        <CustomCalendar value={date} onChange={(d) => { onChange(d); setOpen(false); }} />
      </PopoverContent>
    </Popover>
  )
}

export function CreateEventPopover({ children, onSave = () => {} }: CreateEventPopoverProps) {
  const { draftEvent, setDraftEvent } = useAgendaContext()
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!draftEvent) return <>{children}</>

  // We are creating a new event, so we'll show a Popover with isOpen={true}
  // The trigger is the phantom block itself (children)

  const innerContent = (
    <>
        {/* Top Header Actions */}
        <div className="flex items-center justify-between p-2 rounded-t-2xl max-sm:rounded-none bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10 max-sm:bg-transparent max-sm:border-none">
          <div className="px-2 cursor-move max-sm:hidden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <Button isIconOnly variant="light" size="sm" onClick={() => setDraftEvent(null)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content Form */}
        <div className="flex flex-col p-5 gap-5">
          {/* Title Input */}
          <div className="flex items-start gap-3">
            <div className="w-5 flex justify-center shrink-0 pt-2.5">
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: EVENT_TYPE_CONFIG[draftEvent.type].color }} />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <input 
                autoFocus
                className="text-[20px] font-semibold bg-transparent outline-none border-b-2 border-transparent focus:border-[#3897f0] transition-colors pb-1 placeholder-gray-400 text-[#0a0a0a] dark:text-white"
                placeholder="Add title"
                value={draftEvent.title}
                onChange={e => setDraftEvent({ ...draftEvent, title: e.target.value })}
              />
              
              {/* Event/Task Toggle */}
              <div className="flex gap-2">
                <Button size="sm" variant={draftEvent.type === "post" ? "solid" : "light"} className={draftEvent.type === "post" ? "bg-[#e8f3ff] text-[#3897f0] font-medium" : "text-gray-600 font-medium"} onClick={() => setDraftEvent({ ...draftEvent, type: "post" })}>Event</Button>
                <Button size="sm" variant={draftEvent.type === "personal" ? "solid" : "light"} className={draftEvent.type === "personal" ? "bg-[#e8f3ff] text-[#3897f0] font-medium" : "text-gray-600 font-medium"} onClick={() => setDraftEvent({ ...draftEvent, type: "personal" })}>Task</Button>
              </div>
            </div>
          </div>

          {draftEvent.type === "post" ? (
            <>
              {/* Time Selector */}
              <div className="flex items-start gap-3">
                <div className="w-5 flex justify-center shrink-0 mt-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-1.5">
                    <DateButton 
                      date={draftEvent.date || ""} 
                      onChange={(val) => setDraftEvent({ ...draftEvent, date: val })} 
                    />

                    {!draftEvent.allDay && (
                      <div className="flex items-center gap-2">
                        <CustomTimePicker 
                          value={draftEvent.startTime || undefined}
                          onChange={(val) => setDraftEvent({ ...draftEvent, startTime: val })}
                          className="w-[100px]"
                        />
                        <span className="text-gray-500 font-bold">–</span>
                        <CustomTimePicker 
                          value={draftEvent.endTime || undefined}
                          onChange={(val) => setDraftEvent({ ...draftEvent, endTime: val })}
                          className="w-[100px]"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center text-[12px] text-gray-500">
                      <Dropdown placement="bottom-start">
                        <Dropdown.Trigger>
                          <button className="hover:bg-gray-100 dark:hover:bg-white/10 rounded px-1.5 py-0.5 transition-colors cursor-pointer -ml-1.5">
                            Time zone
                          </button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover className="w-[240px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                          <Dropdown.Menu className="p-1" onAction={(key) => console.log("Timezone selected:", key)}>
                            <Dropdown.Item id="gmt-8" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">Pacific Time (GMT-8)</Dropdown.Item>
                            <Dropdown.Item id="gmt-5" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">Eastern Time (GMT-5)</Dropdown.Item>
                            <Dropdown.Item id="gmt+0" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">London (GMT+0)</Dropdown.Item>
                            <Dropdown.Item id="gmt+5:30" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">India Standard Time (GMT+5:30)</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown.Popover>
                      </Dropdown>
                      <span className="ml-0.5">· Does not repeat</span>
                    </div>
                    
                    <Checkbox 
                      size="sm"
                      isSelected={draftEvent.allDay}
                      onChange={setDraftEvent.bind(null, { ...draftEvent, allDay: !draftEvent.allDay })}
                    >
                      <Checkbox.Content className="gap-2">
                        <Checkbox.Control className="size-4 rounded-[4px] border-gray-300">
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <span className="text-[12px] text-gray-600 dark:text-gray-300">All day</span>
                      </Checkbox.Content>
                    </Checkbox>
                  </div>
                </div>
              </div>

              {/* Quick Adds */}
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 flex justify-center shrink-0">
                  <Users className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
                <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Add guests</Typography>
              </div>

              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-5 flex justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
                <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Add location</Typography>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="w-5 flex justify-center shrink-0 mt-0.5">
                  <AlignLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
                <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Add description or attachments</Typography>
              </div>
            </>
          ) : (
            <>
              {/* Due Date & Time */}
              <div className="flex items-start gap-3">
                <div className="w-5 flex justify-center shrink-0 mt-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-1.5">
                    <DateButton 
                      date={draftEvent.date || ""} 
                      onChange={(val) => setDraftEvent({ ...draftEvent, date: val })} 
                    />

                    {!draftEvent.allDay && (
                      <CustomTimePicker 
                        value={draftEvent.startTime || undefined}
                        onChange={(val) => setDraftEvent({ ...draftEvent, startTime: val })}
                        className="w-[100px]"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center text-[12px] text-gray-500">
                      <span className="ml-0.5">Does not repeat</span>
                    </div>
                    
                    <Checkbox 
                      size="sm"
                      isSelected={draftEvent.allDay}
                      onChange={setDraftEvent.bind(null, { ...draftEvent, allDay: !draftEvent.allDay })}
                    >
                      <Checkbox.Content className="gap-2">
                        <Checkbox.Control className="size-4 rounded-[4px] border-gray-300">
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Typography type="body-xs" className="text-gray-600 dark:text-gray-300">All day</Typography>
                      </Checkbox.Content>
                    </Checkbox>
                  </div>
                </div>
              </div>

              {/* Reminder Selector */}
              <div className="flex items-center gap-3">
                <div className="w-5 flex justify-center shrink-0">
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <Dropdown placement="bottom-start">
                    <Dropdown.Trigger>
                      <button className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded px-1.5 py-1 transition-colors cursor-pointer -ml-1.5 w-full text-left">
                        <Typography type="body-sm" className="text-gray-600 dark:text-gray-300">{draftEvent.reminder || "Add notification"}</Typography>
                      </button>
                    </Dropdown.Trigger>
                    <Dropdown.Popover className="w-[200px] rounded-xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                      <Dropdown.Menu className="p-1" onAction={(key) => setDraftEvent({ ...draftEvent, reminder: key.toString() })}>
                        <Dropdown.Item id="5 minutes before" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">5 minutes before</Dropdown.Item>
                        <Dropdown.Item id="10 minutes before" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">10 minutes before</Dropdown.Item>
                        <Dropdown.Item id="1 hour before" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">1 hour before</Dropdown.Item>
                        <Dropdown.Item id="1 day before" className="rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 p-2 text-[13px] text-[#0a0a0a] dark:text-white">1 day before</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown.Popover>
                  </Dropdown>
                </div>
              </div>

              <div className="flex items-start gap-3 cursor-pointer group">
                <div className="w-5 flex justify-center shrink-0 mt-0.5">
                  <AlignLeft className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </div>
                <Typography type="body-sm" className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Add description</Typography>
              </div>
            </>
          )}

          <div className="flex items-start gap-3 cursor-pointer group pt-1">
            <div className="w-5 flex justify-center shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded-full bg-[#3897f0] shrink-0" />
            </div>
            <div className="flex flex-col">
              <Typography type="body-sm" className="text-[#0a0a0a] dark:text-white font-medium">Creonity User</Typography>
              <Typography type="body-xs" className="text-gray-500">Busy · Default visibility · Notify 30 minutes before</Typography>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <Button variant="light" size="sm" className="font-medium text-[#3897f0] hover:bg-[#3897f0]/10">
              More options
            </Button>
            <Button variant="solid" size="sm" className="bg-[#3897f0] text-white font-semibold shadow-md hover:bg-[#2d86df]" onClick={() => {
              onSave(draftEvent as CalendarEvent)
              setDraftEvent(null)
              toast.success("Event saved successfully")
            }}>
              Save
            </Button>
          </div>
        </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        {children}
        <Drawer 
          isOpen={true} 
          onOpenChange={(isOpen) => {
            if (!isOpen) setDraftEvent(null)
          }}
        >
          <Drawer.Backdrop>
            <Drawer.Content placement="bottom" className="!bottom-[65px]">
              <Drawer.Dialog className="bg-white dark:bg-[#0a0a0a] rounded-t-[20px] p-0 outline-none shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <Drawer.Handle className="mt-2 mb-1" />
                {innerContent}
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </>
    )
  }

  return (
    <Popover 
      isOpen={true} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setDraftEvent(null)
        }
      }}
      placement="right-start" 
      shouldFlip={true}
      offset={8} 
      shouldCloseOnInteractOutside={() => true}
    >
      <PopoverTrigger>
        {children}
      </PopoverTrigger>
      <PopoverContent className="p-0 rounded-2xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] w-[400px] outline-none">
        {innerContent}
      </PopoverContent>
    </Popover>
  )
}
