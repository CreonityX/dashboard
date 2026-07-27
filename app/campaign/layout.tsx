import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileShell } from "@/components/mobile-shell"
import type { ReactNode } from "react"

export default function CampaignLayout({ children }: { children: ReactNode }) {
  return <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]"><DesktopSidebar activeId="campaign" /><div className="h-full w-full lg:hidden"><MobileShell>{children}</MobileShell></div><div className="hidden min-h-0 flex-1 pl-[88px] lg:flex">{children}</div></main>
}
