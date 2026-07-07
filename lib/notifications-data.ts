export type NotificationCategory = "offers" | "finance" | "analytics" | "campaigns" | "mentions"

export type Actor = {
  name: string
  avatarTone?: string // blue, purple, etc.
}

export type Notification = {
  id: string
  category: NotificationCategory
  actors: Actor[]
  action: string
  target?: string
  time: string
  isUnread?: boolean
  rightElement?: 
    | { type: "thumbnail"; colorClass: string } // placeholder for image
    | { type: "badge"; text: string; bgClass: string; textClass: string }
    | { type: "icon"; name: "chart" | "money" | "doc" }
}

export type NotificationGroup = {
  title: string
  items: Notification[]
}

export const notificationsData: NotificationGroup[] = [
  {
    title: "Today",
    items: [
      {
        id: "n1",
        category: "offers",
        actors: [{ name: "Glow Beauty Co.", avatarTone: "pink" }],
        action: "sent a new brand deal request.",
        time: "2h",
        isUnread: true,
        rightElement: { type: "badge", text: "Review", bgClass: "bg-[#0a0a0a] dark:bg-white", textClass: "text-white dark:text-[#0a0a0a]" }
      },
      {
        id: "n2",
        category: "finance",
        actors: [{ name: "Nova Studios", avatarTone: "blue" }],
        action: "Payment of $2,500 is now available.",
        time: "5h",
        rightElement: { type: "icon", name: "money" }
      },
      {
        id: "n3",
        category: "campaigns",
        actors: [{ name: "Maya Editor", avatarTone: "purple" }],
        action: "approved your video draft for",
        target: "Summer Drop.",
        time: "6h",
        rightElement: { type: "thumbnail", colorClass: "bg-gradient-to-br from-indigo-500 to-purple-500" }
      },
    ]
  },
  {
    title: "Yesterday",
    items: [
      {
        id: "n4",
        category: "mentions",
        actors: [{ name: "shreyysrivastava", avatarTone: "gray" }, { name: "delus.ishh", avatarTone: "teal" }],
        action: "liked your campaign post.",
        time: "1d",
        rightElement: { type: "thumbnail", colorClass: "bg-gradient-to-br from-gray-700 to-gray-900" }
      },
      {
        id: "n5",
        category: "campaigns",
        actors: [{ name: "Creonity", avatarTone: "gray" }],
        action: "Reminder:",
        target: "Urban Threads Lookbook goes live tomorrow.",
        time: "1d"
      },
    ]
  },
  {
    title: "This week",
    items: [
      {
        id: "n6",
        category: "analytics",
        actors: [{ name: "Weekly Insights", avatarTone: "orange" }],
        action: "Your profile views are up",
        target: "24%.",
        time: "2d",
        rightElement: { type: "icon", name: "chart" }
      },
      {
        id: "n7",
        category: "finance",
        actors: [{ name: "Creonity", avatarTone: "gray" }],
        action: "Invoice #1024 is overdue.",
        time: "3d",
        rightElement: { type: "badge", text: "Pay", bgClass: "bg-[#fee2e2] dark:bg-[#7f1d1d]/40", textClass: "text-[#dc2626] dark:text-[#fca5a5]" }
      }
    ]
  }
]
