"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Magnifier, Bell, BellFill, ChevronLeft, Comment, CommentFill } from "@gravity-ui/icons"
import { Typography, Badge } from "@heroui/react"
import { cn } from "@/lib/utils"
import { mobileNavItems } from "@/components/menu-data"
import { MobileNav } from "@/components/mobile-nav"
import { conversations } from "@/lib/messages-data"

export function MobileShell({ 
  children,
  title,
  backHref,
  hideTopBar
}: { 
  children?: React.ReactNode
  title?: string
  backHref?: string
  hideTopBar?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const activeId = pathname === "/" ? "home" : pathname?.replace("/", "") || "home"
  const unreadCount = conversations.reduce((acc, c) => acc + (c.unread || 0), 0)

  return (
    <div className="flex h-[100dvh] flex-col bg-white dark:bg-[#0a0a0a] lg:hidden">
      {/* Top bar */}
      {!hideTopBar && (
        <header className="flex h-16 shrink-0 items-center justify-between px-6 pt-2">
          {backHref ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push(backHref)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f] -ml-2"
              >
                <ChevronLeft width={28} height={28} className="text-[#0a0a0a] dark:text-white" />
              </button>
              {title && <Typography type="h4" className="font-bold text-[#0a0a0a] dark:text-white">{title}</Typography>}
            </div>
          ) : (
            <>
              <button 
                type="button" 
                aria-label="Search" 
                className="flex items-center justify-center h-10 w-10 -ml-2 text-[#0a0a0a] dark:text-white"
                onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              >
                <Magnifier width={28} height={28} />
              </button>
              <div className="flex items-center gap-5">
                <Link href="/notifications" aria-label="Notifications" className="flex items-center justify-center h-10 w-10 text-[#0a0a0a] dark:text-white relative">
                  {activeId === "notifications" ? (
                    <BellFill width={28} height={28} />
                  ) : (
                    <Bell width={28} height={28} />
                  )}
                </Link>
                <Link href="/messages" aria-label="Messages" className="relative flex items-center justify-center h-10 w-10 text-[#0a0a0a] dark:text-white">
                  <Badge.Anchor>
                    {activeId === "messages" ? (
                      <CommentFill width={28} height={28} />
                    ) : (
                      <Comment width={28} height={28} />
                    )}
                    {unreadCount > 0 && (
                      <Badge color="danger" size="sm" placement="top-right">
                        {unreadCount}
                      </Badge>
                    )}
                  </Badge.Anchor>
                </Link>
              </div>
            </>
          )}
        </header>
      )}

      {/* Content */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        {children}
      </main>

      {/* Bottom navigation */}
      <MobileNav />
    </div>
  )
}
