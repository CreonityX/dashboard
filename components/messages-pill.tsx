"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { CommentFill, ChevronsExpandUpRight, Xmark, ChevronLeft, ChevronDown, ChevronUp } from "@gravity-ui/icons"
import { Badge, Typography } from "@heroui/react"
import { conversations as seed, type Message } from "@/lib/messages-data"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { MessageItem } from "@/components/messages/message-item"
import { Composer } from "@/components/messages/composer"
import { cn } from "@/lib/utils"

export function MessagesPill() {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null) // can be 'dmId' or 'communityId:channelId'
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(null)
  const [extra, setExtra] = useState<Record<string, Message[]>>({})
  const bottomRef = useRef<HTMLDivElement>(null)

  // Calculate total unread messages (including community channels)
  const unreadCount = seed.reduce((acc, c) => {
    if (c.type === "community" && c.channels) {
      return acc + c.channels.reduce((sum, ch) => sum + (ch.unread || 0), 0)
    }
    return acc + (c.unread || 0)
  }, 0)

  const activeConvoId = activeId?.split(":")[0]
  const activeChannelId = activeId?.split(":")[1]

  const activeConvo = useMemo(
    () => (activeConvoId ? seed.find((c) => c.id === activeConvoId) : null),
    [activeConvoId],
  )

  const activeChannel = useMemo(
    () => (activeConvo && activeChannelId ? activeConvo.channels?.find((ch) => ch.id === activeChannelId) : null),
    [activeConvo, activeChannelId]
  )

  const activeMessages = useMemo(
    () => {
      if (!activeConvo) return []
      const baseMessages = activeChannel?.messages ?? activeConvo.messages ?? []
      const key = activeId! 
      return [...baseMessages, ...(extra[key] ?? [])]
    },
    [activeConvo, activeChannel, extra, activeId],
  )

  useEffect(() => {
    if (activeId) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages, activeId])

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
  }

  // Use conversations that have unread messages for the pill avatars
  const unreadConvos = seed.filter((c) => {
    if (c.type === "community" && c.channels) {
      return c.channels.some(ch => ch.unread && ch.unread > 0)
    }
    return c.unread && c.unread > 0
  })
  const pillConvos = unreadConvos.length > 0 ? unreadConvos : seed.slice(0, 5)

  if (open) {
    return (
      <div className="fixed bottom-6 right-6 z-40 hidden h-[540px] w-[380px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:bg-[#1f1f1f] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] lg:flex">
        {activeId && activeConvo ? (
          // CHAT VIEW
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-[#efefef] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#1f1f1f]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]"
                >
                  <ChevronLeft className="h-6 w-6 text-[#0a0a0a] dark:text-white" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <GradientAvatar 
                      tone={activeConvo.tone} 
                      isCommunity={!activeChannel && activeConvo.type === "community"} 
                      className="h-8 w-8" 
                    />
                    {activeChannel && (
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-[4px] bg-white dark:bg-[#1f1f1f]">
                        <GradientAvatar tone={activeConvo.tone} isCommunity className="h-2.5 w-2.5" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Typography type="h6" className="font-bold leading-tight text-[#0a0a0a] dark:text-white">
                      {activeChannel ? `# ${activeChannel.name}` : activeConvo.name}
                    </Typography>
                    {activeChannel && (
                      <Typography type="body-xs" className="font-medium leading-tight text-[#6b6b6b] dark:text-[#a1a1aa]">
                        {activeConvo.name}
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/messages"
                  onClick={() => setOpen(false)}
                  aria-label="Expand to full view"
                  className="text-[#0a0a0a] transition-opacity hover:opacity-60 dark:text-white"
                >
                  <ChevronsExpandUpRight width={20} height={20} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setActiveId(null)
                  }}
                  aria-label="Close messages"
                  className="text-[#0a0a0a] transition-opacity hover:opacity-60 dark:text-white"
                >
                  <Xmark width={22} height={22} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white px-4 py-4 dark:bg-[#0a0a0a]">
              <div className="flex flex-col gap-3">
                {activeMessages.map((m) => (
                  <MessageItem key={m.id} message={m} />
                ))}
                <div ref={bottomRef} />
              </div>
            </div>

            <Composer onSend={handleSend} />
          </>
        ) : (
          // LIST VIEW
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-[#efefef] bg-white px-6 pb-3 pt-5 dark:border-white/10 dark:bg-[#1f1f1f]">
              <Typography type="h3" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white">Messages</Typography>
              <div className="flex items-center gap-4">
                <Link
                  href="/messages"
                  onClick={() => setOpen(false)}
                  aria-label="Expand messages"
                  className="text-[#0a0a0a] transition-opacity hover:opacity-60 dark:text-white"
                >
                  <ChevronsExpandUpRight width={22} height={22} />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close messages"
                  className="text-[#0a0a0a] transition-opacity hover:opacity-60 dark:text-white"
                >
                  <Xmark width={24} height={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white px-4 py-2 dark:bg-[#1f1f1f]">
              {seed.map((c) => {
                const isExpanded = expandedCommunity === c.id
                const isCommunity = c.type === "community"
                
                return (
                  <div key={c.id}>
                    <button
                      onClick={() => {
                        if (isCommunity) {
                          setExpandedCommunity(isExpanded ? null : c.id)
                        } else {
                          setActiveId(c.id)
                        }
                      }}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]",
                        isExpanded && "bg-[#f4f4f5] dark:bg-[#27272a]"
                      )}
                    >
                      <GradientAvatar tone={c.tone} isCommunity={isCommunity} className="h-14 w-14" />
                      <div className="min-w-0 flex-1">
                        <Typography type="h6" className="font-bold leading-tight text-[#0a0a0a] dark:text-white">{c.name}</Typography>
                        <Typography type="body-sm" className="mt-0.5 truncate font-normal text-[#6b6b6b] dark:text-[#a1a1aa]">
                          {isCommunity ? (
                            c.channels ? `${c.channels.length} channels` : "Community"
                          ) : c.unread && c.unread > 1 ? (
                            <span className="font-semibold text-[#0a0a0a] dark:text-white">
                              {c.unread} new messages
                            </span>
                          ) : (
                            <span className={c.unread ? "font-semibold text-[#0a0a0a] dark:text-white" : ""}>
                              {c.preview}
                            </span>
                          )}
                        </Typography>
                      </div>
                      {isCommunity ? (
                        <span className="shrink-0 text-[#6b6b6b] dark:text-[#a1a1aa]">
                          {isExpanded ? <ChevronUp width={20} height={20} /> : <ChevronDown width={20} height={20} />}
                        </span>
                      ) : (
                        <div className="flex shrink-0 items-center gap-2 text-[14px] font-normal text-[#6b6b6b] dark:text-[#a1a1aa]">
                          {c.unread ? <span className="h-2 w-2 rounded-full bg-[#3897f0]" /> : null}
                          <span>{c.time}</span>
                        </div>
                      )}
                    </button>

                    {isCommunity && isExpanded && c.channels && (
                      <div className="ml-[68px] mt-1 flex flex-col gap-1 pb-3 pr-2">
                        {c.channels.map(ch => (
                          <button
                            key={ch.id}
                            onClick={() => setActiveId(`${c.id}:${ch.id}`)}
                            className="flex items-center justify-between rounded-xl px-4 py-2.5 text-left transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]"
                          >
                            <Typography type="body-sm" className="font-medium text-[#0a0a0a] dark:text-white"># {ch.name}</Typography>
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
          </>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="fixed bottom-6 right-6 z-40 hidden items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_10px_34px_rgba(0,0,0,0.18)] dark:bg-[#1f1f1f] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_10px_34px_rgba(0,0,0,0.6)] lg:flex"
    >
      <Badge.Anchor>
        <CommentFill width={26} height={26} className="text-[#0a0a0a] dark:text-white" />
        {unreadCount > 0 && (
          <Badge color="danger" size="sm" placement="top-right">
            {unreadCount}
          </Badge>
        )}
      </Badge.Anchor>
      <Typography type="h5" className="font-semibold text-[#0a0a0a] dark:text-white">Messages</Typography>
      <div className="ml-1 flex items-center -space-x-2">
        {pillConvos.slice(0, 3).map((c, i) => (
          <div key={c.id} className="relative flex h-7 w-7 items-center justify-center rounded-full" style={{ zIndex: 10 - i }}>
            <GradientAvatar tone={c.tone} isCommunity={false} className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#1f1f1f]" />
          </div>
        ))}
      </div>
    </button>
  )
}
