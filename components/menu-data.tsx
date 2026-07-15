import type { ComponentType, SVGProps } from "react"
import {
  House,
  HouseFill,
  Megaphone,
  Magnifier,
  ChartAreaStacked,
  Comment,
  CommentFill,
  Calendar,
  Bell,
  BellFill,
  Person,
  PersonFill,
  Briefcase,
  BriefcaseFill,
} from "@gravity-ui/icons"
import { Wallet } from "lucide-react"

export type IconType = ComponentType<SVGProps<SVGSVGElement>> | any

export type MenuItem = {
  id: string
  label: string
  icon: IconType
  /** Filled / heavier variant shown when the item is active. */
  activeIcon?: IconType
}

/** Primary navigation used by the desktop sidebar (top group). */
export const primaryItems: MenuItem[] = [
  { id: "home", label: "Home", icon: House, activeIcon: HouseFill },
  { id: "campaign", label: "Campaign", icon: Megaphone },
  { id: "workspace", label: "Workspace", icon: Briefcase, activeIcon: BriefcaseFill },
  { id: "search", label: "Search", icon: Magnifier },
  { id: "notifications", label: "Notifications", icon: Bell, activeIcon: BellFill },
  { id: "analytics", label: "Analytics", icon: ChartAreaStacked },
  { id: "messages", label: "Messages", icon: Comment, activeIcon: CommentFill },
  { id: "calendar", label: "Calendar", icon: Calendar },
]

export const mobileNavItems: MenuItem[] = [
  { id: "home", label: "Home", icon: House, activeIcon: HouseFill },
  { id: "campaign", label: "Campaign", icon: Megaphone },
  { id: "search", label: "Search", icon: Magnifier },
  { id: "workspace", label: "Workspace", icon: Briefcase, activeIcon: BriefcaseFill },
  { id: "profile", label: "Profile", icon: Person, activeIcon: PersonFill },
]
