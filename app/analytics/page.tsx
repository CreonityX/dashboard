import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { AnalyticsApp } from "@/components/analytics/analytics-app"
import { MobileShell } from "@/components/mobile-shell"

export default function AnalyticsPage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="analytics" />
      
      {/* Mobile Shell provides the mobile top bar (Search, Bell, Messages) + Bottom Nav */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <AnalyticsApp />
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <AnalyticsApp />
      </div>
    </main>
  )
}
