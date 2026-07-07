"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Modal, ListBox, SearchField, Typography } from "@heroui/react"
import { toast } from "sonner"
import { 
  Magnifier, 
  House, 
  CommentFill, 
  ChartAreaStacked, 
  Gear, 
  Moon,
  Folder,
  Tray,
  Person,
  Pin,
  Comment
} from "@gravity-ui/icons"
import { conversations, type Message } from "@/lib/messages-data"
import { GradientAvatar } from "@/components/messages/gradient-avatar"

type Suggestion = {
  id: string
  label: string
  icon: any
  action: () => void
  group: string
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { theme, resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    const handleOpen = () => setIsOpen(true)
    
    document.addEventListener("keydown", down)
    window.addEventListener("open-command-palette", handleOpen)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("open-command-palette", handleOpen)
    }
  }, [])

  const suggestions: Suggestion[] = [
    {
      id: "home",
      label: "Home",
      icon: House,
      group: "Navigation",
      action: () => router.push("/")
    },
    {
      id: "messages",
      label: "Messages",
      icon: CommentFill,
      group: "Navigation",
      action: () => router.push("/messages")
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: ChartAreaStacked,
      group: "Navigation",
      action: () => router.push("/analytics")
    },
    {
      id: "theme",
      label: "Toggle Theme",
      icon: Moon,
      group: "Actions",
      action: () => setTheme(resolvedTheme === "dark" ? "light" : "dark")
    },
    {
      id: "settings",
      label: "Settings",
      icon: Gear,
      group: "Actions",
      action: () => toast.info("Coming Soon", { description: "Settings will be available shortly." })
    }
  ]

  // Filter Navigation
  const filteredNav = suggestions.filter((s) => 
    s.label.toLowerCase().includes(query.toLowerCase())
  )

  // Search People / Communities
  const filteredPeople = query.trim() ? conversations.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  ) : []

  // Search Messages
  const filteredMessages: Array<{ convoId: string, message: Message, name: string }> = []
  if (query.trim()) {
    conversations.forEach(c => {
      if (c.messages) {
        c.messages.forEach(m => {
          if (m.kind === "text" && m.text.toLowerCase().includes(query.toLowerCase())) {
            filteredMessages.push({ convoId: c.id, message: m, name: c.name })
          }
        })
      }
      if (c.channels) {
        c.channels.forEach(ch => {
          ch.messages.forEach(m => {
            if (m.kind === "text" && m.text.toLowerCase().includes(query.toLowerCase())) {
              filteredMessages.push({ convoId: c.id, message: m, name: `${c.name} - ${ch.name}` })
            }
          })
        })
      }
    })
  }

  const hasResults = filteredNav.length > 0 || filteredPeople.length > 0 || filteredMessages.length > 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60 transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Palette */}
      <div 
        className="relative flex w-full max-w-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-[#18181b] dark:ring-white/10 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center pl-3 pr-4 py-3 border-b border-[#efefef] dark:border-white/10">
          <SearchField 
            name="search" 
            autoFocus
            className="flex-1"
            classNames={{
              inputWrapper: "!bg-transparent !border-none !shadow-none !px-0",
              input: "!text-[16px] !text-[#0a0a0a] dark:!text-white placeholder:!text-[#a1a1aa]"
            }}
            value={query}
            onChange={(val) => setQuery(val)}
            onKeyDown={(e: any) => {
              if (e.key === "Escape") {
                setIsOpen(false)
              }
            }}
          >
            <SearchField.Group className="flex items-center w-full gap-3 bg-transparent p-0 m-0 border-none shadow-none focus-within:ring-0 focus-within:ring-offset-0 ring-0 h-10">
              <SearchField.SearchIcon className="h-5 w-5 text-[#a1a1aa] shrink-0" />
              <SearchField.Input 
                className="flex-1 bg-transparent text-[16px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none border-none shadow-none dark:text-white" 
                placeholder="Search dashboard, messages, or people..." 
              />
              <SearchField.ClearButton className="text-[#a1a1aa]" />
            </SearchField.Group>
          </SearchField>
          <div className="flex shrink-0 items-center justify-center rounded-[6px] border border-[#efefef] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#a1a1aa] dark:border-white/10 dark:bg-[#27272a] shadow-sm ml-3">
            ESC
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-none">
          {!hasResults && query.trim() ? (
            <Typography type="body-sm" className="block px-4 py-8 text-center text-[#a1a1aa]">
              No results found for "{query}"
            </Typography>
          ) : (
            <ListBox 
              aria-label="Search suggestions" 
              selectionMode="none"
              className="w-full"
              onAction={(key) => {
                const navItem = filteredNav.find(s => s.id === key)
                if (navItem) {
                  navItem.action()
                  setIsOpen(false)
                  setQuery("")
                  return
                }

                if (String(key).startsWith("person:")) {
                  // Could route to specific chat in future
                  router.push(`/messages`)
                  setIsOpen(false)
                  setQuery("")
                  return
                }

                if (String(key).startsWith("msg:")) {
                  router.push(`/messages`)
                  setIsOpen(false)
                  setQuery("")
                  return
                }
              }}
            >
              {/* Navigation Items */}
              {filteredNav.length > 0 && [
                <ListBox.Section key="nav" title="Navigation">
                  {filteredNav.map(item => (
                    <ListBox.Item key={item.id} textValue={item.label}>
                      <div className="flex items-center gap-3 py-1">
                        <item.icon className="h-5 w-5 shrink-0 text-[#737373] dark:text-[#a1a1aa]" />
                        <Typography type="body-sm" className="font-medium text-[#0a0a0a] dark:text-white">
                          {item.label}
                        </Typography>
                        <Typography type="body-xs" className="ml-auto font-medium text-[#a1a1aa]">
                          {item.group}
                        </Typography>
                      </div>
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
              ]}

              {/* People Items */}
              {filteredPeople.length > 0 && [
                <ListBox.Section key="people" title="People & Groups">
                  {filteredPeople.map(person => (
                    <ListBox.Item key={`person:${person.id}`} textValue={person.name}>
                      <div className="flex items-center gap-3 py-1">
                        <GradientAvatar tone={person.tone} isCommunity={person.type === "community"} className="h-6 w-6" />
                        <Typography type="body-sm" className="font-medium text-[#0a0a0a] dark:text-white">
                          {person.name}
                        </Typography>
                      </div>
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
              ]}

              {/* Messages Items */}
              {filteredMessages.length > 0 && [
                <ListBox.Section key="messages" title="Messages">
                  {filteredMessages.map(msg => (
                    <ListBox.Item key={`msg:${msg.message.id}`} textValue={msg.message.text}>
                      <div className="flex items-start gap-3 py-1">
                        <Comment className="h-4 w-4 shrink-0 mt-0.5 text-[#737373] dark:text-[#a1a1aa]" />
                        <div className="flex flex-col">
                          <Typography type="body-sm" className="font-medium text-[#0a0a0a] dark:text-white line-clamp-1">
                            {msg.message.text}
                          </Typography>
                          <Typography type="body-xs" className="text-[#a1a1aa]">
                            in {msg.name}
                          </Typography>
                        </div>
                      </div>
                    </ListBox.Item>
                  ))}
                </ListBox.Section>
              ]}
            </ListBox>
          )}
        </div>
      </div>
    </div>
  )
}
