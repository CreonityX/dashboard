import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileShell } from "@/components/mobile-shell"
import { WorkspaceApp } from "@/components/workspace/workspace-app"
import { Suspense } from "react"
import { listDeals as apiListDeals, me as apiMe } from "@/lib/api"
import { CampaignsProvider } from "@/context/campaigns-context"

export const metadata = {
  title: "Workspace | Creonity",
  description: "All your confirmed deals — delivering from contract to final payment.",
}

/**
 * Server component. The workspace is the deals view — seed
 * CampaignsProvider with the user's deals so WorkspaceApp paints
 * real data on first load. Campaign list is empty here; the UI
 * pulls it via actions only if needed.
 */
export default async function WorkspacePage() {
  const jar = await cookies()
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join("; ")
  if (!cookieHeader) redirect("/login")

  try {
    await apiMe(cookieHeader)
  } catch {
    redirect("/login")
  }

  const deals = await apiListDeals({}, cookieHeader).catch(() => ({
    items: [],
    nextCursor: null,
  }))

  const initial = { campaigns: { items: [], nextCursor: null }, deals }

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="workspace" />

      {/* Mobile */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <Suspense fallback={<div className="p-4">Loading workspace...</div>}>
            <CampaignsProvider initial={initial}>
              <WorkspaceApp />
            </CampaignsProvider>
          </Suspense>
        </MobileShell>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <Suspense fallback={<div className="p-4">Loading workspace...</div>}>
          <CampaignsProvider initial={initial}>
            <WorkspaceApp />
          </CampaignsProvider>
        </Suspense>
      </div>
    </main>
  )
}
