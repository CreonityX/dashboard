import { ChevronLeft } from "lucide-react"
// profile.tsx removed
import { AccountView } from "./views/account"
import { SecurityView } from "./views/security"
import { StorageView } from "./views/storage"
import { SubscriptionView } from "./views/subscription"
import { NotificationsView } from "./views/notifications"
import { PrivacyView } from "./views/privacy"
import { GeneralView } from "./views/general"
import { AppearanceView } from "./views/appearance"
import { AccountManagementView } from "./views/account-management"
import { ConnectedAccountsView } from "./views/connected-accounts"
import { CampaignPreferencesView } from "./views/campaign-preferences"
import { BrandProfileView } from "./views/brand-profile"
import { TeamView } from "./views/team"
import { useAccount } from "@/context/account-context"

// We will eventually import these from their specific view files
const ComingSoonView = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="flex flex-col h-full py-6">
    <button onClick={onBack} className="mb-6 flex w-fit items-center gap-2 text-[15px] font-semibold text-[#a1a1aa] transition hover:text-[#0a0a0a] dark:hover:text-white lg:hidden">
      <ChevronLeft className="h-5 w-5" />
      Back to settings
    </button>
    <div className="mb-8 flex flex-col gap-2">
      <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">{title}</h1>
      <p className="text-[14.5px] text-[#52525b] dark:text-[#a1a1aa]">This section is under construction.</p>
    </div>
  </div>
)

interface SettingsContentProps {
  activeId: string
  onBack: () => void
  onNavigate: (id: string) => void
}

export function SettingsContent({ activeId, onBack, onNavigate }: SettingsContentProps) {
  const { isBrand, brand, account } = useAccount()
  const currentMember = isBrand ? brand?.team.find(m => m.email === account?.email) : null;
  const isAdmin = currentMember?.role === "Admin" || currentMember?.role === "Owner";
  
  const currentActiveId = activeId || "account"

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-5 scrollbar-none dark:bg-[#0a0a0a] sm:px-6 lg:px-8 xl:px-10">
      <div className="flex w-full flex-col items-start">
        <div className="w-full">
        {currentActiveId === "brand-profile" ? (
          <BrandProfileView onBack={onBack} />
        ) : currentActiveId === "team" ? (
          isAdmin ? <TeamView onBack={onBack} /> : <div className="py-6"><p className="text-[#a1a1aa]">You do not have permission to view this page.</p></div>
        ) : currentActiveId === "account" ? (
          <AccountView onBack={onBack} />
        ) : currentActiveId === "security" ? (
          <SecurityView onBack={onBack} />
        ) : currentActiveId === "storage" ? (
          <StorageView onBack={onBack} />
        ) : currentActiveId === "connected-accounts" ? (
          <ConnectedAccountsView onBack={onBack} />
        ) : currentActiveId === "campaign-preferences" ? (
          <CampaignPreferencesView onBack={onBack} />
        ) : currentActiveId === "subscription" ? (
          <SubscriptionView onBack={onBack} />
        ) : currentActiveId === "notifications" ? (
          <NotificationsView onBack={onBack} />
        ) : currentActiveId === "privacy" ? (
          <PrivacyView onBack={onBack} />
        ) : currentActiveId === "general" ? (
          <GeneralView onBack={onBack} />
        ) : currentActiveId === "appearance" ? (
          <AppearanceView onBack={onBack} />
        ) : currentActiveId === "account-management" ? (
          <AccountManagementView onBack={onBack} />
        ) : (
          <ComingSoonView title="Settings" onBack={onBack} />
        )}
        </div>
      </div>
    </div>
  )
}
