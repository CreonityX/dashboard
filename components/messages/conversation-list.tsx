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
  ArrowLeft,
  Xmark,
  Picture,
  Lock,
  Link
} from "@gravity-ui/icons"
import { GradientAvatar, AvatarTone } from "@/components/messages/gradient-avatar"
import { CreateChannelModal } from "@/components/messages/create-channel-modal"
import { Switch } from "@heroui/react"
import type { Conversation } from "@/lib/messages-data"
import type { DraftState } from "@/components/messages/messages-app"
import { cn } from "@/lib/utils"
import { toast } from "@heroui/react"
import { useAccount } from "@/context/account-context"

const FILTERS = ["All", "Unread", "Brands", "Requests"] as const
const BRAND_FILTERS = ["All", "Creators", "Workspaces", "Requests"] as const

const LABEL_STYLES: Record<string, string> = {
  deal: "bg-[#eaf0ff] text-[#2f5fd0] dark:bg-[#1d3a8a]/50 dark:text-[#93b4ff]",
  pending: "bg-[#fff3e0] text-[#c2710c] dark:bg-[#7c3503]/40 dark:text-[#fdba74]",
  vip: "bg-[#f3eaff] text-[#7b4fd0] dark:bg-[#4c1d95]/50 dark:text-[#c4b5fd]",
}


const TONES: AvatarTone[] = ["blue", "purple", "green", "orange", "red", "teal", "pink", "gray"]

/* ─── Conversation Row ────────────────────────────────────── */
function ConversationRow({
  c,
  active,
  isExpanded,
  onSelect,
  onDelete
}: {
  c: Conversation
  active: boolean
  isExpanded?: boolean
  onSelect: () => void
  onDelete?: (id: string) => void
}) {
  const [actionView, setActionView] = useState<"main" | "groups">("main")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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
                  } else if (key === "delete") {
                    setShowDeleteModal(true)
                  } else {
                    const keyStr = String(key)
                    let toastMsg = "Action completed."
                    if (keyStr.includes("mark_read")) toastMsg = "Conversation marked as read."
                    if (keyStr.includes("mute")) toastMsg = "Conversation muted."
                    if (keyStr.includes("pin")) toastMsg = "Conversation pinned."
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

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-[#18181b] border border-[#efefef] dark:border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold text-[#0a0a0a] dark:text-white">
              Delete {isCommunity ? "Workspace" : c.type === "group" ? "Group" : "Chat"}?
            </h3>
            <p className="mb-6 text-sm text-[#737373] dark:text-[#a1a1aa]">
              Are you sure you want to delete this {isCommunity ? "workspace" : c.type === "group" ? "group" : "chat"}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteModal(false); }}
                className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors text-[#0a0a0a] dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteModal(false)
                  if (onDelete) onDelete(c.id)
                  toast.success("Deleted successfully")
                }}
                className="rounded-xl bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

/* ─── Main Component ──────────────────────────────────────── */
type ConversationListProps = {
  activeId: string
  onSelect: (id: string) => void
  conversations: Conversation[]
  isBrand?: boolean
  draftState?: DraftState
  setDraftState?: (state: DraftState) => void
  onDeleteConversation?: (id: string) => void
}

export function BlueSwitch({ 
  defaultSelected, 
  isSelected, 
  onChange 
}: { 
  defaultSelected?: boolean
  isSelected?: boolean
  onChange?: (value: boolean) => void
}) {
  return (
    <Switch 
      defaultSelected={defaultSelected} 
      isSelected={isSelected} 
      onChange={onChange}
      aria-label="Toggle"
      className="shrink-0"
    >
      {({isSelected: selected}) => (
        <Switch.Content>
          <Switch.Control className={selected ? "!bg-[#006FEE]" : ""}>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      )}
    </Switch>
  )
}

export function ConversationList({
  activeId,
  onSelect,
  conversations,
  isBrand = false,
  draftState,
  onDeleteConversation
}: ConversationListProps) {
  const { createBrandCommunity, createBrandChannel, createBrandGroup } = useAccount()
  const [showCreateChannel, setShowCreateChannel] = useState<string | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [popoverView, setPopoverView] = useState<"main" | "create-group-members" | "create-group-info" | "create-group-permissions" | "create-community-info">("main")
  const [popoverQuery, setPopoverQuery] = useState("")
  const [memberQuery, setMemberQuery] = useState("")
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupTone, setNewGroupTone] = useState<AvatarTone>("orange")
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [newCommunityTone, setNewCommunityTone] = useState<AvatarTone>("blue")
  const [customFilters, setCustomFilters] = useState<string[]>([])
  const filters = [...(isBrand ? BRAND_FILTERS : FILTERS), ...customFilters]
  const [filter, setFilter] = useState<string>("All")
  const [query, setQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null)

  const filtered = conversations.filter((c) => {
    if (filter === "All") {
      // Show all, just apply search query
      if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    }
    if (filter === "Unread" && !c.unread) return false
    if (filter === "Brands" && !c.verified) return false
    if (filter === "Creators" && c.type === "community") return false
    if (filter === "Workspaces" && c.type !== "community") return false
    if (filter === "Requests" && c.label?.tone !== "pending") return false
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const popoverContacts = conversations.filter(c => 
    c.type !== "community" && 
    (c.name.toLowerCase().includes(popoverQuery.toLowerCase()) || 
     c.systemRole?.toLowerCase().includes(popoverQuery.toLowerCase()) || 
     c.brandName?.toLowerCase().includes(popoverQuery.toLowerCase()) ||
     (c.type === "group" && c.members?.some(m => m.name.toLowerCase().includes(popoverQuery.toLowerCase()))))
  )

  const isCreating = activeId === "create-workspace" || activeId === "create-group"




  return (
    <div className="flex h-full w-full flex-col bg-[#fafafa] dark:bg-[#0a0a0a]">
      {!isCreating && (
        <div className="flex h-16 shrink-0 items-center justify-between px-5 py-4">
          <h1 className="text-[20px] font-bold text-[#0a0a0a] dark:text-white">
            Messages
          </h1>
          <Popover 
            placement="bottom-start" 
            offset={5} 
            isOpen={popoverOpen} 
            onOpenChange={(isOpen) => {
              setPopoverOpen(isOpen)
              if (!isOpen) {
                setTimeout(() => {
                  setPopoverView("main")
                  setPopoverQuery("")
                  setMemberQuery("")
                  setNewGroupMembers([])
                  setNewGroupName("")
                  setNewGroupDescription("")
                  setNewGroupTone("orange")
                }, 200)
              }
            }}
          >
            <Popover.Trigger>
              <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#efefef] dark:hover:bg-[#27272a] transition-colors">
                <PencilToLine className="h-[18px] w-[18px] text-[#0a0a0a] dark:text-white" />
              </button>
            </Popover.Trigger>
            <Popover.Content className="w-[320px] p-0 bg-white dark:bg-[#0a0a0a] border border-[#efefef] dark:border-white/10 shadow-xl rounded-2xl overflow-hidden flex flex-col max-h-[400px]">
              {popoverView === "main" && (
                <>
                  {/* Search Bar */}
                  <div className="relative p-2 shrink-0">
                    <Magnifier className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
                    <input
                      autoFocus
                      placeholder="Search"
                      value={popoverQuery}
                      onChange={(e) => setPopoverQuery(e.target.value)}
                      className="h-10 w-full rounded-xl border-none bg-[#f4f4f5] pl-9 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 dark:bg-[#1f1f1f] dark:text-white dark:focus:ring-white/10"
                    />
                  </div>

                  {/* Create Actions */}
                  {!popoverQuery && (
                    <div className="flex flex-col px-2 shrink-0">
                      <button 
                        onClick={() => setPopoverView("create-community-info")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-[#27272a]"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0a0a0a] dark:bg-white">
                          <Folder className="h-4 w-4 text-white dark:text-[#0a0a0a]" />
                        </div>
                        <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Create community</span>
                      </button>
                      <button 
                        onClick={() => setPopoverView("create-group-members")}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-[#27272a]"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0a0a0a] dark:bg-white">
                          <Person className="h-4 w-4 text-white dark:text-[#0a0a0a]" />
                        </div>
                        <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white">Create group</span>
                      </button>
                    </div>
                  )}

                  {/* Contacts List */}
                  <div className="flex-1 overflow-y-auto p-2">
                    {!popoverQuery && <div className="px-3 pb-2 pt-1 text-[13px] font-bold text-[#a1a1aa]">Contacts</div>}
                    {popoverContacts.length > 0 ? (
                      <div className="flex flex-col">
                        {popoverContacts.map(c => (
                          <button 
                            key={c.id}
                            onClick={() => { onSelect(c.id); setPopoverOpen(false); setPopoverQuery(""); }}
                            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-[#fafafa] dark:hover:bg-[#27272a]"
                          >
                            <GradientAvatar tone={c.tone} className="h-10 w-10 shrink-0" />
                            <div className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-[14px] font-semibold text-[#0a0a0a] dark:text-white">{c.name}</span>
                              <span className="truncate text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">
                                {c.type === "group" && c.members && c.members.length > 0
                                  ? ["You", ...c.members.map(m => m.name)].join(", ") 
                                  : c.type === "group" 
                                    ? "You" 
                                    : c.systemRole || c.brandName || "Contact"}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <span className="text-[13px] text-[#a1a1aa]">No contacts found.</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {popoverView === "create-group-members" && (
                <div className="flex flex-col h-full w-full">
                  <div className="flex items-center justify-between p-3 shrink-0">
                    <button 
                      onClick={() => setPopoverView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#efefef] dark:hover:bg-[#27272a] transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-[#a1a1aa]" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white leading-tight">Add members</span>
                      <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa] leading-tight">{newGroupMembers.length}/1,023</span>
                    </div>
                    <button 
                      onClick={() => setPopoverView("create-group-info")}
                      disabled={newGroupMembers.length === 0}
                      className={`text-[15px] font-semibold px-2 ${newGroupMembers.length > 0 ? "text-[#0a0a0a] dark:text-white hover:opacity-70" : "text-[#a1a1aa] cursor-not-allowed"}`}
                    >
                      Next
                    </button>
                  </div>
                  
                  <div className="px-3 pb-2 shrink-0">
                    <div className="relative">
                      <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
                      <input
                        autoFocus
                        placeholder="Search name or number"
                        value={memberQuery}
                        onChange={(e) => setMemberQuery(e.target.value)}
                        className="h-10 w-full rounded-xl border-none bg-[#f4f4f5] pl-9 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none focus:ring-2 focus:ring-[#0a0a0a]/10 dark:bg-[#1f1f1f] dark:text-white dark:focus:ring-white/10"
                      />
                    </div>
                  </div>

                  {newGroupMembers.length > 0 && (
                    <div className="px-3 py-3 flex items-center gap-4 overflow-x-auto shrink-0">
                      {newGroupMembers.map(id => {
                        const member = conversations.find(c => c.id === id)
                        if (!member) return null
                        return (
                          <div key={id} className="flex flex-col items-center gap-1 relative shrink-0 w-[52px]">
                            <div className="relative">
                              <GradientAvatar tone={member.tone} className="h-12 w-12" />
                              <button 
                                onClick={() => setNewGroupMembers(prev => prev.filter(m => m !== id))}
                                className="absolute -right-1 -top-1 bg-[#a1a1aa] dark:bg-[#3f3f46] rounded-full p-[2px] border-2 border-white dark:border-[#18181b]"
                              >
                                <Xmark className="h-3 w-3 text-white" />
                              </button>
                            </div>
                            <span className="text-[11px] font-medium text-[#0a0a0a] dark:text-white truncate w-full text-center">{member.name.split(" ")[0]}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-2">
                    <div className="px-2 pb-2 pt-1 text-[13px] font-bold text-[#737373] dark:text-[#a1a1aa]">Contacts</div>
                    <div className="flex flex-col">
                      {conversations
                        .filter(c => c.type !== "community" && c.type !== "group" && c.name.toLowerCase().includes(memberQuery.toLowerCase()))
                        .map(c => {
                          const selected = newGroupMembers.includes(c.id)
                          return (
                            <button 
                              key={c.id}
                              onClick={() => {
                                if (selected) {
                                  setNewGroupMembers(prev => prev.filter(id => id !== c.id))
                                } else {
                                  setNewGroupMembers(prev => [...prev, c.id])
                                }
                              }}
                              className="flex w-full items-center justify-between rounded-xl p-2 transition-colors hover:bg-[#fafafa] dark:hover:bg-[#27272a]"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <GradientAvatar tone={c.tone} className="h-10 w-10 shrink-0" />
                                <div className="flex min-w-0 flex-1 flex-col text-left">
                                  <span className="truncate text-[15px] font-medium text-[#0a0a0a] dark:text-white">{c.name}</span>
                                  <span className="truncate text-[13px] text-[#737373] dark:text-[#a1a1aa]">{c.systemRole || c.brandName || "Contact"}</span>
                                </div>
                              </div>
                              <div className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#0a0a0a] bg-[#0a0a0a] text-white dark:border-white dark:bg-white dark:text-[#0a0a0a]" : "border-[#d4d4d8] dark:border-[#3f3f46] text-transparent"}`}>
                                <Check className="h-3 w-3" />
                              </div>
                            </button>
                          )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {popoverView === "create-group-info" && (
                <div className="flex flex-col h-full w-full">
                  <div className="flex items-center justify-between p-3 shrink-0">
                    <button 
                      onClick={() => setPopoverView("create-group-members")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#efefef] dark:hover:bg-[#27272a] transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-[#a1a1aa]" />
                    </button>
                    <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">New group</span>
                    <button 
                      onClick={() => {
                        const membersToSave = conversations
                          .filter(c => c.type !== "community" && c.type !== "group" && newGroupMembers.includes(c.id))
                          .map(c => ({ id: c.id, name: c.name, role: c.systemRole || "Member", tone: c.tone }))
                        createBrandGroup(newGroupName, membersToSave)
                        setPopoverOpen(false)
                      }}
                      disabled={!newGroupName.trim()}
                      className={`text-[15px] font-semibold px-2 ${newGroupName.trim() ? "text-[#0a0a0a] dark:text-white hover:opacity-70" : "text-[#a1a1aa] cursor-not-allowed"}`}
                    >
                      Create
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2 flex flex-col gap-6">
                    {/* Info Box */}
                    <div className="flex items-center gap-4 py-2 px-1">
                      <button
                        onClick={() => {
                          const currentIndex = TONES.indexOf(newGroupTone)
                          const nextIndex = (currentIndex + 1) % TONES.length
                          setNewGroupTone(TONES[nextIndex])
                        }}
                        className="relative group shrink-0"
                      >
                        <GradientAvatar tone={newGroupTone} className="h-16 w-16 rounded-full transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Picture className="h-5 w-5 text-white" />
                        </div>
                      </button>
                      <div className="flex-1 flex items-center gap-2 min-w-0">
                        <PencilToLine className="h-4 w-4 shrink-0 text-[#a1a1aa]" />
                        <input 
                          autoFocus
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Group name (optional)"
                          className="w-full bg-transparent text-[15px] font-semibold text-[#0a0a0a] outline-none placeholder:font-normal placeholder:text-[#a1a1aa] dark:text-white"
                        />
                      </div>
                    </div>
                    
                    {/* Settings Box */}
                    <div className="flex flex-col rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-[#f4f4f5] dark:border-white/5">
                        <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate pr-2">Disappearing messages</span>
                        <BlueSwitch />
                      </div>
                      <button 
                        onClick={() => setPopoverView("create-group-permissions")}
                        className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate pr-2">Group permissions</span>
                        <span className="text-[12px] shrink-0 text-[#71717a] dark:text-[#a1a1aa]">&gt;</span>
                      </button>
                    </div>

                    {/* Members List */}
                    <div className="flex flex-col gap-3 px-1">
                      <span className="text-[13px] font-semibold text-[#71717a] dark:text-[#a1a1aa]">Members: {newGroupMembers.length} of 1,023</span>
                      <div className="flex flex-wrap gap-4">
                        {newGroupMembers.map(id => {
                          const member = conversations.find(c => c.id === id)
                          if (!member) return null
                          return (
                            <div key={id} className="flex flex-col items-center gap-1 relative w-[52px]">
                              <div className="relative">
                                <GradientAvatar tone={member.tone} className="h-12 w-12" />
                                <button 
                                  onClick={() => setNewGroupMembers(prev => prev.filter(m => m !== id))}
                                  className="absolute -right-1 -top-1 bg-[#a1a1aa] dark:bg-[#3f3f46] rounded-full p-[2px] border-2 border-[#18181b] dark:border-[#18181b]"
                                >
                                  <Xmark className="h-3 w-3 text-white" />
                                </button>
                              </div>
                              <span className="text-[12px] font-medium text-[#0a0a0a] dark:text-white truncate w-full text-center">{member.name.split(" ")[0]}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {popoverView === "create-group-permissions" && (
                <div className="flex flex-col h-full w-full">
                  <div className="flex items-center justify-between p-3 shrink-0">
                    <button 
                      onClick={() => setPopoverView("create-group-info")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#efefef] dark:hover:bg-[#27272a] transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-[#a1a1aa]" />
                    </button>
                    <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">Group permissions</span>
                    <div className="w-8" />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                      <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white px-1">Members can</span>
                      <div className="flex flex-col rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
                          <div className="flex items-center justify-between p-4 border-b border-[#f4f4f5] dark:border-white/5">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <PencilToLine className="size-[18px] shrink-0 text-[#0a0a0a] dark:text-white" />
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate">Edit group settings</span>
                              <span className="text-[13px] text-[#71717a] dark:text-[#a1a1aa] leading-5 mt-0.5 line-clamp-2">This includes the group name, icon, description, disappearing message timer, advanced chat privacy...</span>
                            </div>
                          </div>
                          <BlueSwitch defaultSelected />
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-[#f4f4f5] dark:border-white/5">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <Picture className="size-[18px] shrink-0 text-[#0a0a0a] dark:text-white" />
                            <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate">Send new messages</span>
                          </div>
                          <BlueSwitch defaultSelected />
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-[#f4f4f5] dark:border-white/5">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <Person className="size-[18px] shrink-0 text-[#0a0a0a] dark:text-white" />
                            <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate">Add other members</span>
                          </div>
                          <BlueSwitch defaultSelected />
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <Link className="size-[18px] shrink-0 text-[#0a0a0a] dark:text-white" />
                            <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate">Invite via link or QR code</span>
                          </div>
                          <BlueSwitch defaultSelected />
                        </div>
                      </div>
                      <span className="text-[12px] text-[#71717a] dark:text-[#a1a1aa] leading-tight px-1">
                        Turning off these settings means that only group admins can perform this action.
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white px-1">Admins can</span>
                      <div className="flex flex-col rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <Person className="size-[18px] shrink-0 text-[#0a0a0a] dark:text-white" />
                            <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white truncate">Approve new members</span>
                          </div>
                          <BlueSwitch />
                        </div>
                      </div>
                      <span className="text-[12px] text-[#71717a] dark:text-[#a1a1aa] leading-tight px-1">
                        When turned on, admins must approve anyone who wants to join this group. <span className="text-[#0a0a0a] dark:text-white cursor-pointer font-medium hover:underline">Learn more</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {popoverView === "create-community-info" && (
                <div className="flex h-[400px] flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#f4f4f5] p-2 dark:border-white/5 shrink-0">
                    <button 
                      onClick={() => setPopoverView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#efefef] dark:hover:bg-[#27272a] transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-[#a1a1aa]" />
                    </button>
                    <span className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">New community</span>
                    <button 
                      onClick={() => {
                        createBrandCommunity(newCommunityName, "")
                        setPopoverOpen(false)
                        setNewCommunityName("")
                        setNewCommunityDescription("")
                      }}
                      disabled={!newCommunityName.trim()}
                      className={`text-[15px] font-semibold px-2 ${newCommunityName.trim() ? "text-[#0a0a0a] dark:text-white hover:opacity-70" : "text-[#a1a1aa] cursor-not-allowed"}`}
                    >
                      Create
                    </button>
                  </div>
                  
                  <div className="flex-1 px-3 pb-4 pt-2 flex flex-col gap-6">
                    {/* Info Box */}
                    <div className="flex flex-col items-center gap-6 pt-2 pb-10 px-1">
                      <button
                        onClick={() => {
                          const currentIndex = TONES.indexOf(newCommunityTone)
                          const nextIndex = (currentIndex + 1) % TONES.length
                          setNewCommunityTone(TONES[nextIndex])
                        }}
                        className="relative group shrink-0"
                      >
                        <GradientAvatar isCommunity tone={newCommunityTone} className="h-20 w-20 transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 rounded-[25%] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Picture className="h-6 w-6 text-white" />
                        </div>
                      </button>
                      <div className="w-full flex flex-col gap-3 min-w-0">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-semibold text-[#71717a] dark:text-[#a1a1aa] px-1 uppercase tracking-wider">Community Name</label>
                          <div className="flex items-center gap-2 rounded-xl border border-[#e4e4e7] bg-white px-3 py-2.5 dark:border-[#27272a] dark:bg-[#111111] focus-within:ring-2 focus-within:ring-[#0a0a0a]/10 dark:focus-within:ring-white/10 transition-shadow">
                            <input 
                              autoFocus
                              value={newCommunityName}
                              onChange={(e) => setNewCommunityName(e.target.value)}
                              placeholder="e.g. Design Team"
                              className="w-full bg-transparent text-[14px] font-medium text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-semibold text-[#71717a] dark:text-[#a1a1aa] px-1 uppercase tracking-wider">Description</label>
                          <div className="flex items-start gap-2 rounded-xl border border-[#e4e4e7] bg-white px-3 py-2.5 dark:border-[#27272a] dark:bg-[#111111] focus-within:ring-2 focus-within:ring-[#0a0a0a]/10 dark:focus-within:ring-white/10 transition-shadow">
                            <textarea 
                              value={newCommunityDescription}
                              onChange={(e) => setNewCommunityDescription(e.target.value)}
                              placeholder="What is this community about?"
                              className="w-full min-h-[80px] resize-none bg-transparent text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#a1a1aa] dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Popover.Content>
          </Popover>
        </div>
      )}

      {isCreating && draftState ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="rounded-2xl border border-[#efefef] bg-white p-3 dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0a0a0a] text-sm font-bold text-white dark:bg-white dark:text-[#0a0a0a]">
                {draftState.name ? draftState.name.substring(0, 1).toUpperCase() : (activeId === "create-workspace" ? "W" : "G")}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-[16px] font-bold text-[#0a0a0a] dark:text-white">{draftState.name || "Draft " + (activeId === "create-workspace" ? "Workspace" : "Group")}</span>
                <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">{draftState.selectedMembers.length} member{draftState.selectedMembers.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-[#efefef] pt-3 dark:border-white/10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#a1a1aa]">Draft summary</p>
              <div className="mt-2 flex items-center justify-between text-[13px]"><span className="text-[#737373] dark:text-[#a1a1aa]">Members</span><span className="font-semibold text-[#0a0a0a] dark:text-white">{draftState.selectedMembers.length}</span></div>
              {activeId === "create-workspace" && <div className="mt-2 flex items-center justify-between text-[13px]"><span className="text-[#737373] dark:text-[#a1a1aa]">Channels</span><span className="font-semibold text-[#0a0a0a] dark:text-white">{draftState.channels.length}</span></div>}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 pb-3">
            <div className="relative">
              <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
              <input
                aria-label="Search messages"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-full border-none bg-white pl-9 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none shadow-sm dark:bg-[#1f1f1f] dark:text-white"
              />
            </div>
          </div>


          <div className="flex items-center gap-2 px-4 pb-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                  filter === f
                    ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
                    : "bg-[#efefef] text-[#52525b] hover:bg-[#e4e4e7] dark:bg-[#1f1f1f] dark:text-[#a1a1aa] dark:hover:bg-[#27272a]",
                )}
              >
                {f}
              </button>
            ))}
          </div>

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
                    onDelete={onDeleteConversation}
                  />
                  {isCommunity && isExpanded && c.channels && (
                    <div className="ml-[68px] mt-1 flex flex-col gap-1 pb-3 pr-2">
                      {c.channels.map((ch) => (
                        <button
                          key={ch.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelect(`${c.id}:${ch.id}`)
                          }}
                          className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-left text-[13px] font-medium transition-colors ${
                            activeId === `${c.id}:${ch.id}`
                              ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
                              : "text-[#737373] hover:bg-[#fafafa] dark:text-[#a1a1aa] dark:hover:bg-[#18181b]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[14px] text-[#a1a1aa] dark:text-[#737373]">#</span>
                            {ch.name}
                            {ch.private && <Lock className="h-3 w-3 text-[#a1a1aa] dark:text-[#737373]" />}
                          </span>
                          {ch.unread ? (
                            <span className="flex h-5 items-center justify-center rounded-full bg-[#0a0a0a] px-2 text-[11px] font-bold text-white dark:bg-white dark:text-[#0a0a0a]">
                              {ch.unread}
                            </span>
                          ) : null}
                        </button>
                      ))}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowCreateChannel(c.id)
                        }}
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-left text-[14px] font-medium text-[#737373] transition-colors hover:bg-[#fafafa] dark:text-[#a1a1aa] dark:hover:bg-[#18181b]"
                      >
                        <Plus className="h-4 w-4" /> Add channel
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {showCreateChannel && (
        <CreateChannelModal communityId={showCreateChannel} onClose={() => setShowCreateChannel(null)} />
      )}
    </div>
  )
}
