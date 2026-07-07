"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "@gravity-ui/icons"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { NotificationsList } from "@/components/notifications-list"

export default function NotificationsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Mobile view: standalone layout with NO MobileShell (no bottom nav, no search) */}
      <div className="flex flex-col h-screen lg:hidden">
        <header className="flex shrink-0 items-center gap-2 bg-white px-4 py-4 dark:bg-[#0a0a0a]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#f4f4f5] dark:hover:bg-[#1f1f1f]"
          >
            <ChevronLeft width={24} height={24} className="text-[#0a0a0a] dark:text-white" />
          </button>
          <h1 className="text-[22px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Notifications</h1>
        </header>

        <main className="flex-1 overflow-y-auto px-0 py-0">
          <NotificationsList />
        </main>
      </div>

      {/* Desktop view: sidebar only (notifications slide out as a drawer via DesktopSidebar state) */}
      <div className="hidden lg:block">
        <DesktopSidebar activeId="notifications" />
        <div className="pl-[88px]">
          {/* Main content is intentionally empty since notifications are a drawer */}
          <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]">
            <p className="text-[#a1a1aa] dark:text-[#737373]">Open the notifications drawer from the sidebar.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
