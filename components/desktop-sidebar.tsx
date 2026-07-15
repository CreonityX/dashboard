"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Popover, ListBox, AlertDialog, Button } from "@heroui/react"
import { 
  Ellipsis, 
  Xmark, 
  Gear, 
  ClockArrowRotateLeft, 
  Moon, 
  CircleQuestion,
  ArrowRightFromSquare
} from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { primaryItems, type MenuItem } from "@/components/menu-data"
import { ProfileSphere } from "@/components/profile-sphere"

import { toast } from "@heroui/react"
import { conversations } from "@/lib/messages-data"
import { NotificationsList } from "@/components/notifications-list"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { ChartColumn, CircleDollar, FileText } from "@gravity-ui/icons"
import { Badge, Typography } from "@heroui/react"

const ICON_SIZE = 28
const RAIL_W = 88 // collapsed width — keeps icons centered in this column
const EXPANDED_W = 300

function Row({
  item,
  active,
  onClick,
}: {
  item: MenuItem
  active: boolean
  onClick?: () => void
}) {
  const Icon = active && item.activeIcon ? item.activeIcon : item.icon
  const href = item.id === "home" ? "/" : `/${item.id}`
  const isMessages = item.id === "messages"
  const unreadCount = conversations.reduce((acc, c) => acc + (c.unread || 0), 0)

  const content = (
    <>
      <span
        className="relative flex shrink-0 items-center justify-center"
        style={{ width: RAIL_W }}
      >
        <Badge.Anchor>
          <Icon
            width={ICON_SIZE}
            height={ICON_SIZE}
            className={cn("transition-transform", active && "scale-[1.06]")}
          />
          {isMessages && unreadCount > 0 && (
            <Badge color="danger" size="sm" placement="top-right">
              {unreadCount}
            </Badge>
          )}
        </Badge.Anchor>
      </span>
      <Typography
        type="h3"
        className={cn(
          "whitespace-nowrap leading-none transition-opacity duration-150",
          active ? "font-bold text-[#0a0a0a] dark:text-white" : "font-medium text-[#0a0a0a] dark:text-white",
        )}
      >
        {item.label}
      </Typography>
    </>
  )

  if (item.id === "notifications" || item.id === "more" || item.id === "search") {
    return (
      <div className="flex w-full cursor-pointer items-center text-left text-[#0a0a0a] dark:text-white">
        {content}
      </div>
    )
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex w-full items-center text-[#0a0a0a] dark:text-white"
    >
      {content}
    </Link>
  )
}

export function DesktopSidebar({ activeId: propActiveId }: { activeId?: string }) {
  const pathname = usePathname()
  
  let activeId = propActiveId
  if (!activeId) {
    if (pathname === "/") activeId = "home"
    else activeId = pathname.split("/")[1] || "home"
  }

  const [expanded, setExpanded] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [notificationFilter, setNotificationFilter] = useState<string>("all")
  const { theme, resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const logoutTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // When notifications or more menu are open, keep sidebar collapsed
  const currentExpanded = isNotificationsOpen || isMoreOpen ? false : expanded

  return (
    <>
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{ width: currentExpanded ? EXPANDED_W : RAIL_W }}
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden bg-white transition-[width] duration-300 ease-out dark:bg-[#0a0a0a] lg:flex"
      >
        {/* Primary group — vertically centered like the reference */}
        <nav className="flex flex-1 flex-col justify-center gap-[40px]">
          {primaryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full outline-none"
              onClick={(e) => {
                if (item.id === "search") {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent("open-command-palette"))
                  return
                }
                if (item.id === "notifications") {
                  setIsNotificationsOpen(!isNotificationsOpen)
                  setIsMoreOpen(false)
                } else {
                  setIsNotificationsOpen(false)
                  setIsMoreOpen(false)
                }
              }}
            >
              <Row
                item={item}
                active={item.id === "notifications" ? isNotificationsOpen : activeId === item.id}
              />
            </button>
          ))}

          {/* Profile */}
          <Link
            href="/profile"
            onClick={() => {
              setIsNotificationsOpen(false)
              setIsMoreOpen(false)
            }}
            className="flex w-full items-center text-[#0a0a0a] dark:text-white"
          >
            <span className="flex shrink-0 items-center justify-center" style={{ width: RAIL_W }}>
              <div className={cn("h-7 w-7 transition-transform rounded-full", activeId === "profile" && "scale-[1.06] ring-2 ring-offset-[0.5px] ring-black dark:ring-white ring-offset-white dark:ring-offset-[#0a0a0a]")}>
                <ProfileSphere className="h-full w-full block" />
              </div>
            </span>
            <Typography
              type="h3"
              className={cn(
                "whitespace-nowrap leading-none",
                activeId === "profile" ? "font-bold" : "font-medium",
              )}
            >
              Profile
            </Typography>
          </Link>
        </nav>

        {/* More Menu Popover — pinned to bottom */}
        <div className="mb-[44px]">
          <Popover 
            placement="top-start" 
            offset={20} 
            isOpen={isMoreOpen} 
            onOpenChange={setIsMoreOpen}
          >
            <Popover.Trigger>
              <button 
                type="button" 
                className="w-full outline-none"
                onClick={() => {
                  setIsNotificationsOpen(false)
                }}
              >
                <Row
                  item={{ id: "more", label: "More", icon: Ellipsis }}
                  active={activeId === "more" || isMoreOpen}
                />
              </button>
            </Popover.Trigger>
            <Popover.Content className="w-[300px] p-2">
              <ListBox 
                aria-label="More options" 
                className="w-full" 
                selectionMode="none"
                items={[
                  { key: "settings", label: "Settings", icon: Gear },
                  { key: "activity", label: "Your activity", icon: ClockArrowRotateLeft },
                  { key: "appearance", label: "Switch appearance", icon: Moon },
                  { key: "support", label: "Support", icon: CircleQuestion, showDivider: true },
                  { key: "logout", label: "Log out", icon: ArrowRightFromSquare }
                ]}
                onAction={(key) => {
                  if (String(key) === "appearance" && mounted) {
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                    toast.success("Appearance Updated", { description: "Your theme has been applied successfully." })
                  } else if (String(key) === "support") {
                    setIsMoreOpen(false)
                    router.push("/support")
                  } else if (String(key) === "settings") {
                    setIsMoreOpen(false)
                    router.push("/settings")
                  } else if (String(key) === "logout") {
                    setIsMoreOpen(false)
                    logoutTriggerRef.current?.click()
                  } else {
                    toast.info("Coming Soon", { description: "This feature will be available shortly." })
                  }
                }}
              >
                {(item) => (
                  <ListBox.Item key={item.key} textValue={item.label} showDivider={item.showDivider} color={item.key === "logout" ? "danger" : "default"}>
                    <div className={cn("flex items-center gap-3.5 w-full h-full", item.showDivider ? "pb-3 pt-1.5" : "py-1.5")}>
                      <item.icon className={cn("h-[22px] w-[22px] shrink-0", item.key === "logout" ? "text-danger" : "text-[#737373] dark:text-[#a1a1aa]")} />
                      <Typography type="body-sm" className={cn("font-medium", item.key === "logout" ? "text-danger" : "text-[#0a0a0a] dark:text-white")}>{item.label}</Typography>
                    </div>
                  </ListBox.Item>
                )}
              </ListBox>
            </Popover.Content>
          </Popover>
          <AlertDialog>
            <AlertDialog.Trigger className="hidden">
              <button ref={logoutTriggerRef} className="hidden">Log out</button>
            </AlertDialog.Trigger>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="sm:max-w-[400px]">
                  {(renderProps: any) => (
                    <>
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="danger" />
                        <AlertDialog.Heading>Log out?</AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p className="text-gray-600 dark:text-gray-300">Are you sure you want to log out of your account?</p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary">Cancel</Button>
                        <Button variant="danger" onPress={() => { toast.success("Logged out successfully"); renderProps.close(); }}>Log out</Button>
                      </AlertDialog.Footer>
                    </>
                  )}
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        </div>
      </aside>

      {/* Notifications Drawer */}
      <div
        className={cn(
          "fixed top-0 z-30 hidden h-screen w-[427px] flex-col rounded-none bg-white shadow-[8px_0_24px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out dark:bg-[#0a0a0a] dark:shadow-[8px_0_24px_rgba(0,0,0,0.2)] lg:flex",
          isNotificationsOpen ? "translate-x-[88px]" : "-translate-x-full"
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-6 py-6 pt-8">
          <Typography type="h3" className="font-bold tracking-tight text-[#0a0a0a] dark:text-white">Notifications</Typography>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(false)}
            className="rounded-full p-2 text-[#a1a1aa] transition-colors hover:bg-[#f4f4f5] hover:text-[#0a0a0a] dark:hover:bg-[#1f1f1f] dark:hover:text-white"
          >
            <Xmark width={24} height={24} />
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto px-6 pb-4 scrollbar-none shrink-0">
          {["all", "offers", "earnings", "analytics", "campaigns", "mentions"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setNotificationFilter(f as any)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors shrink-0 whitespace-nowrap capitalize",
                notificationFilter === f
                  ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
                  : "bg-[#f4f4f5] text-[#52525b] hover:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-[#a1a1aa] dark:hover:bg-[#27272a]",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <NotificationsList filter={notificationFilter} />
      </div>
    </>
  )
}
