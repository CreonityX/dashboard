import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MessagesPill } from "@/components/messages-pill"
import { MobileNav } from "@/components/mobile-nav"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden h-[100dvh] w-full flex flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <main className="flex-1 min-h-0 h-full w-full">
          {children}
        </main>
        <MobileNav />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-[100dvh] w-full overflow-hidden flex-col bg-white dark:bg-[#0a0a0a]">
        {/* Desktop: hover-expand icon rail + floating messages pill */}
        <DesktopSidebar />
        <MessagesPill />

        {/* Page Content */}
        <main className="pl-20 flex-1 min-h-0 h-full w-full">
          {children}
        </main>
      </div>
    </>
  )
}
