"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Popover, PopoverTrigger, PopoverContent, ListBox, Button } from "@heroui/react"
import { toast } from "@heroui/react"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { CustomTimePicker } from "@/components/ui/custom-time-picker"
import {
  PlayFill,
  FileText,
  Folder,
  ArrowDownToLine,
  ArrowUpRightFromSquare,
  CircleCheckFill,
  Briefcase,
  HardDrive,
  ChevronsExpandVertical,
  Check,
  Xmark,
  ArrowRotateLeft,
  EllipsisVertical,
  TrashBin,
  Pencil,
  ShieldExclamation,
  ArrowUturnCcwLeft
} from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import type { Message } from "@/lib/messages-data"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { MediaViewer } from "@/components/media/media-viewer"

// ─── Design tokens ────────────────────────────────────────────────────────────
// Light:  mine = black, them = light gray
// Dark:   mine = blue (#2563eb), them = dark gray (#27272a)
const bubble = {
  mine: "bg-[#0a0a0a] text-white dark:bg-[#2563eb] dark:text-white",
  them: "bg-[#f4f4f5] text-[#0a0a0a] dark:bg-[#27272a] dark:text-white",
}

const cardShell = {
  mine: "bg-[#0a0a0a] text-white dark:bg-[#1d4ed8] dark:text-white",
  them: "bg-[#f4f4f5] text-[#0a0a0a] dark:bg-[#27272a] dark:text-white",
}

const cardInner = {
  mine: "bg-[#1f1f1f] dark:bg-[#1a40a8]",
  them: "bg-white dark:bg-[#3f3f46]",
}

const subText = {
  mine: "text-white/60 dark:text-white/60",
  them: "text-[#737373] dark:text-white/50",
}

// ─── Primitives ───────────────────────────────────────────────────────────────
function ReplySnippet({ replyTo }: { replyTo: any }) {
  if (!replyTo) return null

  // Decide what text to show as snippet
  let snippet = "Attachment"
  if (replyTo.kind === "text") snippet = replyTo.text
  else if (replyTo.kind === "image") snippet = "Photo"
  else if (replyTo.kind === "video") snippet = "Video"
  else if (replyTo.kind === "file") snippet = replyTo.name
  else if (replyTo.kind === "folder") snippet = "Folder"
  else if (replyTo.kind === "link") snippet = replyTo.title
  else if (replyTo.kind === "booking") snippet = "Booking Request"
  else if (replyTo.kind === "deal") snippet = "Brand Deal"
  else if (replyTo.kind === "review") snippet = "Content review"

  return (
    <div className="mb-1.5 flex flex-col overflow-hidden rounded-[8px] bg-black/5 dark:bg-black/20 pl-2.5 pr-3 py-1.5 border-l-2 border-[#a1a1aa] dark:border-[#737373]">
      <span className="text-[11px] font-bold opacity-80 leading-tight">
        {replyTo.sender === "me" ? "You" : (replyTo.senderName || "Unknown")}
      </span>
      <span className="text-[12px] opacity-70 truncate leading-tight mt-0.5">
        {snippet}
      </span>
    </div>
  )
}

function Bubble({ mine, message, children }: { mine: boolean; message?: any; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col rounded-3xl px-4 py-2.5 text-[15px] leading-relaxed max-w-[340px]", mine ? bubble.mine : bubble.them)}>
      {message?.replyTo && <ReplySnippet replyTo={message.replyTo} />}
      {children}
    </div>
  )
}

function CardShell({ mine, message, className, children }: { mine: boolean; message?: any; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("overflow-hidden rounded-[20px] max-w-[340px]", mine ? cardShell.mine : cardShell.them, className)}>
      {message?.replyTo && (
        <div className="px-3 pt-3 pb-1">
          <ReplySnippet replyTo={message.replyTo} />
        </div>
      )}
      {children}
    </div>
  )
}

// ─── Text ─────────────────────────────────────────────────────────────────────
function TextBubble({ mine, message }: { mine: boolean; message: any }) {
  return <Bubble mine={mine} message={message}>{message.text}</Bubble>
}

// ─── Image / Video ────────────────────────────────────────────────────────────
function MediaCard({ mine, src, caption, isVideo, duration, poster, onOpen }: {
  mine: boolean; src: string; caption?: string; isVideo: boolean; duration?: string; poster?: string; onOpen?: () => void
}) {
  return (
    <button type="button" onClick={onOpen} className={cn(
      "relative block w-full max-w-[300px] overflow-hidden rounded-[24px] border text-left",
      mine ? "border-white/10 dark:border-white/20" : "border-[#efefef] dark:border-white/10"
    )}>
      <img src={(isVideo ? poster : src) || "/placeholder.svg"} alt={caption || (isVideo ? "Video" : "Image")} className="h-auto w-full object-cover" />
      {isVideo && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/30 shadow-lg backdrop-blur-md">
            <PlayFill className="ml-1 h-7 w-7 text-white drop-shadow-md" />
          </div>
        </div>
      )}
      {isVideo && duration && (
        <span className="absolute right-3 top-3 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-md">
          {duration}
        </span>
      )}
    </button>
  )
}

// ─── File ─────────────────────────────────────────────────────────────────────
const FILE_ICON_COLORS: Record<string, string> = {
  PDF: "text-[#d64545]",
  DOC: "text-[#2563eb]",
  DOCX: "text-[#2563eb]",
  XLS: "text-[#16a34a]",
  XLSX: "text-[#16a34a]",
  ZIP: "text-[#c2710c]",
  MP4: "text-[#7b4fd0]",
}

function FileCard({ mine, name, fileType, size }: { mine: boolean; name: string; fileType: string; size: string }) {
  const iconColor = FILE_ICON_COLORS[fileType.toUpperCase()] ?? "text-[#737373]"
  return (
    <CardShell mine={mine}>
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span className="flex shrink-0 items-center justify-center">
          <FileText className={cn("h-6 w-6", iconColor)} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-tight">{name}</p>
          <p className={cn("mt-0.5 text-[12px]", mine ? subText.mine : subText.them)}>
            {fileType} · {size}
          </p>
        </div>
        <button
          type="button"
          aria-label="Download"
          className={cn("shrink-0 rounded-full p-1.5 transition-colors", mine ? "hover:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/10")}
        >
          <ArrowDownToLine className="h-4 w-4" />
        </button>
      </div>
    </CardShell>
  )
}

// ─── Folder ───────────────────────────────────────────────────────────────────
function FolderCard({ mine, name, itemCount, access }: { mine: boolean; name: string; itemCount: number; access: string }) {
  return (
    <CardShell mine={mine} className="w-full max-w-[320px]">
      <div className="flex items-center gap-3 px-4 py-3.5">
        <span className="flex shrink-0 items-center justify-center pl-1 pr-0.5">
          <Folder className="h-6 w-6 text-[#f59e0b]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-tight">{name}</p>
          <p className={cn("mt-0.5 text-[12px]", mine ? subText.mine : subText.them)}>{itemCount} items</p>
        </div>
        {mine ? (
          <div className="flex shrink-0 cursor-pointer items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
            <span className={cn("text-[13px]", subText.mine)}>{access}</span>
            <ChevronsExpandVertical className="h-3.5 w-3.5" />
          </div>
        ) : (
          <span className="shrink-0 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[12px] font-semibold text-[#16a34a] dark:bg-[#14532d]/40 dark:text-[#4ade80]">
            {access}
          </span>
        )}
      </div>
    </CardShell>
  )
}

// ─── Link preview ─────────────────────────────────────────────────────────────
function LinkCard({ mine, image, title }: { mine: boolean; image: string; title: string }) {
  return (
    <CardShell mine={mine} className="w-full max-w-[320px]">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <button
          type="button"
          aria-label="Open link"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition-colors hover:bg-black/70"
        >
          <ArrowUpRightFromSquare className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
      <div className="px-4 py-3">
        <p className="line-clamp-2 text-[14px] font-bold leading-snug">{title}</p>
      </div>
    </CardShell>
  )
}

// ─── Booking ──────────────────────────────────────────────────────────────────
function BookingCard({ mine, title, date, timeRange, status, onReschedule }: {
  mine: boolean; title: string; date: string; timeRange: string; status: "pending" | "confirmed"
  onReschedule?: (newDate: string, newTime: string) => void
}) {
  const parts = date.split(" ") // e.g. "Thu, Jun 27" → ["Thu,", "Jun", "27"]
  const month = parts[1] ?? ""
  const day = parts[2] ?? ""

  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<any>(null)
  const [selectedStartTime, setSelectedStartTime] = useState<any>(null)
  const [selectedEndTime, setSelectedEndTime] = useState<any>(null)

  const handleConfirm = () => {
    if (selectedDate && selectedStartTime && selectedEndTime && onReschedule) {
      const newTime = `${selectedStartTime.toString().substring(0, 5)}-${selectedEndTime.toString().substring(0, 5)}`
      onReschedule(selectedDate.toString(), newTime)
      setIsOpen(false)
    }
  }

  return (
    <CardShell mine={mine} className="w-full max-w-[320px] p-2">
      <div className="flex items-center gap-3">
        {/* Calendar square */}
        <div className={cn("flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[12px]", mine ? cardInner.mine : cardInner.them)}>
          <span className={cn("text-[8px] font-bold uppercase tracking-wide", mine ? "text-white/50 dark:text-white/50" : "text-[#737373] dark:text-white/50")}>{month}</span>
          <span className="text-[18px] font-bold leading-none">{day}</span>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 py-1">
          <p className="truncate text-[14px] font-bold">{title}</p>
          <p className={cn("mt-0.5 truncate text-[12px]", mine ? subText.mine : subText.them)}>{timeRange}</p>
        </div>

        {/* Actions */}
        {status === "confirmed" ? (
          <div className="pr-2 text-[#22c55e]">
            <CircleCheckFill className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-1 pr-1">
            <button aria-label="Accept" className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors text-[#22c55e]", mine ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-[#f0fdf4] dark:bg-[#3f3f46] dark:hover:bg-[#27272a]")}>
              <Check className="h-4 w-4" />
            </button>
            <button aria-label="Decline" className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors text-[#ef4444]", mine ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-[#fef2f2] dark:bg-[#3f3f46] dark:hover:bg-[#27272a]")}>
              <Xmark className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {status !== "confirmed" && (
        <div className="w-full mt-2 flex [&>*]:flex-1 [&>*]:flex [&>*]:w-full">
          <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
              <button className={cn(
                "flex flex-1 w-full items-center justify-center gap-2 rounded-[12px] py-2 text-[12px] font-semibold transition-colors",
                mine ? "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white" : "bg-white hover:bg-[#fafafa] text-[#737373] hover:text-[#0a0a0a] dark:bg-[#3f3f46] dark:hover:bg-[#27272a] dark:text-white/60 dark:hover:text-white"
              )}>
                <ArrowRotateLeft className="h-3.5 w-3.5" />
                Reschedule
              </button>
            </PopoverTrigger>
          <PopoverContent className="w-[310px] p-0 border border-[#e4e4e7] dark:border-[#27272a] shadow-xl rounded-[20px] overflow-hidden">
            <div className="flex flex-col">
              <CustomCalendar
                value={selectedDate}
                onChange={setSelectedDate}
              />

              <div className="px-4 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <CustomTimePicker
                    label="Start Time"
                    value={selectedStartTime}
                    onChange={setSelectedStartTime}
                    disabled={!selectedDate}
                  />
                  <div className="flex items-center pt-5">
                    <span className="text-[#a1a1aa] font-bold">—</span>
                  </div>
                  <CustomTimePicker
                    label="End Time"
                    value={selectedEndTime}
                    onChange={setSelectedEndTime}
                    disabled={!selectedDate}
                  />
                </div>

                <div className="flex gap-2 w-full mt-2">
                  <Button size="md" variant="flat" className="flex-1 font-bold rounded-[12px]" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button size="md" className="flex-1 font-bold rounded-[12px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white data-[disabled=true]:bg-[#f4f4f5] data-[disabled=true]:text-[#a1a1aa] dark:data-[disabled=true]:bg-[#27272a] dark:data-[disabled=true]:text-[#737373]" onClick={handleConfirm} isDisabled={!selectedDate || !selectedStartTime || !selectedEndTime}>Confirm</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        </div>
      )}
    </CardShell>
  )
}

// ─── Brand Deal ───────────────────────────────────────────────────────────────
function DealCard({ mine, brand, title, budget, deliverables }: {
  mine: boolean; brand: string; title: string; budget: string; deliverables: string[]
}) {
  return (
    <div className={cn("overflow-hidden rounded-[20px] max-w-[360px]", mine ? cardShell.mine : cardShell.them)}>
      {/* Header strip */}
      <div className={cn("flex items-center gap-2 px-4 py-2.5", mine ? "bg-white/15 dark:bg-white/15" : "bg-[#0a0a0a] dark:bg-[#18181b]")}>
        <Briefcase className="h-4 w-4 text-white" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-white">Brand Deal</span>
        <span className="ml-auto text-[16px] font-bold text-white">{budget}</span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[15px] font-bold">{title}</p>
        <p className={cn("mt-0.5 text-[13px]", mine ? subText.mine : subText.them)}>{brand}</p>

        <ul className="mt-3 flex flex-col gap-1.5">
          {deliverables.map((d) => (
            <li key={d} className="flex items-center gap-2 text-[13px] opacity-80">
              <CircleCheckFill className="h-3.5 w-3.5 shrink-0 text-[#22c55e]" />
              {d}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-80",
              mine ? "bg-white text-[#0a0a0a]" : "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
            )}
          >
            Accept
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-colors",
              mine ? "bg-white/15 text-white hover:bg-white/25" : "bg-black/5 text-[#0a0a0a] hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            )}
          >
            Negotiate
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ message, onResolve }: { message: Extract<Message, { kind: "review" }>; onResolve?: (status: "approved" | "changes_requested") => void }) {
  const pending = message.status === "pending"

  const statusConfig = {
    pending: { label: "Awaiting Review", color: "text-[#c2710c] dark:text-[#fdba74]", bg: "bg-[#fff3e0] dark:bg-[#7c3503]/40" },
    approved: { label: "Approved", color: "text-[#16a34a] dark:text-[#4ade80]", bg: "bg-[#dcfce7] dark:bg-[#14532d]/40" },
    changes_requested: { label: "Changes Requested", color: "text-[#ef4444] dark:text-[#f87171]", bg: "bg-[#fee2e2] dark:bg-[#7f1d1d]/40" }
  }[message.status]

  return (
    <div className="max-w-[340px] overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-sm dark:border-white/10 dark:bg-[#18181b] text-left">
      {/* Header Area */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5 text-[#0a0a0a] dark:text-white">
          <CircleCheckFill className="h-4 w-4 text-[#3897f0]" />
          <span className="text-[12px] font-bold uppercase tracking-wider">Submission</span>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", statusConfig.bg, statusConfig.color)}>
          {statusConfig.label}
        </span>
      </div>

      <div className="px-4 pb-4">
        {/* Title & Context */}
        <p className="text-[16px] font-bold leading-tight text-[#0a0a0a] dark:text-white mt-1">{message.title}</p>
        <p className="mt-1 text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">{message.creator} · {message.campaign}</p>

        {/* Asset Preview */}
        <div className="mt-4 group relative flex h-[160px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl bg-[#f4f4f5] dark:bg-[#27272a] transition-all hover:brightness-95 dark:hover:brightness-110">
          {/* Subtle gradient pattern */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #93c1ff 0%, transparent 60%)' }} />
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-md dark:bg-[#0a0a0a]/50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 text-[#0a0a0a] dark:text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        </div>

        {/* File name string */}
        <div className="mt-2 flex items-center justify-between">
          <span className="truncate text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">{message.assetName}</span>
          <span className="shrink-0 text-[11px] font-semibold text-[#a1a1aa]">MP4</span>
        </div>

        {/* Action Buttons */}
        {pending && (
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => onResolve?.("approved")}
              className="flex-1 rounded-xl bg-[#0a0a0a] py-2.5 text-[13px] font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-[#0a0a0a]"
            >
              Approve
            </button>
            <button
              onClick={() => onResolve?.("changes_requested")}
              className="flex-1 rounded-xl bg-[#f4f4f5] py-2.5 text-[13px] font-semibold text-[#0a0a0a] transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-[#27272a] dark:text-white dark:hover:bg-[#3f3f46]"
            >
              Request Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────
function renderCard(message: Message, mine: boolean, onOpenMedia?: () => void, onReschedule?: (newDate: string, newTime: string) => void, onResolveReview?: (status: "approved" | "changes_requested") => void) {
  switch (message.kind) {
    case "text":
      return <TextBubble mine={mine} message={message} />
    case "image":
      return (
        <div className="flex flex-col gap-1">
          {message.replyTo && <div className={cn("max-w-[300px] px-1", mine ? "" : "")}><ReplySnippet replyTo={message.replyTo} /></div>}
          <MediaCard mine={mine} src={message.src} caption={message.caption} isVideo={false} onOpen={onOpenMedia} />
        </div>
      )
    case "video":
      return (
        <div className="flex flex-col gap-1">
          {message.replyTo && <div className={cn("max-w-[300px] px-1", mine ? "" : "")}><ReplySnippet replyTo={message.replyTo} /></div>}
          <MediaCard mine={mine} src={message.src} poster={message.poster} caption={message.caption} isVideo duration={message.duration} onOpen={onOpenMedia} />
        </div>
      )
    case "file":
      return <FileCard mine={mine} name={message.name} fileType={message.fileType} size={message.size} />
    case "folder":
      return <FolderCard mine={mine} name={message.name} itemCount={message.itemCount} access={message.access} />
    case "link":
      return <LinkCard mine={mine} image={message.image} title={message.title} />
    case "booking":
      return <BookingCard mine={mine} title={message.title} date={message.date} timeRange={message.timeRange} status={message.status} onReschedule={onReschedule} />
    case "deal":
      return <DealCard mine={mine} brand={message.brand} title={message.title} budget={message.budget} deliverables={message.deliverables} />
    case "review":
      return <ReviewCard message={message} onResolve={onResolveReview} />
    default:
      return null
  }
}

// ─── Public export ────────────────────────────────────────────────────────────
export function MessageItem({
  message,
  isGrouped = false,
  onReply,
  onReschedule,
  onResolveReview,
}: {
  message: Message
  isGrouped?: boolean
  onReply?: (message: Message) => void
  onReschedule?: (message: Message, newDate: string, newTime: string) => void
  onResolveReview?: (status: "approved" | "changes_requested") => void
}) {
  const mine = message.sender === "me"
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setMenuOpen(true)
    }, 500)
  }
  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  return (
    <div className={cn(
      "group flex w-full",
      mine ? "justify-end" : "justify-start",
      isGrouped ? "mt-0.5" : "mt-4"
    )}>
      {!mine && message.senderName && (
        <div className="mr-2 flex shrink-0 items-start pt-0.5">
          {!isGrouped ? (
             <GradientAvatar tone={message.senderTone || "gray"} className="h-7 w-7" />
          ) : (
             <div className="h-7 w-7" />
          )}
        </div>
      )}
      <div className={cn("flex max-w-[78%] flex-col gap-0.5", mine ? "items-end" : "items-start")}>
        {!mine && message.senderName && !isGrouped && (
          <span className="mb-0.5 pl-1 text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa]">
            {message.senderName}
          </span>
        )}

        <div className={cn("group/card relative flex items-center gap-1", mine ? "flex-row-reverse" : "flex-row")}>
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchEnd}
            >
              {renderCard(message, mine, () => setViewerOpen(true), (newDate, newTime) => onReschedule?.(message, newDate, newTime), onResolveReview)}
            </div>

          <Popover isOpen={menuOpen} onOpenChange={setMenuOpen} placement={mine ? "bottom-end" : "bottom-start"} offset={10}>
            <Popover.Trigger>
              <button
                type="button"
                aria-label="Message actions"
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#737373] transition-all hover:bg-black/5 dark:text-[#a1a1aa] dark:hover:bg-white/10 md:opacity-0 md:group-hover/card:opacity-100",
                  menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none md:pointer-events-auto"
                )}
              >
                <EllipsisVertical className="h-5 w-5" />
              </button>
            </Popover.Trigger>
            <Popover.Content className="w-[180px] p-1">
              <ListBox
                aria-label="Message Actions"
                selectionMode="none"
                className="w-full"
                onAction={(key) => {
                  if (key === "reply") {
                    if (onReply) onReply(message)
                  }
                  else if (key === "edit") toast.info("Coming Soon", { description: "Message editing is not yet available." })
                  else if (key === "delete") toast.success("Message Deleted", { description: "The message has been removed." })
                  else if (key === "unsend") toast.success("Message Unsent", { description: "The message has been unsent." })
                  else if (key === "report") toast.info("Report Submitted", { description: "We will review your report shortly." })
                  setMenuOpen(false)
                }}
              >
                {mine ? (
                  [
                    <ListBox.Item key="reply" id="reply" textValue="Reply">
                      <div className="flex items-center gap-2.5">
                        <ArrowUturnCcwLeft className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Reply</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="edit" id="edit" textValue="Edit">
                      <div className="flex items-center gap-2.5">
                        <Pencil className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Edit</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="delete" id="delete" textValue="Delete">
                      <div className="flex items-center gap-2.5">
                        <TrashBin className="h-4 w-4 shrink-0 text-[#ef4444]" />
                        <span className="text-[14px] font-medium text-[#ef4444]">Delete</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="unsend" id="unsend" textValue="Unsend">
                      <div className="flex items-center gap-2.5">
                        <ArrowRotateLeft className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Unsend</span>
                      </div>
                    </ListBox.Item>
                  ]
                ) : (
                  [
                    <ListBox.Item key="reply" id="reply" textValue="Reply">
                      <div className="flex items-center gap-2.5">
                        <ArrowUturnCcwLeft className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Reply</span>
                      </div>
                    </ListBox.Item>,
                    <ListBox.Item key="report" id="report" textValue="Report">
                      <div className="flex items-center gap-2.5">
                        <ShieldExclamation className="h-4 w-4 shrink-0 text-[#ef4444]" />
                        <span className="text-[14px] font-medium text-[#ef4444]">Report</span>
                      </div>
                    </ListBox.Item>
                  ]
                )}
              </ListBox>
            </Popover.Content>
          </Popover>
        </div>

        {/* Timestamp — fade in on hover */}
        <span className={cn(
          "text-[10px] tabular-nums text-[#a1a1aa] opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-[#737373]",
          mine ? "self-end pr-1" : "self-start pl-1"
        )}>
          {message.time}
        </span>
        {(message.kind === "image" || message.kind === "video") && (
          <MediaViewer
            open={viewerOpen}
            onOpenChange={setViewerOpen}
            source={{
              url: message.src,
              title: message.caption ?? (message.kind === "video" ? "Video" : "Image"),
              poster: message.kind === "video" ? message.poster : undefined,
              kind: message.kind,
              provider: message.kind === "image" ? "image" : "direct",
            }}
          />
        )}
      </div>
    </div>
  )
}
