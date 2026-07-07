import { SettingsApp } from "@/components/settings/settings-app"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileNav } from "@/components/mobile-nav"

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function SettingsPage({ params }: PageProps) {
  const resolvedParams = await params
  const activeId = resolvedParams?.slug?.[0] || ""

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="settings" />
      <div className="flex-1 lg:pl-[88px] min-h-0">
        <SettingsApp initialActiveId={activeId} />
      </div>
      <MobileNav />
    </main>
  )
}
