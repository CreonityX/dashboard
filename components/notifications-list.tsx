import { notificationsData } from "@/lib/notifications-data"
import { GradientAvatar } from "@/components/messages/gradient-avatar"
import { ChartColumn, CircleDollar, FileText } from "@gravity-ui/icons"
import { toast, Typography } from "@heroui/react"
import { cn } from "@/lib/utils"

export function NotificationsList({ filter = "all" }: { filter?: "all" | string }) {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-20 pt-2 flex flex-col gap-6 w-full">
      {notificationsData.map(group => {
        const filteredItems = filter === "all" 
          ? group.items 
          : group.items.filter(i => i.category === filter)

        if (filteredItems.length === 0) return null

        return (
          <div key={group.title} className="flex flex-col">
            <Typography type="h6" className="mb-4 font-bold text-[#0a0a0a] dark:text-white">{group.title}</Typography>
            <div className="flex flex-col gap-5">
              {filteredItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    {item.actors.length === 1 ? (
                      <GradientAvatar 
                        tone={item.actors[0].avatarTone || "gray"} 
                        className="h-11 w-11"
                        isCommunity={false} 
                      />
                    ) : (
                      <div className="relative h-11 w-11">
                        <GradientAvatar 
                          tone={item.actors[0].avatarTone || "gray"} 
                          className="absolute left-0 top-0 h-8 w-8 ring-2 ring-white dark:ring-[#0a0a0a]"
                          isCommunity={false} 
                        />
                        <GradientAvatar 
                          tone={item.actors[1].avatarTone || "gray"} 
                          className="absolute bottom-0 right-0 h-8 w-8 ring-2 ring-white dark:ring-[#0a0a0a]"
                          isCommunity={false} 
                        />
                      </div>
                    )}
                    {item.isUnread && (
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#3897f0] dark:border-[#0a0a0a]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 text-left">
                    <Typography type="body-sm" className="leading-snug text-[#0a0a0a] dark:text-[#a1a1aa]">
                      {item.actors.length > 0 && (
                        <span className="font-semibold text-[#0a0a0a] dark:text-white">
                          {item.actors.map(a => a.name).join(" and ")}
                        </span>
                      )}{" "}
                      {item.action}{" "}
                      {item.target && (
                        <span className="font-semibold text-[#0a0a0a] dark:text-white">
                          {item.target}
                        </span>
                      )}{" "}
                      <span className="text-[#a1a1aa] dark:text-[#737373]">{item.time}</span>
                    </Typography>
                  </div>

                  {item.rightElement && (
                    <div className="shrink-0 ml-2 flex items-center justify-center">
                      {item.rightElement.type === "thumbnail" && (
                        <div className={cn("h-11 w-11 rounded-lg", item.rightElement.colorClass)} />
                      )}
                      {item.rightElement.type === "badge" && (
                        <button 
                          className={cn("rounded-lg px-3 py-1.5 text-[12px] font-bold transition-transform hover:scale-105", item.rightElement.bgClass, item.rightElement.textClass)}
                          onClick={() => {
                            let badgeMsg = `${item.rightElement!.text} action completed.`
                            if (item.rightElement!.text === "Review") badgeMsg = "Review submitted successfully."
                            if (item.rightElement!.text === "Pay") badgeMsg = "Payment processed successfully."
                            if (item.rightElement!.text === "Mark as read") badgeMsg = "Notification marked as read."
                            toast.success("Status Updated", { description: badgeMsg })
                          }}
                        >
                          {item.rightElement.text}
                        </button>
                      )}
                      {item.rightElement.type === "icon" && (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#1f1f1f]">
                          {item.rightElement.name === "chart" && <ChartColumn className="h-5 w-5 text-[#737373] dark:text-[#a1a1aa]" />}
                          {item.rightElement.name === "money" && <CircleDollar className="h-5 w-5 text-[#3897f0]" />}
                          {item.rightElement.name === "doc" && <FileText className="h-5 w-5 text-[#737373] dark:text-[#a1a1aa]" />}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
