import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileShell } from "@/components/mobile-shell"
import { WorkspaceApp } from "@/components/workspace/workspace-app"
import { Suspense } from "react"

export const metadata = {
  title: "Workspace | Creonity",
  description: "All your confirmed deals — delivering from contract to final payment.",
}

export default function WorkspacePage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="workspace" />

      {/* Mobile */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <Suspense fallback={<div className="p-4">Loading workspace...</div>}>
            <WorkspaceApp />
          </Suspense>
        </MobileShell>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <Suspense fallback={<div className="p-4">Loading workspace...</div>}>
          <WorkspaceApp />
        </Suspense>
      </div>
    </main>
  )
}
