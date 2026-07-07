import { CalendarApp } from "@/components/calendar/calendar-app"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MessagesPill } from "@/components/messages-pill"
import { MobileNav } from "@/components/mobile-nav"
import { Suspense } from "react"

export const metadata = { title: "Calendar — Creonity" }

export default function CalendarPage() {
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="calendar" />
      
      {/* Push content right on desktop to clear the 88px icon rail */}
      <div className="flex-1 lg:pl-[88px] min-h-0">
        <Suspense fallback={<div className="p-4">Loading calendar...</div>}>
          <CalendarApp />
        </Suspense>
      </div>

      <MessagesPill />
      <MobileNav />
    </main>
  )
}
