"use client"

import { useRef, useEffect } from "react"
import { ChevronsExpandUpRight, Xmark } from "@gravity-ui/icons"
import { useSupportChat } from "@/components/support/support-chat-provider"
import { MessageItem } from "@/components/messages/message-item"
import { Composer } from "@/components/messages/composer"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SupportChatToast() {
  const { isOngoing, isOpen, setIsOpen, messages, sendMessage, isNativeChatMounted, endChat } = useSupportChat()
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  const bottomClass = pathname === "/" ? "bottom-[96px]" : "bottom-6"

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  // Don't render if there's no ongoing chat OR if the user is looking at the native support chat
  if (!isOngoing || isNativeChatMounted) {
    return null
  }

    if (isOpen) {
    return (
      <div className={cn("fixed right-6 z-40 hidden h-[540px] w-[380px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.16)] dark:bg-[#1f1f1f] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] lg:flex animate-in slide-in-from-bottom-2 transition-all duration-300", bottomClass)}>
        <div className="flex shrink-0 items-center justify-between border-b border-[#efefef] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#1f1f1f]">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <GradientAvatar tone="blue" isCommunity={false} className="h-8 w-8" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22c55e] dark:border-[#1f1f1f]" />
            </div>
            <div>
              <p className="text-[15px] font-bold leading-tight text-[#0a0a0a] dark:text-white">Live Support</p>
              <p className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">Sarah M. is connected</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={endChat}
              className="mr-1 px-2.5 h-7 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[12px] font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              End
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                router.push("/support")
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]"
              aria-label="Expand to full page"
            >
              <ChevronsExpandUpRight width={22} height={22} className="text-[#0a0a0a] dark:text-white" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]"
              aria-label="Minimize support chat"
            >
              <Xmark width={24} height={24} className="text-[#0a0a0a] dark:text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 py-4 dark:bg-[#1f1f1f]">
          {messages.map((m) => (
            <MessageItem key={m.id} message={m} />
          ))}
          <div ref={bottomRef} className="h-2" />
        </div>

        <Composer onSend={sendMessage} />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className={cn("fixed right-6 z-40 hidden items-center gap-3 rounded-full bg-white px-5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_10px_34px_rgba(0,0,0,0.18)] dark:bg-[#1f1f1f] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_10px_34px_rgba(0,0,0,0.6)] lg:flex animate-in slide-in-from-bottom-2 transition-all duration-300", bottomClass)}
    >
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full">
        <GradientAvatar tone="blue" isCommunity={false} className="h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#1f1f1f]" />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22c55e] dark:border-[#1f1f1f]" />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="text-[16px] leading-tight font-semibold text-[#0a0a0a] dark:text-white">Live Support</span>
        <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa]">Sarah M.</span>
      </div>
    </button>
  )
}
