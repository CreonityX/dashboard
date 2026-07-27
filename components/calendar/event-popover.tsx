"use client"

import React, { useState, useRef } from "react"
import { Popover, PopoverTrigger, PopoverContent, Button, Drawer, Typography } from "@heroui/react"
import { CalendarEvent, EVENT_TYPE_CONFIG, formatDisplayDate, formatTime } from "@/lib/calendar-data"
import { Bell, Link as LinkIcon, Edit2, Trash2, Mail, MoreVertical, Calendar as CalendarIcon, AlignLeft, X } from "lucide-react"
import { toast } from "sonner"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSearchParams } from "next/navigation"
import { useAgendaContext } from "./agenda/agenda-context"

interface EventPopoverProps {
  event: CalendarEvent
  children: React.ReactNode
  allowAutoOpen?: boolean
  disableHover?: boolean
  onSave?: (event: CalendarEvent) => void
}

export function EventPopover({ event, children, allowAutoOpen = false }: EventPopoverProps) {
  const { onEventDelete, onWorkflowAction } = useAgendaContext()
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const searchParams = useSearchParams()
  const isTargetEvent = searchParams?.get("eventId") === event.id

  React.useEffect(() => {
    if (allowAutoOpen && isTargetEvent) {
      const t = setTimeout(() => setIsOpen(true), 300)
      return () => clearTimeout(t)
    }
  }, [allowAutoOpen, isTargetEvent])
  const config = EVENT_TYPE_CONFIG[event.type]

  // e.g. "Mon, Jun 29"
  const dateStr = formatDisplayDate(event.date)
  const timeStr = event.allDay
    ? ""
    : ` · ${formatTime(event.startTime!)} – ${event.endTime ? formatTime(event.endTime) : ""}`

  const innerContent = (
      <div className="flex flex-col h-full bg-white dark:bg-[#1c1c1e] rounded-2xl max-sm:rounded-none">
        {/* Content */}
        <div className="flex flex-col gap-3 p-5 pb-4">
          {/* Title and Dot */}
          <div className="flex items-start gap-3">
            <div className="w-5 flex justify-center shrink-0 pt-1.5">
              <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: config.color }} />
            </div>
            <div className="flex flex-col gap-0.5">
              <Typography type="h5" className="font-semibold text-[#0a0a0a] dark:text-white leading-snug">
                {event.title}
              </Typography>
              <Typography type="body-sm" className="text-[#52525b] dark:text-[#a1a1aa]">
                {dateStr}{timeStr}
              </Typography>
            </div>
          </div>

          {/* Join / Invite link */}
          <div className="flex items-center gap-3">
            <div className="w-5 flex justify-center shrink-0" />
            <Button size="sm" variant="bordered" className="border-gray-200 dark:border-[#27272a] rounded-full h-8 px-4 font-medium text-[13px] text-[#0a0a0a] dark:text-white">
              <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
              Invite via link
            </Button>
          </div>

          {/* Notification */}
          <div className="flex items-center gap-3">
            <div className="w-5 flex justify-center shrink-0">
              <Bell className="w-4 h-4 text-gray-500" />
            </div>
            <Typography type="body-sm" className="text-[#52525b] dark:text-[#a1a1aa]">
              30 minutes before
            </Typography>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-3">
            <div className="w-5 flex justify-center shrink-0">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
            </div>
            <Typography type="body-sm" className="text-[#52525b] dark:text-[#a1a1aa]">
              {event.creator ? `Creator · ${event.creator}` : event.campaign ? `Campaign · ${event.campaign}` : event.brand || "Creonity User"}
            </Typography>
          </div>
          {(event.type === "approval" || event.type === "payment") && (
            <div className="ml-8 flex gap-2">
              {event.type === "approval" ? <><Button size="sm" onPress={() => { onWorkflowAction?.(event, "approved"); toast.success("Deliverable approved") }}>Approve</Button><Button size="sm" variant="outline" onPress={() => { onWorkflowAction?.(event, "changes_requested"); toast.info("Changes requested") }}>Request changes</Button></> : <Button size="sm" onPress={() => { onWorkflowAction?.(event, "payment_scheduled"); toast.success("Payment scheduled") }}>Schedule payment</Button>}
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="flex items-start gap-3 pt-1">
              <div className="w-5 flex justify-center shrink-0 mt-0.5">
                <AlignLeft className="w-4 h-4 text-gray-500" />
              </div>
              <Typography type="body-sm" className="text-[#52525b] dark:text-[#a1a1aa] leading-relaxed">
                {event.description}
              </Typography>
            </div>
          )}
        </div>

        {/* Bottom actions bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-b-2xl max-sm:rounded-none mt-auto">
          <div className="flex sm:hidden">
            <Button isIconOnly variant="light" size="sm" onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-1 justify-end ml-auto">
            <Button isIconOnly variant="light" size="sm" onClick={() => { setIsOpen(false); toast.info("Opening editor...") }} className="text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button isIconOnly variant="light" size="sm" onClick={() => { setIsOpen(false); onEventDelete?.(event.id); toast.success("Event deleted") }} className="text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button isIconOnly variant="light" size="sm" onClick={() => toast.success("Email drafted to participants")} className="text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full">
              <Mail className="w-4 h-4" />
            </Button>
            <Button isIconOnly variant="light" size="sm" className="text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
  )

  if (isMobile) {
    return (
      <>
        <div onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}>{children}</div>
        <Drawer isOpen={isOpen} onOpenChange={setIsOpen}>
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
    <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement="right-start" shouldFlip={true} offset={8} shouldCloseOnInteractOutside={() => true} triggerScaleOnOpen={false}>
      <PopoverTrigger>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >{children}</div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 rounded-2xl shadow-xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] w-[360px] outline-none"
      >
        {innerContent}
      </PopoverContent>
    </Popover>
  )
}
