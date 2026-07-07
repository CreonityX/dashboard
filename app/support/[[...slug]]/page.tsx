import { DesktopSidebar } from "@/components/desktop-sidebar"
import { SupportApp } from "@/components/support/support-app"
import { MobileNav } from "@/components/mobile-nav"

interface PageProps {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function SupportPage({ params }: PageProps) {
  const resolvedParams = await params
  const activeId = resolvedParams?.slug?.[0] || ""
  
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="support" />
      
      {/* Push content right on desktop to clear the 88px icon rail */}
      <div className="flex-1 lg:pl-[88px] min-h-0">
        <SupportApp initialActiveId={activeId} />
      </div>

      <MobileNav />
    </main>
  )
}
