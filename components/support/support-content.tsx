import { ChevronRight, ThumbsUp, ThumbsDown } from "@gravity-ui/icons"
import { SUPPORT_NAVIGATION } from "./support-data"
import { Button } from "@heroui/react"
import { PlatformStatusView } from "./views/platform-status"
import { MyTicketsView } from "./views/my-tickets"
import { ContactSupportView } from "./views/contact-support"
import { FaqView } from "./views/faq"
import { HelpCenterView } from "./views/help-center"
import { AccountSecurityView } from "./views/account-security"
import { BillingView } from "./views/billing"
import { CommunityGuidelinesView } from "./views/community-guidelines"

// A helper to render an Instagram-style list item in the content pane using HeroUI Card
function ContentListItem({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <button 
      className="w-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-none rounded-xl text-left"
    >
      <div className="flex flex-row w-full items-center justify-between py-3.5 px-4">
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">{title}</span>
          {subtitle && <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">{subtitle}</span>}
        </div>
        <ChevronRight className="h-5 w-5 text-[#a1a1aa]" />
      </div>
    </button>
  )
}

function ComingSoonView({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f4f5] dark:bg-[#1f1f1f]">
        <span className="text-2xl">🚧</span>
      </div>
      <h2 className="text-[20px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">{title}</h2>
      <p className="mt-2 max-w-[280px] text-[15px] text-[#737373] dark:text-[#a1a1aa]">
        This section is currently under development. Check back soon for updates.
      </p>
    </div>
  )
}

interface SupportContentProps {
  activeId: string
  onBack?: () => void
  onNavigate?: (id: string) => void
}

export function SupportContent({ activeId, onBack, onNavigate }: SupportContentProps) {
  const activeItem = SUPPORT_NAVIGATION.flatMap((g) => g.items).find((i) => i.id === activeId)
  
  if (!activeItem && activeId !== "") return null

  if (activeId === "contact-support") {
    return (
      <div className="h-full w-full flex flex-col px-6 md:px-10 bg-white dark:bg-[#0a0a0a] overflow-y-auto scrollbar-none">
        <ContactSupportView onBack={onBack} />
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col px-6 md:px-10 bg-white dark:bg-[#0a0a0a] overflow-y-auto scrollbar-none">
      {!activeId && <HelpCenterView onBack={onBack} onNavigate={onNavigate} />}
      {activeId === "faqs" && <FaqView onBack={onBack} />}
      {activeId === "platform-status" && <PlatformStatusView onBack={onBack} />}
      {activeId === "my-tickets" && <MyTicketsView onBack={onBack} onNavigate={onNavigate} />}
      {activeId === "account-security" && <AccountSecurityView onBack={onBack} />}
      {activeId === "billing" && <BillingView onBack={onBack} />}
      {activeId === "community-guidelines" && <CommunityGuidelinesView onBack={onBack} onNavigate={onNavigate} />}
      {["video-tutorials", "getting-started", "feature-requests"].includes(activeId) && (
        <div className="flex h-full items-center justify-center">
          <ComingSoonView title={activeItem?.label ?? ""} />
        </div>
      )}
    </div>
  )
}
