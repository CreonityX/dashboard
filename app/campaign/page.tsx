import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileShell } from "@/components/mobile-shell"
import { CampaignApp } from "@/components/campaign/campaign-app"
import { Suspense } from "react"

export const metadata = {
  title: 'Campaign | Creonity',
  description: 'Manage and discover new brand campaigns.',
}

export default function CampaignPage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="campaign" />
      
      {/* Mobile Shell provides the mobile top bar (Search, Bell, Messages) + Bottom Nav */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <Suspense fallback={<div className="p-4">Loading campaign...</div>}>
            <CampaignApp />
          </Suspense>
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <Suspense fallback={<div className="p-4">Loading campaign...</div>}>
          <CampaignApp />
        </Suspense>
      </div>
    </main>
  )
}
