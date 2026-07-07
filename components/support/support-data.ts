import {
  Magnifier,
  Comment,
  Ticket,
  CircleQuestion,
  Play,
  Rocket,
  Bulb,
  Signal,
  Lock,
  CircleDollar,
  Shield,
  TriangleExclamation
} from "@gravity-ui/icons"
import { FC, SVGProps } from "react"

export type SupportSection = {
  id: string
  label: string
  icon: FC<SVGProps<SVGSVGElement>>
  isDanger?: boolean
}

export type SupportGroup = {
  title: string
  items: SupportSection[]
}

export const SUPPORT_NAVIGATION: SupportGroup[] = [
  {
    title: "Essential Support",
    items: [
      { id: "contact-support", label: "Contact Support", icon: Comment },
      { id: "my-tickets", label: "My Tickets", icon: Ticket },
    ]
  },
  {
    title: "Self-Service & Learning",
    items: [
      { id: "faqs", label: "FAQs", icon: CircleQuestion },
      { id: "video-tutorials", label: "Video Tutorials", icon: Play },
      { id: "getting-started", label: "Getting Started", icon: Rocket },
    ]
  },
  {
    title: "Platform & Feedback",
    items: [
      { id: "feature-requests", label: "Feature Requests", icon: Bulb },
      { id: "platform-status", label: "Platform Status", icon: Signal },
    ]
  },
  {
    title: "Account & Administration",
    items: [
      { id: "account-security", label: "Account & Security", icon: Lock },
      { id: "billing", label: "Billing & Payments", icon: CircleDollar },
      { id: "community-guidelines", label: "Community & Safety", icon: Shield },
    ]
  }
]
