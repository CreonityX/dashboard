import { FC, SVGProps } from "react"
import {
  Person,
  Gear,
  ShieldCheck,
  CreditCard,
  Receipt,
  Bell,
  Sliders,
  Lock,
  Puzzle,
  Palette,
  Globe,
  Sun,
  TrashBin,
  Megaphone,
  Comment,
  Calendar,
  ChartAreaStacked,
  HardDrive,
} from "@gravity-ui/icons"

export type SettingsSection = {
  id: string
  label: string
  icon: FC<SVGProps<SVGSVGElement>>
  isDanger?: boolean
}

export type SettingsGroup = {
  title: string
  items: SettingsSection[]
}

export const SETTINGS_NAVIGATION: SettingsGroup[] = [
  {
    title: "Personal",
    items: [
      { id: "account", label: "Account", icon: Person },
      { id: "security", label: "Security", icon: ShieldCheck },
      { id: "storage", label: "Storage", icon: HardDrive },
    ]
  },
  {
    title: "Connected Accounts",
    items: [
      { id: "connected-accounts", label: "Connected Accounts", icon: Puzzle },
    ]
  },
  {
    title: "Campaigns",
    items: [
      { id: "campaign-preferences", label: "Campaign Preferences", icon: Megaphone },
    ]
  },
  {
    title: "Billing",
    items: [
      { id: "subscription", label: "Subscription & Billing", icon: Receipt },
    ]
  },
  {
    title: "App Settings",
    items: [
      { id: "general", label: "General", icon: Gear },
      { id: "appearance", label: "Appearance", icon: Sun },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "privacy", label: "Privacy & Data", icon: Lock },
    ]
  },
  {
    title: "Danger Zone",
    items: [
      { id: "account-management", label: "Account Management", icon: TrashBin, isDanger: true },
    ]
  }
]
