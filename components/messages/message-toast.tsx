"use client"

import { useEffect } from "react"
import { Toast, ToastContent, ToastQueue } from "@heroui/react"
import { GradientAvatar } from "./gradient-avatar"

export type MessageToastData = {
  id: string
  sender: string
  message: string
  avatarTone?: [string, string]
  time: string
}

export const messageToastQueue = new ToastQueue<MessageToastData>({ maxVisibleToasts: 3 })

export function MessageToastProvider() {
  useEffect(() => {
    // Expose a global function for testing the new message toast
    ;(window as any).simulateNewMessage = () => {
      messageToastQueue.add({
        id: Date.now().toString(),
        sender: "rishabh",
        message: "Yes",
        avatarTone: ["#e5e7eb", "#d1d5db"], // Default greyish tone for simulation
        time: ""
      }, { timeout: 5000 })
    }
  }, [])

  return (
    <Toast.Provider 
      placement="bottom end" 
      queue={messageToastQueue}
      className="!bottom-[84px] !right-6"
      width={340}
    >
      {({ toast }) => {
        const content = toast.content as MessageToastData

        return (
          <Toast
            toast={toast}
            className="w-full rounded-2xl border-none bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:bg-[#1f1f1f] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-0 overflow-hidden"
          >
            <ToastContent className="p-3 gap-3 flex-row items-center">
              <GradientAvatar tone={content.avatarTone || ["#e5e7eb", "#d1d5db"]} isCommunity={false} className="h-12 w-12 shrink-0 rounded-full" />
              <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight truncate">
                  {content.sender}
                </span>
                <span className="text-[14px] font-medium text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                  {content.message}
                </span>
              </div>
            </ToastContent>
            
            <Toast.CloseButton className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity [&>svg]:size-4 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full p-1" />
          </Toast>
        )
      }}
    </Toast.Provider>
  )
}
