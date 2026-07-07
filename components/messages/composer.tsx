"use client"

import { useState } from "react"
import { Button, Popover, ListBox } from "@heroui/react"
import {
  Plus,
  Microphone,
  Camera,
  ArrowUp,
  Picture,
  File as FileIcon,
  Folder,
  Calendar,
} from "@gravity-ui/icons"
import { toast } from "sonner"

type AttachItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const ATTACH_ITEMS: AttachItem[] = [
  { id: "media", label: "Media", icon: Picture },
  { id: "document", label: "Document", icon: FileIcon },
  { id: "drive", label: "Drive", icon: Folder },
  { id: "schedule", label: "Schedule", icon: Calendar },
]

export function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState("")

  function send() {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue("")
    toast.success("Message sent")
  }

  return (
    <div className="shrink-0 border-t border-[#efefef] bg-white px-0 dark:border-white/10 dark:bg-[#0a0a0a]">
      <div className="flex items-center h-[56px] bg-transparent transition-colors focus-within:bg-black/[0.02] dark:focus-within:bg-white/[0.02]">
        {/* Attachment popover */}
        <Popover placement={"top" as any} offset={15} crossOffset={70 as any}>
          <Popover.Trigger>
            <button aria-label="Add attachment" className="h-[56px] w-[56px] shrink-0 flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </Popover.Trigger>
          <Popover.Content className="w-[180px] p-1">
            <ListBox aria-label="Attachment options" className="w-full" selectionMode="none" onAction={() => toast.info("Coming Soon", { description: "This feature is not yet available." })}>
              {ATTACH_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <ListBox.Item key={item.id} id={item.id} textValue={item.label}>
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                      <span className="text-[14px] font-medium text-[#0a0a0a] dark:text-white">{item.label}</span>
                    </div>
                  </ListBox.Item>
                )
              })}
            </ListBox>
          </Popover.Content>
        </Popover>

        {/* Message input — native input for full className control */}
        <input
          aria-label="Message"
          placeholder="Message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              send()
            }
          }}
          className="flex-1 h-full bg-transparent px-2 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none dark:text-white"
        />

        {/* Send / media controls */}
        <div className="flex shrink-0 items-center">
          <button aria-label="Voice message" className="h-[56px] w-[40px] flex items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
            <Microphone className="h-5 w-5" />
          </button>
          <button aria-label="Camera" className="h-[56px] w-[40px] flex sm:hidden items-center justify-center text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors">
            <Camera className="h-5 w-5" />
          </button>
          <button
            aria-label="Send"
            onClick={send}
            className="h-[56px] w-[56px] shrink-0 bg-transparent text-[#0a0a0a] dark:text-white flex items-center justify-center transition-colors hover:text-[#737373] dark:hover:text-[#a1a1aa]"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
