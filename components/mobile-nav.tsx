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
    <nav className="flex shrink-0 items-center justify-around border-t border-[#efefef] bg-white px-4 pb-6 pt-4 dark:border-white/10 dark:bg-[#0a0a0a] lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = activeId === item.id
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon
        const isMessages = item.id === "messages"

        return (
          <Link
            key={item.id}
            href={item.id === "home" ? "/" : `/${item.id}`}
            aria-label={item.label}
            className="relative text-[#0a0a0a] dark:text-white"
          >
            {item.id === "profile" ? (
              <ProfileSphere
                className={cn("h-7 w-7 transition-transform", isActive && "scale-[1.06] ring-2 ring-[#0060ff] ring-offset-1 rounded-full")}
              />
            ) : (
              <Icon
                width={28}
                height={28}
                className={cn("transition-transform", isActive && "scale-[1.06]")}
              />
            )}
            {isMessages && unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#e8443a] dark:border-[#0a0a0a]" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
