"use client"

import { useState } from "react"
import { Button, Popover, ListBox } from "@heroui/react"
import {
  Magnifier,
  PencilToLine,
  BellSlash,
  Headphones,
  ChevronDown,
  ChevronUp,
  Ellipsis,
  Plus,
  Folder,
  Tray,
  Person,
  Check,
  Pin,
  TrashBin,
  ArrowLeft
} from "@gravity-ui/icons"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { conversations, type Conversation } from "@/lib/messages-data"
import { cn } from "@/lib/utils"
import { toast } from "@heroui/react"

const FILTERS = ["Unread", "Brands", "Requests"] as const

const LABEL_STYLES: Record<string, string> = {
  deal: "bg-[#eaf0ff] text-[#2f5fd0] dark:bg-[#1d3a8a]/50 dark:text-[#93b4ff]",
  pending: "bg-[#fff3e0] text-[#c2710c] dark:bg-[#7c3503]/40 dark:text-[#fdba74]",
  vip: "bg-[#f3eaff] text-[#7b4fd0] dark:bg-[#4c1d95]/50 dark:text-[#c4b5fd]",
}

/* ─── Story Notes Row ─────────────────────────────────────── */
const GRADIENTS: Record<string, string> = {
  blue: "radial-gradient(circle at 32% 28%, #cfe6ff 0%, #93c1ff 30%, #4f8ff5 62%, #2f5fd0 100%)",
  purple: "radial-gradient(circle at 32% 28%, #e6dcff 0%, #c0a9f5 32%, #8a6fe0 64%, #5b3fc0 100%)",
  green: "radial-gradient(circle at 32% 28%, #d9f0b8 0%, #a9e08a 26%, #6fd0a6 56%, #3fae8a 100%)",
  orange: "radial-gradient(circle at 32% 28%, #ffe7c2 0%, #ffcf8a 30%, #f5a64f 64%, #e07a2f 100%)",
  red: "radial-gradient(circle at 32% 28%, #ffd6cf 0%, #ff9d8a 32%, #f5604f 64%, #d63f3f 100%)",
  teal: "radial-gradient(circle at 32% 28%, #c2f0ec 0%, #8ae0d6 30%, #4fc6d0 62%, #2f9bb0 100%)",
  pink: "radial-gradient(circle at 32% 28%, #ffd9ec 0%, #ffa9d0 32%, #f56fb0 64%, #d63f8a 100%)",
  gray: "radial-gradient(circle at 32% 28%, #ededed 0%, #c9c9c9 32%, #8f8f8f 64%, #4f4f4f 100%)",
}

function StoryNotes({ onSelect, onOpenContacts }: { onSelect: (id: string) => void, onOpenContacts: () => void }) {
  const allIndividuals = conversations.filter(c => c.type !== "community")
  const visibleConvos = allIndividuals.slice(0, 3)
  const fourthConvo = allIndividuals[3]
  const remainingConvos = allIndividuals.slice(4, 5) // Just take 1 for the gradient behind
  const remainingCount = Math.max(0, allIndividuals.length - 4)
  
  return (
    <div className="flex items-start px-4 pb-3 pt-1 overflow-hidden w-full gap-2">
      {/* First 3 contacts */}
      {visibleConvos.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className="flex shrink-0 flex-col items-center gap-1.5"
        >
          <span
            className="h-14 w-14 rounded-full ring-2 ring-[#efefef] dark:ring-white/10"
            style={{
              backgroundImage: GRADIENTS[c.tone],
              boxShadow: "inset -1px -2px 4px rgba(0,0,0,0.18), inset 1px 2px 3px rgba(255,255,255,0.45)",
            }}
          />
          <span className="max-w-[56px] truncate text-[11px] font-medium text-[#52525b] dark:text-[#a1a1aa]">
            {c.name.split(" ")[0]}
          </span>
        </button>
      ))}

      {/* 4th contact and the stack */}
      {fourthConvo && (
        <div className="flex items-start -space-x-5">
          <button
            type="button"
            onClick={() => onSelect(fourthConvo.id)}
            className="flex shrink-0 flex-col items-center gap-1.5 relative"
            style={{ zIndex: 30 }}
          >
            <span
              className="h-14 w-14 rounded-full ring-4 ring-white dark:ring-[#0a0a0a]"
              style={{
                backgroundImage: GRADIENTS[fourthConvo.tone],
                boxShadow: "inset -1px -2px 4px rgba(0,0,0,0.18), inset 1px 2px 3px rgba(255,255,255,0.45)",
              }}
            />
            <span className="max-w-[56px] truncate text-[11px] font-medium text-[#52525b] dark:text-[#a1a1aa]">
              {fourthConvo.name.split(" ")[0]}
            </span>
          </button>

          {remainingCount > 0 && (
            <button
              type="button"
              onClick={onOpenContacts}
              className="flex shrink-0 items-center -space-x-5 relative"
              style={{ zIndex: 20 }}
            >
              {remainingConvos.map((c, i) => (
                <span
                  key={c.id}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full ring-4 ring-white dark:ring-[#0a0a0a]"
                  style={{
                    backgroundImage: GRADIENTS[c.tone],
                    boxShadow: "inset -1px -2px 4px rgba(0,0,0,0.18), inset 1px 2px 3px rgba(255,255,255,0.45)",
                    zIndex: 20 - i,
                  }}
                />
              ))}
              <span
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#3897f0] text-[16px] font-bold text-white ring-4 ring-white dark:ring-[#0a0a0a]"
                style={{ zIndex: 10 }}
              >
                +{remainingCount}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Conversation Row ────────────────────────────────────── */
function ConversationRow({
  c,
  active,
  isExpanded,
  onSelect,
}: {
  c: Conversation
  active: boolean
  isExpanded?: boolean
  onSelect: () => void
}) {
  const [actionView, setActionView] = useState<"main" | "groups">("main")
  const isCommunity = c.type === "community"
  const displayUnread = isCommunity 
    ? (c.channels?.reduce((acc, ch) => acc + (ch.unread || 0), 0) || 0) 
    : c.unread

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors outline-none",
        active || isExpanded ? "bg-[#f4f4f5] dark:bg-[#1f1f1f]" : "hover:bg-[#fafafa] dark:hover:bg-[#18181b]",
      )}
    >
      <GradientAvatar tone={c.tone} online={c.online} isCommunity={isCommunity} className="h-14 w-14" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{c.name}</span>
          {c.headset && <Headphones className="h-3.5 w-3.5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />}
          {c.label && (
            <span
              className={cn(
                "ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                LABEL_STYLES[c.label.tone],
              )}
            >
              {c.label.text}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span
            className={cn(
              "truncate text-[13px]",
              displayUnread ? "font-semibold text-[#0a0a0a] dark:text-white" : "text-[#737373] dark:text-[#a1a1aa]",
            )}
          >
            {isCommunity ? (
              c.channels ? `${c.channels.length} channels` : "Community"
            ) : displayUnread && displayUnread > 1 ? (
              `${displayUnread} new messages`
            ) : (
              c.preview
            )}
          </span>
          {!isCommunity && <span className="shrink-0 text-[13px] text-[#a1a1aa] dark:text-[#737373]">· {c.time}</span>}
        </div>
      </div>
      <div className="flex w-5 shrink-0 flex-col items-center gap-1 transition-opacity group-hover:opacity-0">
        {displayUnread ? (
          <span className="h-2.5 w-2.5 rounded-full bg-[#3897f0]" />
        ) : null}
        {isCommunity ? (
          isExpanded ? <ChevronUp className="h-5 w-5 text-[#a1a1aa]" /> : <ChevronDown className="h-5 w-5 text-[#a1a1aa]" />
        ) : (
          c.muted && <BellSlash className="h-4 w-4 text-[#a1a1aa]" />
        )}
      </div>

      {/* Hover Action Menu */}
      <div 
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()} 
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Popover placement="bottom-end" offset={5} onOpenChange={(open) => !open && setTimeout(() => setActionView("main"), 200)}>
          <Popover.Trigger>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#737373] shadow-sm hover:bg-[#f4f4f5] dark:bg-[#1f1f1f] dark:text-[#a1a1aa] dark:hover:bg-[#27272a]"
            >
              <Ellipsis className="h-5 w-5" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="w-[180px] p-1">
            {actionView === "main" ? (
              <ListBox 
                aria-label="Chat actions" 
                selectionMode="none" 
                className="w-full" 
                items={[
                  { key: "mark_read", label: "Mark as read", icon: Check },
                  { key: "mute", label: "Mute", icon: BellSlash },
                  { key: "pin", label: "Pin", icon: Pin },
                  { key: "add_group", label: "Add to group", icon: Plus, showDivider: true },
                  { key: "delete", label: "Delete", icon: TrashBin, danger: true }
                ]}
                onAction={(key) => {
                  if (key === "add_group") {
                    setActionView("groups")
                  } else {
                    const keyStr = String(key)
                    let toastMsg = "Action completed."
                    if (keyStr.includes("mark_read")) toastMsg = "Conversation marked as read."
                    if (keyStr.includes("mute")) toastMsg = "Conversation muted."
                    if (keyStr.includes("pin")) toastMsg = "Conversation pinned."
                    if (keyStr.includes("delete")) toastMsg = "Conversation deleted."
                    toast.success("Action Successful", { description: toastMsg })
                  }
                }}
              >
                {(item) => (
                  <ListBox.Item key={item.key} textValue={item.label} showDivider={item.showDivider}>
                    <div className={cn("flex items-center gap-2.5", item.showDivider ? "pb-2 pt-1" : "")}>
                      <item.icon className={cn("h-4 w-4 shrink-0", item.danger ? "text-[#ef4444]" : "text-[#737373] dark:text-[#a1a1aa]")} />
                      <span className={cn("text-[14px] font-medium", item.danger ? "text-[#ef4444]" : "text-[#0a0a0a] dark:text-white")}>{item.label}</span>
                    </div>
                  </ListBox.Item>
                )}
              </ListBox>
            ) : (
              <ListBox 
                aria-label="Select group" 
                selectionMode="none" 
                className="w-full" 
                items={[
                  { key: "back", label: "Back", icon: ArrowLeft, showDivider: true },
                  { key: "group_1", label: "VIP Clients" },
                  { key: "group_2", label: "Collabs" }
                ]}
                onAction={(key) => {
                  if (key === "back") setActionView("main")
                  else {
                    toast.success("Added to Group", { description: "The member has been added successfully." })
                    setActionView("main")
                  }
                }}
              >
                {(item) => (
                  <ListBox.Item key={item.key} textValue={item.label} showDivider={item.showDivider}>
                    <div className={cn("flex items-center gap-2.5", item.showDivider ? "pb-2 pt-1" : "")}>
                      {item.icon && <item.icon className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />}
                      <span className={cn("text-[14px]", item.key === "back" ? "font-bold" : "font-medium", "text-[#0a0a0a] dark:text-white")}>{item.label}</span>
                    </div>
                  </ListBox.Item>
                )}
              </ListBox>
            )}
          </Popover.Content>
        </Popover>
      </div>
    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────── */
export function ConversationList({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  const [view, setView] = useState<"main" | "contacts">("main")
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Unread")
  const [query, setQuery] = useState("")
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null)

  const filtered = conversations.filter((c) => {
    if (filter === "Brands" && !c.verified) return false
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const filteredContacts = conversations.filter((c) => {
    if (c.type === "community") return false
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) && !c.brandName?.toLowerCase().includes(query.toLowerCase()) && !c.systemRole?.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  if (view === "contacts") {
    return (
      <div className="flex h-full w-full flex-col border-r border-[#efefef] bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
        {/* Contacts Header */}
        <div className="flex items-center gap-3 px-5 pb-3 pt-5">
          <button
            type="button"
            onClick={() => {
              setView("main")
              setQuery("")
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]"
          >
            <ArrowLeft className="h-5 w-5 text-[#0a0a0a] dark:text-white" />
          </button>
          <h2 className="text-[20px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Contacts</h2>
        </div>

        {/* Contacts Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
            <input
              aria-label="Search contacts"
              placeholder="Search contacts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-full border-none bg-[#f4f4f5] pl-9 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none focus:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-white dark:focus:bg-[#27272a]"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto px-2 py-1">
          {filteredContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c.id)
                setView("main")
                setQuery("")
              }}
              className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-[#18181b]"
            >
              <GradientAvatar tone={c.tone} isCommunity={c.type === "community"} className="h-[46px] w-[46px] shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <span className="truncate text-[15px] font-semibold leading-tight text-[#0a0a0a] dark:text-white">
                  {c.name}
                </span>
                <span className="truncate text-[13px] font-medium leading-snug text-[#737373] dark:text-[#a1a1aa]">
                  {c.brandName || c.systemRole || "Contact"}
                </span>
              </div>
            </button>
          ))}
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <span className="text-[14px] text-[#a1a1aa]">No contacts found.</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col border-r border-[#efefef] bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <Popover placement="bottom-start" offset={5}>
          <Popover.Trigger>
            <button type="button" className="flex items-center gap-1.5 rounded-lg outline-none text-[#0a0a0a] dark:text-white h-[32px]">
              <span className="text-[28px] font-bold tracking-tight leading-none">Inbox</span>
              <ChevronDown className="h-5 w-5 text-[#a1a1aa]" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="w-[200px] p-1">
            <ListBox aria-label="Inbox views" selectionMode="none" className="w-full" onAction={() => toast.info("Coming Soon", { description: "This feature is not yet available." })}>
              <ListBox.Item key="inbox" textValue="Inbox">
                <div className="flex items-center gap-2.5">
                  <Tray className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                  <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Inbox</span>
                </div>
              </ListBox.Item>
              <ListBox.Item key="dms" textValue="Direct Messages">
                <div className="flex items-center gap-2.5">
                  <Person className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                  <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">DMs</span>
                </div>
              </ListBox.Item>
              <ListBox.Item key="workspace" textValue="Workspace">
                <div className="flex items-center gap-2.5">
                  <Folder className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                  <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Workspace</span>
                </div>
              </ListBox.Item>
              <ListBox.Item key="requests" textValue="Requests" showDivider>
                <div className="flex items-center gap-2.5 pb-2 pt-1">
                  <Pin className="h-4 w-4 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                  <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">Requests</span>
                </div>
              </ListBox.Item>
            </ListBox>
          </Popover.Content>
        </Popover>
        <Button isIconOnly variant="ghost" aria-label="New message" className="text-[#0a0a0a] dark:text-white">
          <PencilToLine className="h-[22px] w-[22px]" />
        </Button>
      </div>

      {/* Search — native input for full className control */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
          <input
            aria-label="Search messages"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border-none bg-[#f4f4f5] pl-9 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none focus:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-white dark:focus:bg-[#27272a]"
          />
        </div>
      </div>

      {/* Story Notes */}
      <StoryNotes onSelect={onSelect} onOpenContacts={() => {
        setView("contacts")
        setQuery("")
      }} />

      {/* Filters (Messages / Requests tabs) */}
      <div className="flex items-center gap-2 px-4 pb-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
              filter === f
                ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
                : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-[#a1a1aa] dark:hover:bg-[#27272a]",
            )}
          >
            {f}
          </button>
        ))}
        <Popover placement="bottom-end" offset={5}>
          <Popover.Trigger>
            <button
              type="button"
              aria-label="Create group"
              className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#f4f4f5] text-[#52525b] transition-colors hover:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-[#a1a1aa] dark:hover:bg-[#27272a]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="w-[240px] p-3">
            <div className="flex flex-col gap-3">
              <h4 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Create Custom Group</h4>
              <input
                aria-label="Group name"
                placeholder="Name your group..."
                className="h-10 w-full rounded-lg bg-[#f4f4f5] px-3 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none focus:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-white dark:focus:bg-[#27272a]"
              />
              <Button 
                size="sm" 
                className="w-full bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a] font-semibold rounded-lg"
                onPress={() => toast.success("Group Created", { description: "Your new group has been created." })}
              >
                Create
              </Button>
            </div>
          </Popover.Content>
        </Popover>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {filtered.map((c) => {
          const isCommunity = c.type === "community"
          const isExpanded = expandedCommunity === c.id
          
          return (
            <div key={c.id}>
              <ConversationRow
                c={c}
                active={!isCommunity && c.id === activeId}
                isExpanded={isExpanded}
                onSelect={() => {
                  if (isCommunity) {
                    setExpandedCommunity(isExpanded ? null : c.id)
                  } else {
                    onSelect(c.id)
                  }
                }}
              />
              {isCommunity && isExpanded && c.channels && (
                <div className="ml-[68px] mt-1 flex flex-col gap-1 pb-3 pr-2">
                  {c.channels.map(ch => (
                    <button
                      key={ch.id}
                      onClick={() => onSelect(`${c.id}:${ch.id}`)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-2.5 text-left transition-colors",
                        activeId === `${c.id}:${ch.id}` ? "bg-[#f4f4f5] dark:bg-[#1f1f1f]" : "hover:bg-[#fafafa] dark:hover:bg-[#18181b]"
                      )}
                    >
                      <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white"># {ch.name}</span>
                      {ch.unread ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3897f0] text-[11px] font-bold text-white">
                          {ch.unread}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
