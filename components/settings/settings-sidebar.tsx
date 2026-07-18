import { Magnifier } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { BRAND_SETTINGS_NAVIGATION, SETTINGS_NAVIGATION } from "./settings-data"
import { useAccount } from "@/context/account-context"

interface SettingsSidebarProps {
  activeId: string
  onSelect: (id: string) => void
}

export function SettingsSidebar({ activeId, onSelect }: SettingsSidebarProps) {
  const { isBrand, account, brand } = useAccount()
  const currentMember = isBrand ? brand?.team.find(m => m.email === account?.email) : null;
  const isAdmin = currentMember?.role === "Admin" || currentMember?.role === "Owner";

  const baseNavigation = isBrand ? BRAND_SETTINGS_NAVIGATION : SETTINGS_NAVIGATION;
  const navigation = baseNavigation.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.id === "team" && !isAdmin) return false;
      return true;
    })
  })).filter(group => group.items.length > 0);

  // If activeId is empty, it means we are at the root /settings, which will default to 'account' view
  // So we highlight 'account' if activeId is empty
  const currentActiveId = activeId || "account"

  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0a0a0a] lg:w-[300px]">
      {/* Header & Search */}
      <div className="flex flex-col gap-5 px-5 pt-6 pb-4">
        <button onClick={() => onSelect("")} className="text-left outline-none self-start hover:opacity-80 transition-opacity">
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">
            Settings
          </h1>
        </button>
        <div className="relative">
          <Magnifier className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
          <input 
            placeholder="Search settings..."
            className="h-10 w-full rounded-xl border border-[#e4e4e7] bg-white pl-9 pr-4 text-[13.5px] font-medium text-[#0a0a0a] outline-none transition hover:border-[#d4d4d8] focus:border-[#0a0a0a] focus:ring-1 focus:ring-[#0a0a0a] dark:border-[#27272a] dark:bg-[#0a0a0a] dark:text-white dark:hover:border-[#3f3f46] dark:focus:border-white dark:focus:ring-white" 
          />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-4 py-2 pb-6 overflow-y-auto custom-scrollbar">
        {navigation.map((group, i) => (
          <div key={group.title} className={cn("mb-6", i === 0 && "mt-2")}>
            <h2 className="mb-2.5 px-3 text-[14px] font-semibold text-[#0a0a0a] dark:text-white capitalize">
              {group.title}
            </h2>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = currentActiveId === item.id
                return (
                  <button 
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors",
                      isActive ? "bg-[#f4f4f5] dark:bg-[#27272a]" : "hover:bg-[#f4f4f5]/60 dark:hover:bg-[#1f1f1f]",
                      isActive ? "text-[#0a0a0a] dark:text-white font-semibold" : "text-[#52525b] dark:text-[#a1a1aa] font-medium hover:text-[#0a0a0a] dark:hover:text-[#e4e4e7]",
                      item.isDanger && !isActive && "hover:text-[#ef4444] dark:hover:text-[#ef4444]",
                      item.isDanger && isActive && "text-[#ef4444] dark:text-[#ef4444]"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && !item.isDanger && "text-[#0a0a0a] dark:text-white", item.isDanger && isActive && "text-[#ef4444] dark:text-[#ef4444]")} />
                    <span className="text-[15px]">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
