"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { type Conversation, type Message } from "@/lib/messages-data"
import { useAuth } from "@/context/auth-context"
import { useRealtime, type RealtimeEvent } from "@/lib/realtime"
import {
  getChannelMessagesAction,
  getCommChannelsAction,
  getDmMessagesAction,
  getDmThreadsAction,
  getUnreadCountsAction,
  markChannelReadAction,
  markDmReadAction,
  sendChannelMessageAction,
  sendDmMessageAction,
} from "@/app/actions/comms"
import type { CommChannel, CommMessage, DmThread } from "@/lib/api"
import { ConversationList } from "@/components/messages/conversation-list"
import { ChatHeader } from "@/components/messages/chat-header"
import { MessageItem } from "@/components/messages/message-item"
import { Composer } from "@/components/messages/composer"
import { InfoPanel } from "@/components/messages/info-panel"
import { CreateFlow } from "@/components/messages/create-flow"
import { TypingIndicator } from "@/components/ui/typing-indicator"
import { useAccount } from "@/context/account-context"
import { toast } from "sonner"
import { Button } from "@heroui/react"

export type DraftState = {
  name: string
  description: string
  selectedMembers: string[]
  memberRoles: Record<string, "admin" | "member">
  channels: { id: string; name: string; private: boolean; members: string[] }[]
}

export const defaultDraft: DraftState = {
  name: "",
  description: "",
  selectedMembers: [],
  memberRoles: {},
  channels: [{ id: "general", name: "general", private: false, members: [] }]
}

export function MessagesApp() {
  const { isBrand, brandConversations, appendBrandMessage, resolveBrandReview, deleteBrandConversation } = useAccount()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [extra, setExtra] = useState<Record<string, Message[]>>({})
  const [typing, setTyping] = useState<Record<string, boolean>>({})
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [pendingSelection, setPendingSelection] = useState<string | null>(null)
  const [showCancelPrompt, setShowCancelPrompt] = useState(false)
  const [draftState, setDraftState] = useState<DraftState>(defaultDraft)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeConvoId = activeId ? activeId.split(":")[0] : null
  const activeChannelId = activeId ? activeId.split(":")[1] : null

  // ── Creator live data (brand branch below is untouched) ──────────────────
  const me = useAuth()
  const [channels, setChannels] = useState<CommChannel[]>([])
  const [threads, setThreads] = useState<DmThread[]>([])
  const [liveMsgs, setLiveMsgs] = useState<Record<string, CommMessage[]>>({})
  const [unread, setUnread] = useState<{ channels: Record<string, number>; dms: Record<string, number> }>({
    channels: {},
    dms: {},
  })
  const [onlineByUser, setOnlineByUser] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState<Set<string>>(new Set())

  const toUiMessage = (row: CommMessage): Message => ({
    id: row.id,
    sender: row.authorId === me.id ? "me" : "them",
    time: new Date(row.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    kind: "text",
    text: row.body,
  })

  const refreshUnread = async () => {
    const res = await getUnreadCountsAction()
    if (!res.success) return
    setUnread({
      channels: Object.fromEntries(res.data.channels.map((c) => [c.id, c.unreadCount])),
      dms: Object.fromEntries(res.data.dms.map((d) => [d.id, d.unreadCount])),
    })
  }

  // Initial load: channels + DM threads + unread counts.
  useEffect(() => {
    if (isBrand) return
    let cancelled = false
    void (async () => {
      const [ch, dm] = await Promise.all([getCommChannelsAction(), getDmThreadsAction()])
      if (cancelled) return
      if (ch.success) setChannels(ch.data)
      if (dm.success) setThreads(dm.data)
      await refreshUnread()
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrand])

  const workspaceId = channels[0]?.workspaceId ?? null

  const loadMessages = async (convoId: string, channelId?: string | null) => {
    const key = channelId ? `ch:${channelId}` : convoId
    if (loaded.has(key)) return
    if (channelId) {
      const res = await getChannelMessagesAction(channelId, { limit: 50 })
      if (!res.success) return
      const rows = [...res.data].reverse()
      setLiveMsgs((prev) => ({ ...prev, [key]: rows }))
      setLoaded((prev) => new Set(prev).add(key))
      const latest = rows[rows.length - 1]
      if (latest) void markChannelReadAction(channelId, latest.id)
    } else if (convoId.startsWith("dm:")) {
      const threadId = convoId.slice(3)
      const res = await getDmMessagesAction(threadId, { limit: 50 })
      if (!res.success) return
      const rows = [...res.data].reverse()
      setLiveMsgs((prev) => ({ ...prev, [key]: rows }))
      setLoaded((prev) => new Set(prev).add(key))
      const latest = rows[rows.length - 1]
      if (latest) void markDmReadAction(threadId, latest.id)
    }
    void refreshUnread()
  }

  // Live updates from the workspace socket.
  const handleRealtime = (event: RealtimeEvent) => {
    if (event.type === "message.created" && (event.channelId || event.dmThreadId)) {
      const row: CommMessage = {
        id: event.messageId as string,
        channelId: (event.channelId as string) ?? null,
        dmThreadId: (event.dmThreadId as string) ?? null,
        authorId: event.authorId as string,
        body: event.body as string,
        parentMessageId: (event.parentMessageId as string) ?? null,
        replyCount: 0,
        createdAt: event.createdAt as string,
        editedAt: null,
        deletedAt: null,
      }
      const key = event.channelId ? `ch:${event.channelId}` : `dm:${event.dmThreadId}`
      setLiveMsgs((prev) => {
        const cur = prev[key] ?? []
        if (cur.some((m) => m.id === row.id)) return prev
        return { ...prev, [key]: [...cur, row] }
      })
      void refreshUnread()
    } else if (event.type === "typing.start" || event.type === "typing.stop") {
      if (event.userId === me.id) return  // ignore our own typing
      const key = `${workspaceId}:${event.channelId}`
      setTyping((prev) => ({ ...prev, [key]: event.type === "typing.start" }))
    } else if (event.type === "user.presence") {
      setOnlineByUser((prev) => ({ ...prev, [event.userId as string]: event.status === "online" }))
    } else if (event.type === "channel.updated") {
      void (async () => {
        const res = await getCommChannelsAction()
        if (res.success) setChannels(res.data)
      })()
    }
  }
  const { sendTyping } = useRealtime(isBrand ? null : workspaceId, handleRealtime)

  const creatorConversations: Conversation[] = !isBrand
    ? [
        ...(channels.length
          ? [
              {
                id: workspaceId ?? "workspace",
                name: `${me.name ?? "My"} Workspace`,
                handle: "",
                tone: "gray",
                type: "community",
                role: "admin",
                channels: channels.map((ch: { id: string; name: string; unread?: number }) => ({
                  id: ch.id,
                  name: ch.name,
                  unread: unread.channels[ch.id] ?? 0,
                  messages: (liveMsgs[`ch:${ch.id}`] ?? []).map(toUiMessage),
                })),
                members: [],
                preview: "",
                time: "",
                unread: Object.values(unread.channels).reduce((n, c) => n + c, 0),
                messages: [],
              } as Conversation,
            ]
          : []),
        ...threads.map((t) => {
          const other = t.participants.find((x) => x.userId !== me.id)
          const label = other ? other.email.split("@")[0] ?? other.email : "Direct message"
          const msgs = (liveMsgs[`dm:${t.id}`] ?? []).map(toUiMessage)
          const last = msgs[msgs.length - 1]
          return {
            id: `dm:${t.id}`,
            name: label,
            handle: other?.email ?? "",
            tone: "blue",
            type: "dm",
            online: other ? (onlineByUser[other.userId] ?? false) : false,
            preview: last && last.kind === "text" ? last.text : "",
            time: last?.time ?? "",
            unread: unread.dms[t.id] ?? 0,
            messages: msgs,
          } as Conversation
        }),
      ]
    : []

  const conversations = isBrand ? brandConversations : creatorConversations
  const conversation = useMemo(
    () => (activeConvoId ? conversations.find((c) => c.id === activeConvoId) ?? null : null),
    [activeConvoId, conversations],
  )

  const activeChannel = useMemo(
    () => (activeChannelId && conversation?.channels ? conversation.channels.find((ch: { id: string }) => ch.id === activeChannelId) : null),
    [activeChannelId, conversation]
  )

  const messages = useMemo(
    () => {
      if (!conversation || !activeId) return []
      const baseMessages = activeChannel?.messages ?? conversation.messages ?? []
      return [...baseMessages, ...(extra[activeId] ?? [])]
    },
    [conversation, activeChannel, extra, activeId],
  )

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (activeId && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, activeId])

  function handleSend(text: string) {
    if (!activeId) return
    sendTyping(activeChannelId ?? "", false)
    // Creator branch: persist via the API. The socket fan-out echoes
    // the row back (including to this client), which merges it in —
    // but we also append immediately so empty states resolve fast.
    if (!isBrand) {
      void (async () => {
        const parentId =
          replyingTo &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(replyingTo.id)
            ? replyingTo.id
            : undefined
        const res = activeChannelId
          ? await sendChannelMessageAction(activeChannelId, {
              body: text,
              ...(parentId ? { parentMessageId: parentId } : {}),
            })
          : activeConvoId?.startsWith("dm:")
            ? await sendDmMessageAction(activeConvoId.slice(3), text)
            : null
        if (!res) return
        if (!res.success) {
          toast.error(res.error)
          return
        }
        const key = activeChannelId ? `ch:${activeChannelId}` : activeId
        setLiveMsgs((prev) => {
          const cur = prev[key] ?? []
          if (cur.some((m) => m.id === res.data.id)) return prev
          return { ...prev, [key]: [...cur, res.data] }
        })
        setLoaded((prev) => new Set(prev).add(key))
        setReplyingTo(null)
      })()
      return
    }
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    const message: Message = {
      id: `${activeId}-${Date.now()}`, sender: "me", time: now, kind: "text", text, replyTo: replyingTo || undefined,
    }
    if (isBrand && activeConvoId) appendBrandMessage(activeConvoId, activeChannelId ?? undefined, message)
    else setExtra((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), message],
    }))
    setReplyingTo(null)

    // Simulate typing indicator response
    setTyping((prev) => ({ ...prev, [activeId]: true }))
    setTimeout(() => {
      setTyping((prev) => ({ ...prev, [activeId]: false }))
      const replyTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      const reply: Message = { id: `${activeId}-reply-${Date.now()}`, sender: "them", time: replyTime, kind: "text", text: "Got it! I'll look into that and get right back to you." }
      if (isBrand && activeConvoId) appendBrandMessage(activeConvoId, activeChannelId ?? undefined, reply)
      else setExtra((prev) => ({
        ...prev,
        [activeId]: [
          ...(prev[activeId] ?? []),
          reply,
        ],
      }))
    }, 2000)
  }

  function handleReschedule(originalMsg: any, newDate: string, newTime: string) {
    if (!activeId) return
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

    // newDate is "YYYY-MM-DD"
    const [year, month, day] = newDate.split("-").map(Number)
    const dateObj = new Date(year, month - 1, day)
    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

    // newTime is "HH:MM-HH:MM"
    const [start, end] = newTime.split("-")
    const formatTimeStr = (t: string) => {
      const [h, m] = t.split(":").map(Number)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
    }
    const formattedTime = `${formatTimeStr(start)} – ${formatTimeStr(end)}`

    const booking: Message = { id: `${activeId}-${Date.now()}`, sender: "me", time: now, kind: "booking", title: originalMsg.title, date: formattedDate, timeRange: formattedTime, status: "pending" }
    if (isBrand && activeConvoId) appendBrandMessage(activeConvoId, activeChannelId ?? undefined, booking)
    else setExtra((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] ?? []),
        booking,
      ],
    }))
  }

  function handleSelect(id: string) {
    if (activeId === "create-workspace" || activeId === "create-group") {
      // If we have unsaved progress, show prompt
      const hasModifiedChannels = draftState.channels.length > 1 || (draftState.channels.length === 1 && draftState.channels[0].id !== "general")
      if (draftState.name || draftState.selectedMembers.length > 0 || hasModifiedChannels) {
        setPendingSelection(id)
        setShowCancelPrompt(true)
        return
      }
    }
    setDraftState(defaultDraft)
    setActiveId(id)
    setMobileView("chat")
    setShowInfo(false)
    if (!isBrand && id && id !== "create-workspace" && id !== "create-group") {
      const [convoId, channelId] = id.split(":")
      void loadMessages(convoId, channelId ?? null)
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-[#0a0a0a]" suppressHydrationWarning>
      {/* Conversation list — shown on mobile if mobileView is "list", always on desktop */}
      <div className={`w-full lg:w-[380px] flex-shrink-0 ${mobileView === "list" ? "block" : "hidden"} lg:block border-r border-[#efefef] dark:border-white/10`}>
        <ConversationList
          activeId={activeId || ""}
          onSelect={handleSelect}
          isBrand={isBrand}
          conversations={conversations}
          draftState={draftState}
          onDeleteConversation={deleteBrandConversation}
        />
      </div>

      {/* Chat pane — shown on mobile if mobileView is "chat", always on desktop */}
      <div className={`flex h-full min-w-0 flex-1 flex-col bg-white dark:bg-[#0a0a0a] md:flex ${mobileView === "chat" ? "flex" : "hidden"}`}>
        {activeId === "create-workspace" || activeId === "create-group" ? (
          <CreateFlow
            key={activeId}
            type={activeId === "create-workspace" ? "workspace" : "group"}
            onComplete={(newId) => {
              setDraftState(defaultDraft)
              setActiveId(newId)
            }}
            onCancel={() => handleSelect("")}
            conversations={conversations}
            isBrand={isBrand}
            draftState={draftState}
            setDraftState={setDraftState}
          />
        ) : !activeId || !conversation ? (
          <div className="flex h-full w-full items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a]">
            {/* Blank state */}
          </div>
        ) : (
          <>
            <ChatHeader
              conversation={conversation}
              activeChannelId={activeChannelId ?? undefined}
              onToggleInfo={() => setShowInfo((s) => !s)}
              onBack={() => setMobileView("list")}
            />

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col">
                {/* Date separator */}
                <div className="flex items-center justify-center py-2 mb-2">
                  <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-[12px] font-medium text-[#737373] dark:bg-[#1f1f1f] dark:text-[#a1a1aa]">
                    Today
                  </span>
                </div>
                {messages.map((m, i) => (
                  <MessageItem
                    key={m.id}
                    message={m}
                    isGrouped={i > 0 && messages[i - 1].sender === m.sender}
                    onReply={(msg) => setReplyingTo(msg)}
                    onReschedule={handleReschedule}
                    onResolveReview={isBrand && activeConvoId ? (status) => { resolveBrandReview(activeConvoId, activeChannelId ?? undefined, m.id, status); toast.success(status === "approved" ? "Deliverable approved" : "Changes requested") } : undefined}
                  />
                ))}

                {(() => {
                  const typingKey = activeChannelId ? `${workspaceId ?? ""}:${activeChannelId}` : null
                  if (!typingKey || !typing[typingKey]) return null
                  return (
                    <div className="py-2 pl-[52px] animate-in fade-in slide-in-bottom-2 duration-300">
                      <TypingIndicator avatar={conversation?.name ? conversation.name.substring(0, 2).toUpperCase() : "AI"} />
                    </div>
                  )
                })()}

                {/* Scroll anchor */}
                <div ref={bottomRef} />
              </div>
            </div>

            <Composer
              onSend={handleSend}
              replyingTo={replyingTo}
              onCancelReply={() => setReplyingTo(null)}
              onTypingChange={
                !isBrand && activeChannelId
                  ? (typing) => sendTyping(activeChannelId, typing)
                  : undefined
              }
            />
          </>
        )}
      </div>

      {/* Info panel — appears on xl screens or as overlay when toggled */}
      {showInfo && conversation && <InfoPanel conversation={conversation} onClose={() => setShowInfo(false)} />}

      {showCancelPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-[#18181b] border border-[#efefef] dark:border-white/10">
            <h3 className="mb-2 text-lg font-bold text-[#0a0a0a] dark:text-white">Discard changes?</h3>
            <p className="mb-6 text-sm text-[#737373] dark:text-[#a1a1aa]">You have unsaved progress. Are you sure you want to discard it?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCancelPrompt(false)} className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-[#27272a] transition-colors text-[#0a0a0a] dark:text-white">Keep Editing</button>
              <button onClick={() => {
                setShowCancelPrompt(false)
                setDraftState(defaultDraft)
                if (pendingSelection !== null) {
                  setActiveId(pendingSelection === "" ? null : pendingSelection)
                  setMobileView(pendingSelection === "" ? "list" : "chat")
                  setPendingSelection(null)
                }
              }} className="rounded-xl bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626] transition-colors">Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
