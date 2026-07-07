import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MessagesApp } from "@/components/messages/messages-app"
import { MobileNav } from "@/components/mobile-nav"

export default function MessagesPage() {
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="messages" />
      
      {/* Push content right on desktop to clear the 88px icon rail */}
      <div className="flex-1 lg:pl-[88px] min-h-0">
        <MessagesApp />
      </div>

      <MobileNav />
    </main>
  )
}
