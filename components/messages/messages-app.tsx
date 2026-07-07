"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { conversations as seed, type Message } from "@/lib/messages-data"
import { ConversationList } from "@/components/messages/conversation-list"
import { ChatHeader } from "@/components/messages/chat-header"
import { MessageItem } from "@/components/messages/message-item"
import { Composer } from "@/components/messages/composer"
import { InfoPanel } from "@/components/messages/info-panel"
import { TypingIndicator } from "@/components/ui/typing-indicator"

export function MessagesApp() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [extra, setExtra] = useState<Record<string, Message[]>>({})
  const [typing, setTyping] = useState<Record<string, boolean>>({})
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeConvoId = activeId ? activeId.split(":")[0] : null
  const activeChannelId = activeId ? activeId.split(":")[1] : null

  const conversation = useMemo(
    () => (activeConvoId ? seed.find((c) => c.id === activeConvoId) ?? null : null),
    [activeConvoId],
  )

  const activeChannel = useMemo(
    () => (activeChannelId && conversation?.channels ? conversation.channels.find(ch => ch.id === activeChannelId) : null),
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
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    setExtra((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] ?? []),
        { id: `${activeId}-${Date.now()}`, sender: "me", time: now, kind: "text", text },
      ],
    }))

    // Simulate typing indicator response
    setTyping((prev) => ({ ...prev, [activeId]: true }))
    setTimeout(() => {
      setTyping((prev) => ({ ...prev, [activeId]: false }))
      const replyTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      setExtra((prev) => ({
        ...prev,
        [activeId]: [
          ...(prev[activeId] ?? []),
          { id: `${activeId}-reply-${Date.now()}`, sender: "them", time: replyTime, kind: "text", text: "Got it! I'll look into that and get right back to you." },
        ],
      }))
    }, 2000)
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-[#0a0a0a]" suppressHydrationWarning>
      {/* Conversation list — shown on mobile if mobileView is "list", always on desktop */}
      <div className={`h-full w-full shrink-0 md:w-[360px] md:block ${mobileView === "list" ? "block" : "hidden"}`}>
        <ConversationList
          activeId={activeId || ""}
          onSelect={(id) => {
            setActiveId(id)
            setMobileView("chat")
          }}
        />
      </div>

      {/* Chat pane — shown on mobile if mobileView is "chat", always on desktop */}
      <div className={`flex h-full min-w-0 flex-1 flex-col bg-white dark:bg-[#0a0a0a] md:flex ${mobileView === "chat" ? "flex" : "hidden"}`}>
        {!activeId || !conversation ? (
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
                  />
                ))}
                
                {activeId && typing[activeId] && (
                  <div className="py-2 pl-[52px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TypingIndicator avatar={conversation?.name ? conversation.name.substring(0, 2).toUpperCase() : "AI"} />
                  </div>
                )}

                {/* Scroll anchor */}
                <div ref={bottomRef} />
              </div>
            </div>

            <Composer onSend={handleSend} />
          </>
        )}
      </div>

      {/* Info panel — appears on xl screens or as overlay when toggled */}
      {showInfo && conversation && <InfoPanel conversation={conversation} onClose={() => setShowInfo(false)} />}
    </div>
  )
}
