"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import type { Message } from "@/lib/messages-data"

interface SupportChatContextType {
  isOngoing: boolean;
  isOpen: boolean;
  messages: Message[];
  startChat: () => void;
  endChat: () => void;
  setIsOpen: (isOpen: boolean) => void;
  sendMessage: (text: string) => void;
  isNativeChatMounted: boolean;
  setIsNativeChatMounted: (mounted: boolean) => void;
}

const SupportChatContext = createContext<SupportChatContextType | undefined>(undefined)

export function SupportChatProvider({ children }: { children: ReactNode }) {
  const [isOngoing, setIsOngoing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isNativeChatMounted, setIsNativeChatMounted] = useState(false)
  
  // Initialize with a welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-0",
      sender: "them",
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      kind: "text",
      text: "Hi there! How can we help you today?",
    }
  ])

  const startChat = () => {
    setIsOngoing(true)
    setIsOpen(true) // Automatically open if it becomes a toast
  }

  const endChat = () => {
    setIsOngoing(false)
    setIsOpen(false)
    setMessages([
      {
        id: "msg-0",
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        kind: "text",
        text: "Hi there! How can we help you today?",
      }
    ])
  }

  const sendMessage = (text: string) => {
    const now = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, sender: "me", time: now, kind: "text", text },
    ])

    // Simulate auto-reply
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}-reply`, sender: "them", time: replyTime, kind: "text", text: "Thanks for your message. An agent will be with you shortly." },
      ])
    }, 1500)
  }

  return (
    <SupportChatContext.Provider value={{
      isOngoing,
      isOpen,
      messages,
      startChat,
      endChat,
      setIsOpen,
      sendMessage,
      isNativeChatMounted,
      setIsNativeChatMounted
    }}>
      {children}
    </SupportChatContext.Provider>
  )
}

export function useSupportChat() {
  const context = useContext(SupportChatContext)
  if (context === undefined) {
    throw new Error("useSupportChat must be used within a SupportChatProvider")
  }
  return context
}
