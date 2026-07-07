import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MessagesPill } from "@/components/messages-pill"
import { MobileShell } from "@/components/mobile-shell"
import { HomeApp } from "@/components/home/home-app"

export default function Page() {
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="home" />
      
      {/* Mobile Shell */}
      <div className="lg:hidden h-full w-full">
        <MobileShell hideTopBar>
          <HomeApp />
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0 relative">
        <HomeApp />
        <MessagesPill />
      </div>
    </main>
  )
}
