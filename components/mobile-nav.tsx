"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { mobileNavItems } from "@/components/menu-data"
import { conversations } from "@/lib/messages-data"
import { ProfileSphere } from "@/components/profile-sphere"

export function MobileNav() {
  const pathname = usePathname()
  const activeId = pathname === "/" ? "home" : pathname?.replace("/", "") || "home"
  const unreadCount = conversations.reduce((acc, c) => acc + (c.unread || 0), 0)

  return (
    <nav className="flex shrink-0 items-center justify-between border-t border-[#efefef] bg-white px-6 pb-6 pt-4 dark:border-white/10 dark:bg-[#0a0a0a] lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = activeId === item.id
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon
          const inner = (
            <>
              {item.id === "profile" ? (
                <div className={cn("h-7 w-7 transition-transform rounded-full", isActive && "scale-[1.06] ring-2 ring-offset-[0.5px] ring-black dark:ring-white ring-offset-white dark:ring-offset-[#0a0a0a]")}>
                  <ProfileSphere className="h-full w-full block" />
                </div>
              ) : (
                <Icon
                  width={28}
                  height={28}
                  className={cn("transition-transform", isActive && "scale-[1.06]")}
                />
              )}
            </>
          )

          if (item.id === "search") {
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
                className="flex h-10 w-10 items-center justify-center relative text-[#0a0a0a] dark:text-white"
              >
                {inner}
              </button>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.id === "home" ? "/" : `/${item.id}`}
              aria-label={item.label}
              className="flex h-10 w-10 items-center justify-center relative text-[#0a0a0a] dark:text-white"
            >
              {inner}
            </Link>
          )
      })}
    </nav>
  )
}
