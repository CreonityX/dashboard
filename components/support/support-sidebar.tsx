import { Magnifier } from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import { SUPPORT_NAVIGATION } from "./support-data"

export function SupportSidebar({
  activeId,
  onSelect
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex h-full w-full flex-col bg-white dark:bg-[#0a0a0a] lg:w-[320px]">
      {/* Header & Search */}
      <div className="flex flex-col gap-5 px-5 pt-6 pb-4">
        <button 
          onClick={() => onSelect("")} 
          className="text-left outline-none self-start hover:opacity-80 transition-opacity"
        >
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none flex items-center h-[32px]">Support</h1>
        </button>
        <div className="relative">
          <Magnifier className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-xl bg-[#f4f4f5] pl-9 pr-4 text-[14px] text-[#0a0a0a] placeholder:text-[#a1a1aa] outline-none transition-colors focus:bg-[#ececef] dark:bg-[#1f1f1f] dark:text-white dark:focus:bg-[#27272a]"
          />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-2 pb-6 scrollbar-none">
        {SUPPORT_NAVIGATION.map((group, i) => (
          <div key={group.title} className={cn("mb-6", i === 0 && "mt-2")}>
            <h2 className="mb-2.5 px-3 text-[14px] font-semibold text-[#0a0a0a] dark:text-white capitalize">
              {group.title}
            </h2>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = activeId === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect(item.id)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors",
                      isActive
                        ? "bg-[#f4f4f5] dark:bg-[#27272a]"
                        : "hover:bg-[#f4f4f5]/60 dark:hover:bg-[#1f1f1f]",
                      item.isDanger
                        ? "text-[#ef4444] hover:bg-[#fef2f2] dark:hover:bg-[#3f3f46]"
                        : isActive
                        ? "text-[#0a0a0a] dark:text-white font-semibold"
                        : "text-[#52525b] dark:text-[#a1a1aa] font-medium hover:text-[#0a0a0a] dark:hover:text-[#e4e4e7]"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && !item.isDanger && "text-[#0a0a0a] dark:text-white")} />
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
