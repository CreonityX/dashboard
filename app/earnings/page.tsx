import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileShell } from "@/components/mobile-shell"
import { FinanceApp } from "@/components/finance/finance-app"

export const metadata = {
  title: 'Finance | Creonity',
  description: 'Manage your earnings, payouts, and invoices.',
}

export default function FinancePage() {
  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <DesktopSidebar activeId="finance" />
      
      {/* Mobile Shell provides the mobile top bar (Search, Bell, Messages) + Bottom Nav */}
      <div className="lg:hidden h-full w-full">
        <MobileShell>
          <FinanceApp />
        </MobileShell>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex flex-1 pl-[88px] min-h-0">
        <FinanceApp />
      </div>
    </main>
  )
}
