"use client"

import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, AreaChart, Area } from "recharts"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowUp,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Flag,
  Inbox,
  KanbanSquare,
  LinkIcon,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Filter,
  Users,
  Upload,
  X,
  Zap,
  Plus,
  TrendingUp,
  Trophy,
  FileSignature,
  Rocket,
  CircleCheck,
  Link2,
  BarChart2,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { Dice2, BookmarkFill } from "@gravity-ui/icons"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { BrandLogo } from "@/components/ui/brand-logo"
import { Drawer, Slider, Checkbox, CheckboxGroup, Label, ScrollShadow } from "@heroui/react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSearchParams, useRouter } from "next/navigation"
import { useAccount } from "@/context/account-context"
import { BrandCampaignApp } from "./brand-campaign-app"

type CampaignStatus = "Open" | "Closing Soon" | "Filled" | "Closed"
type CampaignTab = "discover" | "pipeline" | "invitations"
type BidPricingMode = "deliverable" | "package"

type Campaign = {
  id: string
  brand: string
  domain: string
  title: string
  niche: string
  location: string
  budget: string
  daysLeft: number
  bids: number
  dueDate: string
  status: CampaignStatus
  match?: number
  saved?: boolean
  invited?: boolean
  exclusive?: boolean
  description: string
  deliverables: string[]
  eligibility: string[]
  rights: {
    included: string
    paid: string
  }
  brief: {
    summary: string
    asset: string
  }
  qna: Array<{
    question: string
    answer: string
  }>
  similarIds: string[]
}

type DealStage = "bid" | "negotiation" | "accepted" | "contract" | "content" | "revision" | "posted" | "tracking" | "completed"

type DeliverableItem = {
  id: string
  name: string
  type: "upload" | "post"
  status: "pending" | "uploaded" | "approved" | "revision" | "posted"
  fileUrl?: string
  postUrl?: string
  revisionNote?: string
}

type PaymentMilestone = {
  id: string
  label: string
  amount: string
  type: "fixed" | "performance"
  targetViews?: number
  currentViews?: number
  status: "locked" | "unlocked" | "released"
}

type ContractTerms = {
  deliverables: DeliverableItem[]
  totalAmount: string
  paymentMilestones: PaymentMilestone[]
  usageRights: string
  exclusivity: string
  deadline: string
  revisionRounds: number
  creatorSigned: boolean
  brandSigned: boolean
}

type TimelineEvent = {
  id: string
  timestamp: string
  label: string
  note?: string
  status: "completed" | "active" | "pending"
}

type PipelineDeal = {
  id: string
  campaignId: string
  stage: DealStage
  total: string
  nextStep: string
  due: string
  messages: Array<{
    from: "Brand" | "You"
    text: string
    total?: string
  }>
  contract?: ContractTerms
  timeline: TimelineEvent[]
}

const CAMPAIGNS: Campaign[] = [
  {
    id: "aura-sun",
    brand: "Apple",
    domain: "apple.com",
    title: "Vision Pro fitness experiences",
    niche: "Tech",
    location: "United States",
    budget: "₹2.4K - ₹3.8K",
    daysLeft: 2,
    bids: 18,
    dueDate: "Jul 24",
    status: "Closing Soon",
    match: 96,
    saved: true,
    description: "Introduce Apple Vision Pro as a unique tool for home workouts and fitness routines, focusing on seamless UI interactions.",
    deliverables: ["1 Reel", "3 Stories", "1 Feed post"],
    eligibility: ["40K-250K followers", "Beauty, wellness, or lifestyle niche", "US audience 55%+", "Women 18-34 audience majority"],
    rights: {
      included: "Organic reposting on Aura owned channels for 45 days.",
      paid: "Paid ad usage, whitelisting, and Spark/partnership ads priced separately.",
    },
    brief: {
      summary: "Show real daytime use: commute, outdoor cafe, quick reapplication, and a close-up texture shot. Keep claims simple and avoid medical language.",
      asset: "Aura_SPF_moodboard.pdf",
    },
    qna: [
      {
        question: "Can the Reel include another non-SPF skincare product in the routine?",
        answer: "Yes, as long as Aura is the hero product and no competing sunscreen is shown.",
      },
      {
        question: "Is whitelisting required?",
        answer: "No. Please price whitelisting only if you want to offer it as an add-on.",
      },
    ],
    invited: true,
    similarIds: ["goodday-kit", "loom-home", "milk-run"],
  },
  {
    id: "goodday-kit",
    brand: "Nike",
    domain: "nike.com",
    title: "Nike Forward lifestyle drop",
    niche: "Fashion",
    location: "Remote",
    budget: "₹1.8K - ₹2.5K",
    daysLeft: 6,
    bids: 9,
    dueDate: "Aug 02",
    status: "Open",
    match: 92,
    description: "A design-led campaign for creators who can showcase the Nike Forward collection bridging street style and everyday comfort.",
    deliverables: ["1 Reel", "1 Carousel", "2 Stories"],
    eligibility: ["20K-150K followers", "Design, tech, productivity, or founder niche", "English-speaking audience", "Portfolio examples required"],
    rights: {
      included: "Organic reposting and newsletter feature for 30 days.",
      paid: "Paid usage, landing page usage, and creator whitelisting require separate approval.",
    },
    brief: {
      summary: "Highlight the object details, packaging, and one before/after desk moment. The tone should be clever, not corporate.",
      asset: "GoodDay_Workspace_Kit.pdf",
    },
    qna: [
      {
        question: "Can I show my own Notion template alongside the kit?",
        answer: "Yes. Please keep the workspace kit visible in the first three seconds.",
      },
    ],
    invited: true,
    similarIds: ["aura-sun", "northline", "velvet-run"],
  },
  {
    id: "loom-home",
    brand: "Airbnb",
    domain: "airbnb.com",
    title: "Unique summer getaways series",
    niche: "Travel",
    location: "New York, NY",
    budget: "₹3K - ₹5K",
    daysLeft: 11,
    bids: 24,
    dueDate: "Aug 12",
    status: "Open",
    match: 88,
    description: "Document a weekend retreat to a unique Airbnb property, focusing on design, local experiences, and honest narration.",
    deliverables: ["2 Reels", "4 Stories", "Usage cutdowns"],
    eligibility: ["50K-400K followers", "Home, lifestyle, interiors", "NYC or LA preferred", "Audience household income index above average"],
    rights: {
      included: "Organic reposting for 60 days and one email feature.",
      paid: "Paid social usage, website hero usage, and exclusivity priced separately.",
    },
    brief: {
      summary: "Show a tangible room transformation without making it feel staged. Natural light, texture, and honest narration matter most.",
      asset: "LoomHome_ApartmentRefresh.pdf",
    },
    qna: [
      {
        question: "Does the brand cover prop styling?",
        answer: "We can reimburse up to $250 for props if approved before purchase.",
      },
    ],
    invited: true,
    similarIds: ["aura-sun", "northline", "goodday-kit"],
  },
  {
    id: "northline",
    brand: "Patagonia",
    domain: "patagonia.com",
    title: "Trail-to-city capsule drop",
    niche: "Outdoors",
    location: "California",
    budget: "₹4K - ₹7K",
    daysLeft: 1,
    bids: 31,
    dueDate: "Jul 29",
    status: "Closing Soon",
    match: 83,
    exclusive: true,
    description: "A fashion capsule campaign that bridges outdoor utility and city styling across short-form video and stills.",
    deliverables: ["1 Reel", "5 edited photos", "3 Stories"],
    eligibility: ["75K-500K followers", "Fashion, outdoors, or lifestyle", "California creators", "No competing outerwear campaign for 30 days"],
    rights: {
      included: "Organic reposting for 30 days.",
      paid: "Paid ad usage, retail page usage, and category exclusivity are add-ons.",
    },
    brief: {
      summary: "Style the capsule in one outdoor and one city setting. Prioritize movement, texture, and utility details.",
      asset: "Northline_Capsule_Brief.pdf",
    },
    qna: [
      {
        question: "Is category exclusivity mandatory?",
        answer: "No. It is optional, but we will prioritize bids that include a 30-day exclusivity add-on.",
      },
    ],
    similarIds: ["loom-home", "velvet-run", "milk-run"],
  },
  {
    id: "milk-run",
    brand: "Uber Eats",
    domain: "ubereats.com",
    title: "Late-night snack delivery challenge",
    niche: "Food",
    location: "Chicago, IL",
    budget: "₹900 - ₹1.6K",
    daysLeft: 8,
    bids: 14,
    dueDate: "Aug 05",
    status: "Open",
    match: 79,
    description: "A playful food delivery campaign built around late-night cravings and creator-led snack combinations.",
    deliverables: ["1 TikTok", "2 Stories"],
    eligibility: ["15K-120K followers", "Food, comedy, college, or lifestyle", "Chicago-based", "Age 18+ audience 80%+"],
    rights: {
      included: "Organic reposting for 21 days.",
      paid: "Paid usage and whitelisting available as optional add-ons.",
    },
    brief: {
      summary: "Make the order feel spontaneous and funny. The best submissions should feel like a group chat became a video.",
      asset: "MilkRun_Challenge.pdf",
    },
    qna: [
      {
        question: "Can friends appear in the content?",
        answer: "Yes, but everyone visible must sign the simple release form in the brief.",
      },
    ],
    similarIds: ["aura-sun", "velvet-run", "goodday-kit"],
  },
  {
    id: "velvet-run",
    brand: "Spotify",
    domain: "spotify.com",
    title: "Creator workspace playlists",
    niche: "Music",
    location: "Los Angeles, CA",
    budget: "₹2K - ₹3.2K",
    daysLeft: 0,
    bids: 42,
    dueDate: "Jul 21",
    status: "Filled",
    description: "Share the ultimate workspace playlist and the rituals behind how music fuels your creative process.",
    deliverables: ["1 Reel", "1 Feed post"],
    eligibility: ["30K-300K followers", "Fashion niche", "LA-based", "Strong photo portfolio"],
    rights: {
      included: "Organic reposting for 30 days.",
      paid: "Paid usage available only through a separate license.",
    },
    brief: {
      summary: "This campaign has reached its creator quota, but remains visible for transparency and similar campaign discovery.",
      asset: "VelvetRun_Editorial.pdf",
    },
    qna: [
      {
        question: "Will you reopen if a creator drops out?",
        answer: "Possibly. Saved creators will be notified first if a slot opens.",
      },
    ],
    similarIds: ["northline", "loom-home", "goodday-kit"],
  },
  {
    id: "glossier-glow",
    brand: "Glossier",
    domain: "glossier.com",
    title: "You look good — skincare honest reviews",
    niche: "Beauty",
    location: "New York, NY",
    budget: "₹1.2K - ₹2.1K",
    daysLeft: 9,
    bids: 27,
    dueDate: "Aug 08",
    status: "Open",
    match: 87,
    description: "Glossier wants raw, unfiltered skincare reviews. No filters, no ring lights required. Just your honest skin journey with their cult products.",
    deliverables: ["1 Reel", "3 Stories"],
    eligibility: ["10K-200K followers", "Skincare or beauty niche", "US or UK audience", "Engaged comment section"],
    rights: {
      included: "Organic repost on Glossier's channels for 30 days.",
      paid: "Paid social usage available as an add-on.",
    },
    brief: {
      summary: "Show your real skincare routine morning or night. Include at least one Glossier product. Authenticity over polish — unboxing, first impressions, and candid skin texture are all welcome.",
      asset: "Glossier_HonestReview_Brief.pdf",
    },
    qna: [{ question: "Can I share a mixed review?", answer: "Yes. Honest feedback is encouraged. We only ask that cons are specific and constructive." }],
    similarIds: ["aura-sun", "milk-run", "velvet-run"],
  },
  {
    id: "figma-config",
    brand: "Figma",
    domain: "figma.com",
    title: "Config 2026 — design process series",
    niche: "Design",
    location: "Remote",
    budget: "₹3K - ₹4.5K",
    daysLeft: 14,
    bids: 11,
    dueDate: "Aug 28",
    status: "Open",
    match: 81,
    description: "Document how you use Figma in your real design or product workflow ahead of Config 2026. Behind-the-scenes process content performs best.",
    deliverables: ["1 screen-recorded Reel", "1 carousel", "2 Stories"],
    eligibility: ["15K-400K followers", "Design, product, or tech niche", "Active Figma user", "Portfolio of product work"],
    rights: {
      included: "Feature in Figma's creator newsletter and one social repost.",
      paid: "Extended paid usage and conference materials require a separate agreement.",
    },
    brief: {
      summary: "Walk through one design decision you made this month inside Figma. Show your layers, your components, your reasoning. Make it feel like a behind-the-scenes, not a tutorial.",
      asset: "Figma_Config_CreatorBrief.pdf",
    },
    qna: [{ question: "Does the content need to mention Config 2026 specifically?", answer: "A mention is appreciated but not mandatory. The focus is on genuine Figma use." }],
    similarIds: ["goodday-kit", "northline", "loom-home"],
  },
  {
    id: "oatly-oat",
    brand: "Oatly",
    domain: "oatly.com",
    title: "Oatly barista — your morning ritual",
    niche: "Food",
    location: "Remote",
    budget: "₹800 - ₹1.4K",
    daysLeft: 12,
    bids: 33,
    dueDate: "Aug 14",
    status: "Open",
    description: "Oatly wants to see your actual morning coffee ritual — made with Oatly Barista. Casual, cozy, and real. No barista training required.",
    deliverables: ["1 TikTok or Reel", "1 Story"],
    eligibility: ["8K-150K followers", "Food, lifestyle, or wellness niche", "Coffee or cooking content", "18+ audience"],
    rights: {
      included: "Organic repost rights for 21 days.",
      paid: "Paid usage and packaging feature require additional licensing.",
    },
    brief: {
      summary: "Film your morning coffee being made with Oatly Barista. Latte art optional. Vibe mandatory. Keep it under 45 seconds and show the pour.",
      asset: "Oatly_MorningRitual_Brief.pdf",
    },
    qna: [{ question: "Can I show another milk brand in the video?", answer: "No. Only Oatly plant-based milks should appear in the content." }],
    similarIds: ["milk-run", "aura-sun", "velvet-run"],
  },
  {
    id: "calm-app",
    brand: "Calm",
    domain: "calm.com",
    title: "Sleep story — wind-down routines",
    niche: "Wellness",
    location: "Remote",
    budget: "₹1.5K - ₹2.8K",
    daysLeft: 7,
    bids: 19,
    dueDate: "Aug 11",
    status: "Open",
    match: 76,
    description: "Calm is partnering with creators to show real wind-down routines that end with the Calm app. Low energy, high intention.",
    deliverables: ["1 Reel", "2 Stories"],
    eligibility: ["20K-300K followers", "Wellness, mindfulness, or lifestyle niche", "Calm app user preferred", "Peaceful aesthetic"],
    rights: {
      included: "One repost on Calm's channels within 72 hours of publishing.",
      paid: "Paid social and CTV ads require a separate scope.",
    },
    brief: {
      summary: "Film a 5-step wind-down routine ending with the Calm app sleep section. Soft lighting, slow movement, and minimal talking. Think ASMR meets lifestyle.",
      asset: "Calm_WindDown_Brief.pdf",
    },
    qna: [{ question: "Can I show other wellness products?", answer: "Yes, as long as they are not competing sleep or meditation apps." }],
    similarIds: ["aura-sun", "velvet-run", "loom-home"],
  },
  {
    id: "cider-drop",
    brand: "Cider",
    domain: "shopcider.com",
    title: "Summer haul — show us the fit",
    niche: "Fashion",
    location: "Remote",
    budget: "₹600 - ₹1K",
    daysLeft: 4,
    bids: 52,
    dueDate: "Aug 01",
    status: "Closing Soon",
    description: "Cider is looking for trend-led haul creators who can style multiple looks in one punchy Reel. Fast cuts, fun energy, real outfits.",
    deliverables: ["1 haul Reel", "3 Stories"],
    eligibility: ["5K-100K followers", "Fashion or Gen Z lifestyle", "High engagement rate", "Female-skewing audience"],
    rights: {
      included: "Repost on Cider's Instagram and TikTok.",
      paid: "Paid ads and ambassador usage are priced separately.",
    },
    brief: {
      summary: "Show 3-5 Cider pieces styled as complete outfits. Fast cut transitions, trending audio, and a strong hook in the first 2 seconds. Don't overthink it — energy over perfection.",
      asset: "Cider_Haul_Brief.pdf",
    },
    qna: [{ question: "Can I show products from other brands alongside Cider?", answer: "Accessory brands are fine. No direct competitor clothing brands." }],
    similarIds: ["northline", "goodday-kit", "velvet-run"],
  },
  {
    id: "rayban-stories",
    brand: "Ray-Ban",
    domain: "ray-ban.com",
    title: "Ray-Ban Meta — life through the lens",
    niche: "Tech",
    location: "United States",
    budget: "₹4K - ₹6.5K",
    daysLeft: 6,
    bids: 8,
    dueDate: "Aug 09",
    status: "Open",
    match: 73,
    description: "Ray-Ban Meta smart glasses campaign for creators who live their content — not script it. POV content from a day actually lived.",
    deliverables: ["1 POV Reel", "1 carousel", "2 Stories"],
    eligibility: ["30K-500K followers", "Tech, travel, or adventure niche", "US-based", "Active outdoor lifestyle"],
    rights: {
      included: "Organic repost rights for 45 days.",
      paid: "TV, OOH, and paid social require a full licensing agreement.",
    },
    brief: {
      summary: "Spend one day wearing the Ray-Ban Meta glasses and capture POV clips throughout. Morning commute, lunch spot, evening walk. Edit into a punchy day-in-the-life Reel.",
      asset: "RayBan_Meta_CreatorBrief.pdf",
    },
    qna: [{ question: "Will Ray-Ban ship the glasses to me?", answer: "Yes. Glasses are loaned for the campaign period and must be returned within 30 days of posting." }],
    similarIds: ["goodday-kit", "loom-home", "northline"],
  },
  {
    id: "gymshark-train",
    brand: "Gymshark",
    domain: "gymshark.com",
    title: "Heavy lifts and raw sets",
    niche: "Fitness",
    location: "United Kingdom",
    budget: "₹2.5K - ₹4K",
    daysLeft: 5,
    bids: 41,
    dueDate: "Aug 15",
    status: "Open",
    description: "Gymshark is looking for creators who lift heavy. We want to see raw sets, chalk, and real sweat in the new Apex collection.",
    deliverables: ["2 Reels", "3 Stories"],
    eligibility: ["20K-250K followers", "Fitness niche", "High engagement rate on videos"],
    rights: {
      included: "Organic reposts on Gymshark TikTok and Instagram.",
      paid: "Paid ads and website feature require separate agreement.",
    },
    brief: {
      summary: "Show a real workout wearing the new Apex collection. Focus on form, intensity, and the fabric's movement.",
      asset: "Gymshark_Apex_Brief.pdf",
    },
    qna: [{ question: "Do I have to be a powerlifter?", answer: "No, but we want to see high-intensity or heavy weight training." }],
    similarIds: ["milk-run", "velvet-run"],
  },
  {
    id: "spotify-wrapped",
    brand: "Spotify",
    domain: "spotify.com",
    title: "Early Wrapped hype campaign",
    niche: "Music",
    location: "Remote",
    budget: "₹5K - ₹8K",
    daysLeft: 20,
    bids: 112,
    dueDate: "Nov 15",
    status: "Open",
    match: 92,
    description: "Help us build the hype for Spotify Wrapped 2026. Create content guessing your top artists or sharing your listening habits this year.",
    deliverables: ["1 TikTok", "1 IG Reel"],
    eligibility: ["50K-1M followers", "Music, Pop Culture, or Comedy niche", "Gen Z audience"],
    rights: {
      included: "Repost rights across all Spotify global channels.",
      paid: "Full buyout for digital ads for 3 months.",
    },
    brief: {
      summary: "Make a funny, relatable video about how much you've listened to a specific artist or song this year. Use the provided trending audio.",
      asset: "Spotify_Wrapped_Hype_Brief.pdf",
    },
    qna: [{ question: "Can I use Apple Music in the video?", answer: "Absolutely not." }],
    similarIds: ["rayban-stories", "glossier-glow"],
  },
  {
    id: "duolingo-streak",
    brand: "Duolingo",
    domain: "duolingo.com",
    title: "Unhinged streak protection",
    niche: "Comedy",
    location: "Remote",
    budget: "₹3K - ₹5.5K",
    daysLeft: 8,
    bids: 89,
    dueDate: "Aug 20",
    status: "Open",
    description: "Show us what lengths you will go to protect your Duolingo streak. The more chaotic, the better. Duo might even duet you.",
    deliverables: ["1 TikTok"],
    eligibility: ["100K+ followers", "Comedy or Gen Z lifestyle", "Must have a real Duolingo streak of 30+ days"],
    rights: {
      included: "Organic duet/stitch by the official Duolingo account.",
      paid: "No paid ads planned for this specific challenge.",
    },
    brief: {
      summary: "Create a short skit showing an extreme situation where you stop everything to do your daily lesson and save your streak.",
      asset: "Duolingo_Streak_Brief.pdf",
    },
    qna: [{ question: "Can I dress up as Duo?", answer: "Yes, but it's not required. Real-life scenarios work best." }],
    similarIds: ["cider-drop", "figma-config"],
  },
  {
    id: "patagonia-trail",
    brand: "Patagonia",
    domain: "patagonia.com",
    title: "Leave no trace - Trail stories",
    niche: "Outdoors",
    location: "United States",
    budget: "₹1.5K - ₹3K",
    daysLeft: 11,
    bids: 34,
    dueDate: "Sep 01",
    status: "Open",
    match: 85,
    description: "Share your favorite hidden trail and how you practice 'Leave No Trace' while wearing Patagonia's new sustainable fleece.",
    deliverables: ["1 Reel", "3 High-Res Photos"],
    eligibility: ["15K-200K followers", "Outdoors, hiking, or travel niche", "US or Canada based"],
    rights: {
      included: "Repost on Patagonia's Instagram and website blog.",
      paid: "None. Patagonia does not run paid social ads.",
    },
    brief: {
      summary: "Cinematic, calm outdoor shots. Talk about the importance of protecting the trails. Do not heavily promote the fleece, let it naturally be part of your gear.",
      asset: "Patagonia_Trail_Stories.pdf",
    },
    qna: [{ question: "Do I need to disclose the location?", answer: "No, we actually prefer you don't geo-tag hidden spots to protect them." }],
    similarIds: ["rayban-stories", "calm-app"],
  },
  {
    id: "airbnb-host",
    brand: "Airbnb",
    domain: "airbnb.com",
    title: "The art of hosting",
    niche: "Home & Decor",
    location: "Europe",
    budget: "₹6K - ₹10K",
    daysLeft: 15,
    bids: 18,
    dueDate: "Sep 10",
    status: "Open",
    description: "Showcase the unique touches that make an Airbnb stay special. We're looking for interior design, hospitality, and cozy aesthetics.",
    deliverables: ["1 long-form Reel", "1 Carousel"],
    eligibility: ["40K-400K followers", "Interior design or luxury travel", "Must be an active Airbnb Host"],
    rights: {
      included: "Repost on Airbnb global channels for 60 days.",
      paid: "Paid usage rights are negotiated per creator.",
    },
    brief: {
      summary: "Give a tour of your Airbnb property focusing on the small details: local coffee, fresh linens, curated books. Warm lighting and ASMR sounds.",
      asset: "Airbnb_Hosting_Brief.pdf",
    },
    qna: [{ question: "Do I have to be a Superhost?", answer: "No, but you must have a rating of 4.8 or higher." }],
    similarIds: ["loom-home", "patagonia-trail"],
  },
  {
    id: "rare-beauty",
    brand: "Rare Beauty",
    domain: "rarebeauty.com",
    title: "Soft pinch liquid blush - your way",
    niche: "Beauty",
    location: "Remote",
    budget: "₹4K - ₹7K",
    daysLeft: 6,
    bids: 156,
    dueDate: "Aug 05",
    status: "Closing Soon",
    match: 88,
    description: "Show us how you use our viral Soft Pinch Liquid Blush. Whether it's a dot or a full beat, we want to see your unique application technique.",
    deliverables: ["1 TikTok", "2 Stories"],
    eligibility: ["50K-500K followers", "Beauty makeup tutorials", "Highly engaged audience"],
    rights: {
      included: "Organic reposts on Rare Beauty channels.",
      paid: "Paid ad usage for 30 days included in the base rate.",
    },
    brief: {
      summary: "A quick, punchy tutorial on your blush placement. Be authentic and talk through your process. Ensure good, natural lighting.",
      asset: "RareBeauty_Blush_Brief.pdf",
    },
    qna: [{ question: "Can I mix shades?", answer: "Yes! We love custom shade mixes." }],
    similarIds: ["glossier-glow", "calm-app"],
  },
]

const PIPELINE_DEALS: PipelineDeal[] = [
  {
    id: "deal-aura",
    campaignId: "aura-sun",
    stage: "negotiation",
    total: "₹3,450",
    due: "Jul 24",
    nextStep: "Brand countered usage rights. Reply by tomorrow.",
    timeline: [
      { id: "t1", timestamp: "Jul 1, 9:00 AM", label: "Bid submitted", status: "completed" },
      { id: "t2", timestamp: "Jul 2, 2:30 PM", label: "Brand viewed your bid", status: "completed" },
      { id: "t3", timestamp: "Jul 3, 11:00 AM", label: "Negotiation started", note: "Brand requested 60-day usage rights", status: "active" },
      { id: "t4", timestamp: "", label: "Contract signing", status: "pending" },
      { id: "t5", timestamp: "", label: "Content submission", status: "pending" },
      { id: "t6", timestamp: "", label: "Payment release", status: "pending" },
    ],
    messages: [
      { from: "Brand", text: "Love the pitch. Can you include 60 days paid usage?", total: "₹3,100" },
      { from: "You", text: "Yes, with 60-day paid usage I can do the package at this updated total.", total: "₹3,450" },
    ],
  },
  {
    id: "deal-goodday",
    campaignId: "goodday-kit",
    stage: "bid",
    total: "₹2,150",
    due: "Aug 02",
    nextStep: "Waiting for brand review.",
    timeline: [
      { id: "t1", timestamp: "Jul 5, 10:42 AM", label: "Bid drafted and reviewed", status: "completed" },
      { id: "t2", timestamp: "Jul 5, 10:45 AM", label: "Bid sent to brand", status: "active" },
      { id: "t3", timestamp: "", label: "Negotiation", status: "pending" },
      { id: "t4", timestamp: "", label: "Contract signing", status: "pending" },
      { id: "t5", timestamp: "", label: "Payment release", status: "pending" },
    ],
    messages: [{ from: "You", text: "Submitted per-deliverable pricing with one revision round.", total: "₹2,150" }],
  },
  {
    id: "deal-loom",
    campaignId: "loom-home",
    stage: "contract",
    total: "₹4,800",
    due: "Aug 12",
    nextStep: "Sign the contract to unlock your workspace.",
    timeline: [
      { id: "t1", timestamp: "Jul 2", label: "Bid submitted", status: "completed" },
      { id: "t2", timestamp: "Jul 4", label: "Negotiation completed", status: "completed" },
      { id: "t3", timestamp: "Jul 5, 9:00 AM", label: "Contract ready to sign", status: "active" },
      { id: "t4", timestamp: "", label: "Workspace unlocked", status: "pending" },
      { id: "t5", timestamp: "", label: "Content submission", status: "pending" },
      { id: "t6", timestamp: "", label: "Go live", status: "pending" },
      { id: "t7", timestamp: "", label: "Payment release", status: "pending" },
    ],
    messages: [{ from: "Brand", text: "Approved. Contract ready for your signature.", total: "₹4,800" }],
    contract: {
      totalAmount: "₹4,800",
      usageRights: "60 days paid usage across brand-owned channels",
      exclusivity: "30-day category exclusivity",
      deadline: "Aug 12, 2026",
      revisionRounds: 2,
      creatorSigned: false,
      brandSigned: true,
      deliverables: [
        { id: "d1", name: "1 Reel (45-60s)", type: "post", status: "pending" },
        { id: "d2", name: "3 edited photos", type: "upload", status: "pending" },
        { id: "d3", name: "2 Stories", type: "post", status: "pending" },
      ],
      paymentMilestones: [
        { id: "m1", label: "On content approval", amount: "₹2,400", type: "fixed", status: "locked" },
        { id: "m2", label: "At 50K views", amount: "₹1,200", type: "performance", targetViews: 50000, currentViews: 0, status: "locked" },
        { id: "m3", label: "At 100K views", amount: "₹1,200", type: "performance", targetViews: 100000, currentViews: 0, status: "locked" },
      ],
    },
  },
  {
    id: "deal-glossier",
    campaignId: "glossier-glow",
    stage: "content",
    total: "₹2,100",
    due: "Aug 08",
    nextStep: "Upload first draft for review.",
    timeline: [
      { id: "t1", timestamp: "Jul 10", label: "Bid submitted", status: "completed" },
      { id: "t2", timestamp: "Jul 12", label: "Contract signed", status: "completed" },
      { id: "t3", timestamp: "Jul 13", label: "Workspace unlocked", status: "completed" },
      { id: "t4", timestamp: "Today, 10:00 AM", label: "Upload content for review", status: "active" },
      { id: "t5", timestamp: "", label: "Brand review", status: "pending" },
      { id: "t6", timestamp: "", label: "Go live", status: "pending" },
    ],
    messages: [{ from: "Brand", text: "Excited to see your first draft! Drop it here when ready.", total: "₹2,100" }],
    contract: {
      totalAmount: "₹2,100",
      usageRights: "Organic repost only",
      exclusivity: "None",
      deadline: "Aug 08, 2026",
      revisionRounds: 1,
      creatorSigned: true,
      brandSigned: true,
      deliverables: [
        { id: "d1", name: "1 Reel (45-60s)", type: "post", status: "pending" },
      ],
      paymentMilestones: [
        { id: "m1", label: "On content approval", amount: "₹2,100", type: "fixed", status: "locked" },
      ],
    },
  },
  {
    id: "deal-northline",
    campaignId: "northline",
    stage: "tracking",
    total: "₹6,250",
    due: "Jul 29",
    nextStep: "Tracking performance. ₹3,125 released, ₹3,125 pending milestones.",
    timeline: [
      { id: "t1", timestamp: "Jun 20", label: "Bid accepted", status: "completed" },
      { id: "t2", timestamp: "Jun 22", label: "Contract signed", status: "completed" },
      { id: "t3", timestamp: "Jun 28", label: "Content approved", status: "completed" },
      { id: "t4", timestamp: "Jul 1", label: "Content posted — tracking live", note: "₹3,125 released on approval", status: "active" },
      { id: "t5", timestamp: "", label: "50K views milestone", status: "pending" },
      { id: "t6", timestamp: "", label: "Final payment release", status: "pending" },
    ],
    messages: [{ from: "You", text: "Final Reel and photo set uploaded for approval.", total: "₹6,250" }],
    contract: {
      totalAmount: "₹6,250",
      usageRights: "90 days across all channels",
      exclusivity: "None",
      deadline: "Jul 29, 2026",
      revisionRounds: 1,
      creatorSigned: true,
      brandSigned: true,
      deliverables: [
        { id: "d1", name: "1 Reel", type: "post", status: "posted", postUrl: "https://instagram.com/p/example1" },
        { id: "d2", name: "5 edited photos", type: "upload", status: "approved" },
        { id: "d3", name: "3 Stories", type: "post", status: "posted", postUrl: "https://instagram.com/s/example2" },
      ],
      paymentMilestones: [
        { id: "m1", label: "On content approval", amount: "₹3,125", type: "fixed", status: "released" },
        { id: "m2", label: "At 50K views", amount: "₹1,562", type: "performance", targetViews: 50000, currentViews: 31400, status: "locked" },
        { id: "m3", label: "At 100K views", amount: "₹1,563", type: "performance", targetViews: 100000, currentViews: 31400, status: "locked" },
      ],
    },
  },
]

const INVITATION_CAMPAIGNS: Campaign[] = [
  {
    id: "inv-dyson",
    brand: "Dyson",
    domain: "dyson.com",
    title: "Dyson Airwrap creator series",
    niche: "Beauty",
    location: "United Kingdom",
    budget: "₹8K - ₹12K",
    daysLeft: 5,
    bids: 0,
    dueDate: "Aug 10",
    status: "Open",
    match: 98,
    saved: false,
    invited: true,
    description: "Dyson is inviting select creators to showcase the Airwrap Styler in an authentic get-ready-with-me format. Your audience fit and content quality stood out.",
    deliverables: ["1 Reel", "2 Stories", "1 TikTok"],
    eligibility: ["50K-500K followers", "Beauty or lifestyle niche", "Female-skewing audience", "Prior haircare content"],
    rights: {
      included: "Organic reposting on Dyson's brand channels for 60 days.",
      paid: "Paid social, TV, and out-of-home usage available as separate add-ons.",
    },
    brief: {
      summary: "Show a natural morning routine using the Airwrap. Focus on the transformation — volume, texture, and finish. Avoid overly scripted or tutorial-heavy formats.",
      asset: "Dyson_Airwrap_Brief.pdf",
    },
    qna: [
      {
        question: "Can I mention other hair products I use alongside Dyson?",
        answer: "Yes, as long as they are not competing hot tools or styling brands.",
      },
    ],
    similarIds: [],
  },
  {
    id: "inv-notion",
    brand: "Notion",
    domain: "notion.so",
    title: "Build in public with Notion AI",
    niche: "Productivity",
    location: "Remote",
    budget: "₹5K - ₹9K",
    daysLeft: 3,
    bids: 0,
    dueDate: "Aug 03",
    status: "Open",
    match: 94,
    saved: false,
    invited: true,
    description: "Notion handpicked you to demonstrate how AI features inside Notion can supercharge a creative or founder workflow. Real use, real output — no demos.",
    deliverables: ["1 long-form video", "2 Reels", "Thread or carousel"],
    eligibility: ["20K-300K followers", "Tech, founder, or productivity niche", "English-speaking audience", "Active on YouTube or LinkedIn"],
    rights: {
      included: "Repost rights on Notion's social channels for 45 days.",
      paid: "Paid ads and case study usage require a separate agreement.",
    },
    brief: {
      summary: "Walk through a real Notion AI use case — a content calendar, research pipeline, or project dashboard. Make it feel natural and personal, not promotional.",
      asset: "Notion_AI_Creator_Brief.pdf",
    },
    qna: [
      {
        question: "Is Notion AI required, or can I show classic Notion features?",
        answer: "AI features must be the hero, but classic features can appear as supporting context.",
      },
    ],
    similarIds: [],
  },
  {
    id: "inv-loewe",
    brand: "Loewe",
    domain: "loewe.com",
    title: "Loewe Puzzle bag editorial",
    niche: "Luxury Fashion",
    location: "Paris, France",
    budget: "₹15K - ₹22K",
    daysLeft: 7,
    bids: 0,
    dueDate: "Aug 18",
    status: "Open",
    match: 91,
    saved: false,
    invited: true,
    description: "Loewe's digital team selected you for an exclusive editorial shoot featuring the SS25 Puzzle bag collection. Artistic direction provided; creative latitude encouraged.",
    deliverables: ["5 editorial photos", "1 Reel", "2 Stories"],
    eligibility: ["75K-600K followers", "Fashion or luxury lifestyle", "High-quality photography portfolio", "Audience in EU, UK, or US"],
    rights: {
      included: "One Instagram story repost within 48 hours.",
      paid: "Campaign usage, print, and e-commerce rights are negotiated separately.",
    },
    brief: {
      summary: "Style the Puzzle bag in two contrasting environments — architectural and organic. Minimal caption, no product tagging required in the visual. Loewe will handle caption guidelines.",
      asset: "Loewe_SS25_Editorial_Pack.pdf",
    },
    qna: [
      {
        question: "Can I style the bag with my own wardrobe?",
        answer: "Yes. Loewe will also send two optional styling pieces if you'd like them.",
      },
    ],
    similarIds: [],
  },
  {
    id: "inv-arc",
    brand: "Arc Browser",
    domain: "arc.net",
    title: "Arc for creators — the browser drop",
    niche: "Tech",
    location: "Remote",
    budget: "₹4K - ₹6K",
    daysLeft: 10,
    bids: 0,
    dueDate: "Aug 22",
    status: "Open",
    match: 89,
    saved: false,
    invited: true,
    description: "Arc Browser chose you to show how their product changes day-to-day creative browsing. They want real workflows, not walkthroughs. Authenticity is everything.",
    deliverables: ["1 YouTube short or Reel", "1 feed post"],
    eligibility: ["15K-200K followers", "Tech, design, or founder niche", "Mac or iOS user", "English content"],
    rights: {
      included: "Repost on Arc's social media and inclusion in a creators spotlight blog.",
      paid: "Paid sponsorship ads require explicit written agreement.",
    },
    brief: {
      summary: "Show one specific Arc feature that changed how you work — Spaces, Command Bar, Easels, or Boosts. Be specific, be honest, and don't oversell.",
      asset: "Arc_Creator_Brief.pdf",
    },
    qna: [
      {
        question: "Can I mention browser alternatives?",
        answer: "You can reference your previous browser to explain the switch, but don't name competing browsers directly.",
      },
    ],
    similarIds: [],
  },
]

const TABS = [
  { id: "discover", label: "Discover", icon: Dice2 },
  { id: "invitations", label: "Invitations", icon: Inbox },
  { id: "pipeline", label: "My Pipeline", icon: KanbanSquare },
] satisfies Array<{ id: CampaignTab; label: string; icon: typeof Sparkles }>

const FILTERS = ["Saved", "Beauty", "Fashion", "Design", "Home", "Food", "Remote"]

const statusStyles: Record<CampaignStatus, string> = {
  Open: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Closing Soon": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Filled: "bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-gray-400",
  Closed: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
}

const brandGradients = [
  "from-[#ff7a00] via-[#ff004d] to-[#8000ff]",
  "from-[#0ea5e9] via-[#0060ff] to-[#111827]",
  "from-[#84cc16] via-[#22c55e] to-[#0f766e]",
  "from-[#f97316] via-[#f43f5e] to-[#7c3aed]",
  "from-[#facc15] via-[#fb923c] to-[#ef4444]",
]

function getBrandInitials(name: string) {
  const words = name.split(/\s+/).filter(Boolean)
  return words.length > 1 ? `${words[0][0]}${words[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase()
}

function getBrandGradient(name: string) {
  const index = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % brandGradients.length
  return brandGradients[index]
}

function getCardBudget(campaign: Campaign) {
  const maxBudget = campaign.budget.split(" - ")[1]
  return maxBudget ? `Up to ${maxBudget}` : campaign.budget
}

function CardShell({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={style} className={cn("rounded-2xl border border-[#e4e4e7] bg-white dark:border-[#27272a] dark:bg-[#0a0a0a]", className)}>
      {children}
    </div>
  )
}

function BrandMark({ campaign, size = "md" }: { campaign: Campaign; size?: "sm" | "md" }) {
  return (
    <div className={cn(
      "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#efefef] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] dark:border-[#27272a] dark:bg-[#111111]",
      size === "sm" ? "h-8 w-8" : "h-10 w-10"
    )}>
      <BrandLogo domain={campaign.domain} name={campaign.brand} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  )
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  return <span className={cn("inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md px-2.5 text-[10.5px] font-bold uppercase tracking-wide", statusStyles[status])}>{status}</span>
}

function MetricPill({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-1.5 flex items-center gap-2 text-gray-400">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="text-[18px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{value}</p>
    </div>
  )
}

const BRAND_COLORS: Record<string, { r: number, g: number, b: number }> = {
  "apple.com": { r: 0, g: 0, b: 0 },
  "nike.com": { r: 0, g: 0, b: 0 },
  "airbnb.com": { r: 255, g: 90, b: 95 },
  "patagonia.com": { r: 25, g: 25, b: 50 },
  "ubereats.com": { r: 6, g: 193, b: 103 },
  "spotify.com": { r: 30, g: 215, b: 96 },
}

function useBrandColor(domain: string) {
  const [colors, setColors] = useState<{bg: string, border: string} | null>(null);

  useEffect(() => {
    if (!domain) return;
    
    const brand = BRAND_COLORS[domain];
    if (brand) {
      setColors({
        bg: `rgba(${brand.r}, ${brand.g}, ${brand.b}, 0.08)`,
        border: `rgba(${brand.r}, ${brand.g}, ${brand.b}, 0.3)`
      });
      return;
    }

    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    setColors({
      bg: `hsla(${h}, 70%, 50%, 0.08)`,
      border: `hsla(${h}, 70%, 50%, 0.2)`
    });
  }, [domain]);

  return colors;
}

function CampaignCard({
  campaign,
  recommended = false,
  compact = false,
  onOpen,
}: {
  campaign: Campaign
  recommended?: boolean
  compact?: boolean
  onOpen: (campaign: Campaign) => void
}) {
  const isUnavailable = campaign.status === "Filled" || campaign.status === "Closed"
  const brandColors = useBrandColor(campaign.domain)
  
  const cardStyle = brandColors ? {
    background: `linear-gradient(135deg, ${brandColors.bg} 0%, transparent 100%)`,
    borderColor: brandColors.border
  } : {}

  return (
    <button
      type="button"
      onClick={() => onOpen(campaign)}
      style={cardStyle}
      className={cn(
        "group flex flex-col rounded-2xl border bg-white p-5 text-left shadow-none transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:bg-[#0a0a0a]",
        !brandColors && "border-[#e4e4e7] hover:border-gray-300 dark:border-[#27272a] dark:hover:border-gray-600",
        isUnavailable && "opacity-60",
        compact ? "h-[280px] w-[292px] min-w-[292px]" : "h-full w-full",
      )}
    >
      <div className="mb-4 flex h-9 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark campaign={campaign} />
          <div className="min-w-0 flex flex-col justify-center gap-0.5">
            <p className="truncate text-[14px] font-bold leading-none text-[#0a0a0a] dark:text-white">{campaign.brand}</p>
            <p className="truncate text-[12px] font-medium leading-none text-gray-500">{campaign.niche} · {campaign.location}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {recommended && campaign.match ? (
            <span className="inline-flex h-7 items-center justify-center whitespace-nowrap rounded-md bg-[#0060ff]/10 px-2.5 text-[11px] font-bold text-[#0060ff] dark:bg-[#4d90fe]/15 dark:text-[#4d90fe]">{campaign.match}% match</span>
          ) : null}
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <h3 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-tight text-[#0a0a0a] dark:text-white">{campaign.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">{campaign.description}</p>

      <div className="mt-3 flex items-center text-[12.5px] font-medium text-gray-500 dark:text-gray-400">
        <span className="truncate">{campaign.deliverables.slice(0, 3).join(" • ")}</span>
      </div>

      <div className="mt-auto pt-3">
        <div className="grid h-[62px] grid-cols-3 overflow-hidden rounded-[12px] border border-gray-200 bg-white dark:border-white/10 dark:bg-[#0a0a0a]">
          <div className="flex flex-col justify-center border-r border-gray-200 px-3 dark:border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Budget</p>
            <p className="mt-1 truncate text-[11.5px] font-bold text-[#0a0a0a] dark:text-white">{getCardBudget(campaign)}</p>
          </div>
          <div className="flex flex-col justify-center border-r border-gray-200 px-3 dark:border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Left</p>
            <p className="mt-1 text-[12px] font-bold text-[#0a0a0a] dark:text-white">{campaign.daysLeft ? `${campaign.daysLeft}d` : "Filled"}</p>
          </div>
          <div className="flex flex-col justify-center px-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Bids</p>
            <p className="mt-1 text-[12px] font-bold text-[#0a0a0a] dark:text-white">{campaign.bids}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

function CampaignTabs({ activeTab, onChange }: { activeTab: CampaignTab; onChange: (tab: CampaignTab) => void }) {
  return (
    <div className="flex w-full items-center overflow-hidden rounded-xl border border-[#efefef] bg-[#f4f4f5] p-0.5 dark:border-[#27272a] dark:bg-[#111111] sm:w-auto sm:shrink-0">
      {TABS.map((tab) => {
        const Icon = tab.icon
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex h-[30px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-3 text-[12.5px] font-medium transition-all sm:flex-none",
              active
                ? "bg-white text-[#0a0a0a] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-[#27272a] dark:text-white"
                : "text-[#737373] hover:text-[#0a0a0a] dark:text-[#a1a1aa] dark:hover:text-white",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function DiscoverView({
  campaigns,
  selectedFilter,
  isPanelOpen,
  onFilter,
  onOpen,
}: {
  campaigns: Campaign[]
  selectedFilter: string
  isPanelOpen: boolean
  onFilter: (filter: string) => void
  onOpen: (campaign: Campaign) => void
}) {
  const recommended = campaigns.filter((campaign) => campaign.match).slice(0, 8)
  const filteredCampaigns = campaigns.filter((campaign) => {
    if (campaign.invited) return false
    if (selectedFilter === "Saved") return campaign.saved
    if (selectedFilter === "All") return true
    return campaign.niche === selectedFilter || campaign.location === selectedFilter
  })

  return (
    <div className="flex flex-col gap-7">
      <div className={cn(
        "grid gap-5",
        isPanelOpen
          ? "grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}>
        {filteredCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

const PIPELINE_THEMES: Record<string, { laneBg: string; headerBg: string; dot: string; textColor: string }> = {
  "bid": { 
    laneBg: "bg-[#eef2f9] dark:bg-[#1a202c]", 
    headerBg: "bg-[#dce6f4] dark:bg-[#2d3748]", 
    dot: "bg-[#3b82f6]", 
    textColor: "text-[#1e3a8a] dark:text-blue-200" 
  },
  "negotiation": { 
    laneBg: "bg-[#f8f2e7] dark:bg-[#2c271e]", 
    headerBg: "bg-[#f2e6d1] dark:bg-[#483d2d]", 
    dot: "bg-[#f59e0b]", 
    textColor: "text-[#78350f] dark:text-orange-200" 
  },
  "contract": { 
    laneBg: "bg-[#f0ecf9] dark:bg-[#211e2c]", 
    headerBg: "bg-[#e0d8f4] dark:bg-[#382d48]", 
    dot: "bg-[#8b5cf6]", 
    textColor: "text-[#4c1d95] dark:text-purple-200" 
  },
  "tracking": { 
    laneBg: "bg-[#ecf7f1] dark:bg-[#1e2c24]", 
    headerBg: "bg-[#d4edd8] dark:bg-[#2d4834]", 
    dot: "bg-[#10b981]", 
    textColor: "text-[#14532d] dark:text-emerald-200" 
  },
  "content": { 
    laneBg: "bg-[#f9eced] dark:bg-[#2c1e20]", 
    headerBg: "bg-[#f4d8d9] dark:bg-[#482d30]", 
    dot: "bg-[#ef4444]", 
    textColor: "text-[#7f1d1d] dark:text-red-200" 
  },
  "accepted": { 
    laneBg: "bg-[#ecf7f1] dark:bg-[#1e2c24]", 
    headerBg: "bg-[#d4edd8] dark:bg-[#2d4834]", 
    dot: "bg-[#10b981]", 
    textColor: "text-[#14532d] dark:text-emerald-200" 
  },
  "revision": { 
    laneBg: "bg-[#fff7ed] dark:bg-[#2c1e12]", 
    headerBg: "bg-[#fed7aa] dark:bg-[#48311a]", 
    dot: "bg-[#f97316]", 
    textColor: "text-[#7c2d12] dark:text-orange-200" 
  },
  "posted": { 
    laneBg: "bg-[#f0f9ff] dark:bg-[#1a2630]", 
    headerBg: "bg-[#bae6fd] dark:bg-[#1e3a4a]", 
    dot: "bg-[#0ea5e9]", 
    textColor: "text-[#0c4a6e] dark:text-sky-200" 
  },
  "completed": { 
    laneBg: "bg-[#ecf7f1] dark:bg-[#1e2c24]", 
    headerBg: "bg-[#d4edd8] dark:bg-[#2d4834]", 
    dot: "bg-[#10b981]", 
    textColor: "text-[#14532d] dark:text-emerald-200" 
  },
};

function PipelineView({ campaigns, onOpen }: { campaigns: Campaign[]; onOpen: (campaign: Campaign) => void }) {
  const columns = [
    { id: "bid", label: "Bid sent" },
    { id: "negotiation", label: "Negotiation" },
    { id: "content", label: "Content creation" },
    { id: "accepted", label: "Brand accepted" },
    { id: "revision", label: "Revision needed" },
    { id: "posted", label: "Posted" },
    { id: "completed", label: "Completed" },
  ] as const

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex w-max gap-4">
        {columns.map((column) => {
          const deals = PIPELINE_DEALS.filter((deal) => deal.stage === column.id)
          const theme = PIPELINE_THEMES[column.id]
          
          return (
            <div key={column.id} className={cn("flex w-[310px] shrink-0 flex-col rounded-[20px] p-2 min-h-[600px]", theme.laneBg)}>
              <div className="mb-3 px-2 pt-2 flex items-center justify-between">
                <div className={cn("inline-flex h-8 items-center gap-2 rounded-full px-3", theme.headerBg)}>
                  <div className={cn("h-2 w-2 rounded-full", theme.dot)} />
                  <h2 className={cn("text-[13.5px] font-bold", theme.textColor)}>{column.label}</h2>
                  <span className={cn("ml-1 text-[13px] font-medium opacity-60", theme.textColor)}>{deals.length}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {deals.map((deal) => {
                  const campaign = campaigns.find((item) => item.id === deal.campaignId)
                  if (!campaign) return null
                  
                  return (
                    <button
                      key={deal.id}
                      type="button"
                      onClick={() => onOpen(campaign)}
                      className="group flex flex-col rounded-[14px] bg-white p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:bg-[#111111] dark:shadow-none dark:border dark:border-white/10"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={cn("h-2 w-2 shrink-0 rounded-full", theme.dot)} />
                        <h3 className="line-clamp-1 text-[14.5px] font-bold text-[#0a0a0a] dark:text-white">{campaign.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex h-6 items-center rounded-md bg-red-50 px-2 text-[11px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                          {campaign.budget.split(" - ")[1] || campaign.budget}
                        </span>
                        <span className="inline-flex h-6 items-center rounded-md bg-gray-100 px-2 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                          {campaign.bids} Bids
                        </span>
                        <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-200 ml-auto bg-white flex items-center justify-center p-0.5 dark:border-[#27272a] dark:bg-[#18181b]">
                          <BrandLogo domain={campaign.domain} name={campaign.brand} className="w-full h-full object-cover rounded-full" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11.5px] text-gray-500 font-medium mb-3">
                        <div className="flex items-center gap-1.5 line-clamp-1">
                          <Zap className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          <span className="truncate">{deal.nextStep}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{deal.due}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        <span className="inline-flex h-6 items-center rounded-md bg-gray-50 border border-gray-100 px-2 text-[11px] font-medium text-gray-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-400">
                          {campaign.niche}
                        </span>
                        {campaign.deliverables.slice(0, 1).map(d => (
                          <span key={d} className="inline-flex h-6 items-center rounded-md bg-gray-50 border border-gray-100 px-2 text-[11px] font-medium text-gray-500 dark:bg-white/5 dark:border-white/10 dark:text-gray-400">
                            {d}
                          </span>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InvitationCard({ campaign, onOpen }: { campaign: Campaign; onOpen: (campaign: Campaign) => void }) {
  const brandColors = useBrandColor(campaign.domain)
  
  const cardStyle = brandColors ? {
    background: `linear-gradient(135deg, ${brandColors.bg} 0%, transparent 100%)`,
    borderColor: brandColors.border
  } : {}

  return (
    <div className="relative h-full w-full group">
      <button
        type="button"
        onClick={() => onOpen(campaign)}
        style={cardStyle}
        className={cn(
          "flex h-full w-full flex-col rounded-[20px] border bg-white p-5 pb-[76px] text-left shadow-none transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:bg-[#0a0a0a]",
          !brandColors && "border-[#e4e4e7] dark:border-[#27272a]"
        )}
      >
        <div className="mb-4 flex h-9 w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark campaign={campaign} />
            <div className="min-w-0 flex flex-col justify-center gap-0.5">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[14px] font-bold leading-none text-[#0a0a0a] dark:text-white">{campaign.brand}</p>
                <LockKeyhole className="h-3.5 w-3.5 text-[#0060ff] dark:text-[#4d90fe]" />
              </div>
              <p className="truncate text-[12px] font-medium leading-none text-gray-500">Private invite · {campaign.niche}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center text-red-500 transition-colors hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
            >
              <X className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        <h3 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-tight text-[#0a0a0a] dark:text-white">{campaign.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500 dark:text-gray-400">{campaign.description}</p>

        <div className="mt-3 flex items-center text-[12.5px] font-medium text-gray-500 dark:text-gray-400">
          <span className="truncate">{campaign.deliverables.slice(0, 3).join(" • ")}</span>
        </div>

        <div className="mt-auto pt-3 w-full">
          <div className="grid h-[62px] grid-cols-2 overflow-hidden rounded-[12px] border border-gray-200 bg-white dark:border-white/10 dark:bg-[#0a0a0a] bg-opacity-50">
            <div className="flex flex-col justify-center border-r border-gray-200 px-3 dark:border-white/10">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Budget</p>
              <p className="mt-1 truncate text-[11.5px] font-bold text-[#0a0a0a] dark:text-white">{campaign.budget.split(" - ")[1] ?? campaign.budget}</p>
            </div>
            <div className="flex flex-col justify-center px-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Apply</p>
              <p className="mt-1 text-[12px] font-bold text-[#0a0a0a] dark:text-white">{Math.max(campaign.daysLeft, 1)} days</p>
            </div>
          </div>
        </div>
      </button>

      {/* Overlapping Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onOpen(campaign)
        }}
        className="absolute bottom-[-1px] left-[-1px] right-[-1px] flex h-[52px] items-center justify-center rounded-[20px] bg-[#0a0a0a] text-[14px] font-bold text-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)] transition-colors hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-gray-200"
      >
        Respond
      </button>
    </div>
  )
}

function InvitationsView({ onOpen }: { onOpen: (campaign: Campaign) => void }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {INVITATION_CAMPAIGNS.map((campaign) => (
        <InvitationCard key={campaign.id} campaign={campaign} onOpen={onOpen} />
      ))}
    </div>
  )
}

function BidForm({ 
  campaign, readOnly = false,
  collapsible, isExpanded = true, onToggle
}: { 
  campaign: Campaign, readOnly?: boolean;
  collapsible?: boolean; isExpanded?: boolean; onToggle?: () => void;
}) {
  const [pricingMode, setPricingMode] = useState<BidPricingMode>("deliverable")
  const [revisionRounds, setRevisionRounds] = useState("2")
  const [includeExclusivity, setIncludeExclusivity] = useState(false)
  const [bidStatus, setBidStatus] = useState<"editing" | "sending" | "submitted">("editing")

  const inputCls = "h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
  const labelCls = "mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300"

  const handleSend = () => {
    setBidStatus("sending")
    setTimeout(() => {
      setBidStatus("submitted")
      toast.success("Bid submitted successfully")
    }, 1800)
  }

  if (bidStatus === "sending") {
    return (
      <CardShell className="flex h-full min-h-[400px] flex-col overflow-hidden items-center justify-center bg-white dark:bg-[#0a0a0a] border border-[#e4e4e7] dark:border-[#27272a] relative">
        <motion.div
          initial={{ x: -100, y: 100, opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ x: 150, y: -150, opacity: [0, 1, 1, 0], scale: 1.2, rotate: 10 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute"
        >
          <Send className="w-16 h-16 text-[#0a0a0a] dark:text-white" />
        </motion.div>
      </CardShell>
    )
  }

  if (bidStatus === "submitted") {
    return (
      <CardShell className="flex h-full flex-col overflow-hidden bg-white dark:bg-[#111111] p-6 border border-[#e4e4e7] dark:border-[#27272a]">
        <div className="flex items-center gap-2 mb-8">
          <Clock3 className="w-5 h-5 text-[#a1a1aa]" />
          <h2 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Timeline</h2>
        </div>

        <div className="relative pl-10 space-y-8">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />
          
          <div className="relative flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-orange-500" />
            <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
              Just now
            </span>
            <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-zinc-300 mt-1">
              Bid sent successfully. The brand has been notified.
            </span>
          </div>

          <div className="relative flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
            <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-[#a1a1aa] dark:border-[#52525b]" />
            <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
              Today, 10:42 AM
            </span>
            <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-zinc-300 mt-1">
              Bid drafted and reviewed.
            </span>
          </div>
        </div>
      </CardShell>
    )
  }

  return (
    <CardShell className={cn("flex flex-col overflow-hidden transition-all duration-300", collapsible && !isExpanded ? "shrink-0" : "flex-1 h-full")}>
      {/* Header */}
      {collapsible ? (
        <button 
          type="button"
          onClick={onToggle}
          className={cn("flex w-full items-center justify-between px-5 py-4 shrink-0 text-left", isExpanded && "border-b border-[#e4e4e7] dark:border-[#27272a]")}
        >
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">
            {readOnly ? "Sent Bid Details" : "Create bid"}
          </h2>
          <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", isExpanded && "rotate-180")} />
        </button>
      ) : (
        <div className="shrink-0 px-5 pt-5 pb-0">
          <h2 className="text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">
            {readOnly ? "Sent Bid Details" : "Create bid"}
          </h2>
        </div>
      )}

      {(!collapsible || isExpanded) && (
        <ScrollShadow hideScrollBar className={cn("flex flex-1 flex-col gap-4 p-5", readOnly && "pointer-events-none opacity-80")}>
        {/* Pricing mode toggle */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-[#1a1a1a]">
          {[
            { id: "deliverable", label: "Per deliverable" },
            { id: "package", label: "Package" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setPricingMode(mode.id as BidPricingMode)}
              className={cn(
                "flex-1 rounded-lg h-[32px] text-[13px] font-semibold transition-all duration-200",
                pricingMode === mode.id
                  ? "bg-white text-[#0a0a0a] shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-[#2a2a2a] dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Deliverable line items */}
        {pricingMode === "deliverable" ? (
          <div className="flex flex-col gap-0 rounded-xl border border-[#e4e4e7] overflow-hidden dark:border-white/10">
            {campaign.deliverables.map((deliverable, index) => (
              <label key={deliverable} className={cn("flex items-center justify-between gap-3 px-3 py-2.5", index > 0 && "border-t border-[#e4e4e7] dark:border-white/10")}>
                <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{deliverable}</span>
                <input
                  defaultValue={index === 0 ? "₹1,400" : index === 1 ? "₹650" : "₹450"}
                  className="w-[90px] rounded-lg border border-[#e4e4e7] bg-white px-2 py-1.5 text-right text-[13px] font-bold text-[#0a0a0a] outline-none focus:border-[#0060ff] dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white"
                />
              </label>
            ))}
          </div>
        ) : (
          <div>
            <label className={labelCls}>Package total</label>
            <input defaultValue="₹2,950" className={inputCls} />
          </div>
        )}

        {/* Usage rights */}
        <div>
          <label className={labelCls}>Usage rights add-on</label>
          <input defaultValue="₹700 for 45 days paid usage" className={inputCls} />
        </div>

        {/* Revision + Delivery */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex-1">
            <label className={labelCls}>Revisions</label>
            <div className="relative">
              <input 
                type="number"
                min="0"
                value={revisionRounds}
                onChange={(e) => setRevisionRounds(e.target.value)}
                className={cn(inputCls, "pr-20")}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-gray-500 pointer-events-none">
                {revisionRounds === "1" ? "round" : "rounds"}
              </span>
            </div>
          </div>
          <div>
            <label className={labelCls}>Delivery date</label>
            <input type="date" defaultValue="2026-07-23" className={inputCls} />
          </div>
        </div>

        {/* Pitch */}
        <div>
          <label className={labelCls}>Pitch <span className="text-gray-400">· 150 words max</span></label>
          <textarea
            defaultValue="I can show the product in a realistic city-day routine with texture closeups, outdoor movement, and a clear callout around reapplication."
            className="min-h-[110px] w-full resize-none rounded-[14px] border border-[#e2e8f0] bg-white px-4 py-3 text-[14px] leading-relaxed text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
          />
        </div>

        {/* Portfolio */}
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-[#fafafa] text-[13px] font-semibold text-gray-500 transition hover:bg-gray-100 dark:border-white/15 dark:bg-white/[0.02] dark:text-gray-400 dark:hover:bg-white/[0.05]"
        >
          <Upload className="h-4 w-4" />
          Attach portfolio proof
        </button>

        {/* Exclusivity */}
        <div className="flex w-full flex-col gap-2 rounded-xl border border-[#e4e4e7] p-3.5 text-left dark:border-white/10">
          <span className="block text-[13px] font-bold text-[#0a0a0a] dark:text-white">Add exclusivity clause</span>
          <input 
            defaultValue="₹1,200 for 30-day category exclusivity" 
            className={cn(inputCls, "bg-white/50 focus:bg-white dark:bg-black/20 dark:focus:bg-black")} 
          />
        </div>

        {/* Submit */}
        {!readOnly && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSend}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] text-[14px] font-bold text-white transition hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-gray-200 pointer-events-auto"
            >
              <Send className="h-4 w-4" />
              Review and send bid
            </button>
          </div>
        )}
      </ScrollShadow>
      )}
    </CardShell>
  )
}

function NegotiationThread({ campaign }: { campaign: Campaign }) {
  const deal = PIPELINE_DEALS.find((item) => item.campaignId === campaign.id)
  if (!deal) return null

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 p-5 lg:p-6">
        {deal.messages.map((message, index) => {
          const isYou = message.from === "You"
          if (isYou) {
            return (
              <div key={index} className="mb-6 flex justify-end">
                <div className="max-w-[85%] rounded-2xl bg-[#f4f4f5] px-4 py-3 dark:bg-[#1a1a1a]">
                  <p className="text-[13.5px] leading-relaxed text-[#0a0a0a] dark:text-white">{message.text}</p>
                </div>
              </div>
            )
          }

          return (
            <div key={index} className="mb-6 flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-[#0a0a0a] dark:bg-[#222] dark:text-white">
                {campaign.brand.substring(0, 2).toUpperCase()}
              </div>
              <div className="max-w-[85%] rounded-2xl bg-[#e4e4e7] px-4 py-3 dark:bg-[#27272a]">
                <p className="text-[13.5px] leading-relaxed text-[#0a0a0a] dark:text-white">{message.text}</p>
                {message.total && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2 dark:bg-[#111111]">
                    <span className="text-[12px] font-semibold text-gray-500">Proposed total</span>
                    <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">{message.total}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-[#e4e4e7] bg-white p-4 dark:border-white/[0.06] dark:bg-transparent">
        <div className="flex items-center gap-2 rounded-[14px] border border-[#e4e4e7] bg-[#f4f4f5] px-3 py-2 focus-within:border-gray-300 focus-within:bg-white dark:border-[#27272a] dark:bg-[#111111] dark:focus-within:border-white/20">
          <input placeholder="Type a message..." className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-[14px] outline-none dark:text-white" />
          <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0a0a0a] text-white hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a] dark:hover:bg-gray-200">
            <ArrowUp className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ProjectWorkspace({ campaign }: { campaign: Campaign }) {
  const [isBriefOpen, setIsBriefOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  const handleUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsUploading(false)
          toast.success("Content uploaded successfully")
        }, 500)
      }
    }, 200)
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 lg:p-6 border-b border-[#efefef] dark:border-[#27272a]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">Workspace</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => toast.info(`Opening chat with ${campaign.brand}`)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[13px] font-semibold text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Message Brand
            </button>
          </div>
        </div>

        {/* Collapsible Brief */}
        <div className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden">
          <button
            onClick={() => setIsBriefOpen(!isBriefOpen)}
            className="w-full flex items-center justify-between p-3.5 bg-[#fafafa] dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Campaign Brief & Pitch</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform", isBriefOpen && "rotate-180")} />
          </button>
          
          <AnimatePresence>
            {isBriefOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-2 border-t border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                  <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    {campaign.brief.summary}
                  </p>
                  <div className="flex flex-col gap-1 mt-3">
                    <span className="text-[11px] font-bold uppercase text-gray-400">Your Pitch</span>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300 italic">
                      "I can show the product in a realistic city-day routine with texture closeups, outdoor movement, and a clear callout around reapplication."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-5 lg:p-6 flex flex-col gap-6 flex-1">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Deliverables to Upload</h3>
            <span className="text-[12px] font-semibold text-[#0060ff] bg-[#0060ff]/10 px-2 py-0.5 rounded-full">In Progress</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2.5">
            {campaign.deliverables.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#e4e4e7] dark:border-[#27272a] flex items-center justify-center shrink-0" />
                  <span className="text-[13.5px] font-semibold text-[#0a0a0a] dark:text-white">{item}</span>
                </div>
                <button onClick={handleUpload} className="text-[12px] font-bold text-gray-500 hover:text-[#0a0a0a] dark:hover:text-white transition">
                  Upload file
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2">
          <div 
            className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition cursor-pointer relative overflow-hidden"
            onClick={handleUpload}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
                <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">Uploading {uploadProgress}%</span>
                <div className="h-1.5 w-full bg-[#e4e4e7] dark:bg-[#27272a] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0060ff] rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-3" />
                <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white text-center">Batch upload deliverables</span>
                <span className="text-[12px] text-gray-500 text-center mt-1">Drag and drop or click to browse</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectTimeline({ deal }: { deal: PipelineDeal }) {
  return (
    <div className="flex flex-col h-full overflow-hidden p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-8">
        <KanbanSquare className="w-5 h-5 text-[#a1a1aa]" />
        <h2 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Project Timeline</h2>
      </div>

      <div className="relative pl-10 space-y-8 mt-2">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-2 bottom-6 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />
        
        {/* Node 1: Accepted */}
        <div className="relative flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-emerald-500" />
          <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
            {deal.due}
          </span>
          <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-zinc-300 mt-1">
            Bid Accepted. Workspace created.
          </span>
        </div>

        {/* Node 2: Content (Active) */}
        <div className="relative flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-orange-500" />
          <span className="text-[12.5px] font-medium text-orange-500 leading-none">
            In Progress
          </span>
          <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-white mt-1">
            Submit deliverables for review
          </span>
        </div>

        {/* Node 3: Review */}
        <div className="relative flex flex-col gap-1.5 opacity-50">
          <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-[#e4e4e7] dark:border-[#52525b]" />
          <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
            Pending
          </span>
          <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-zinc-300 mt-1">
            Brand Review & Revisions
          </span>
        </div>

        {/* Node 4: Payout */}
        <div className="relative flex flex-col gap-1.5 opacity-50">
          <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10 border-[#e4e4e7] dark:border-[#52525b]" />
          <span className="text-[12.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
            Pending
          </span>
          <span className="text-[14.5px] font-medium text-[#0a0a0a] dark:text-zinc-300 mt-1">
            Final Approval & Payout
          </span>
        </div>
      </div>
    </div>
  )
}

function DealTimelineCard({ 
  deal, campaign, className,
  collapsible, isExpanded = true, onToggle
}: { 
  deal: PipelineDeal; campaign: Campaign; className?: string;
  collapsible?: boolean; isExpanded?: boolean; onToggle?: () => void;
}) {
  const router = useRouter()
  
  const stageActions: Record<DealStage, { label: string; icon: React.ReactNode; action: () => void; disabled?: boolean; color?: string }> = {
    bid: { label: "Awaiting brand review\u2026", icon: <Clock3 className="h-4 w-4" />, action: () => {}, disabled: true },
    negotiation: { label: "Message brand", icon: <MessageCircle className="h-4 w-4" />, action: () => router.push(`/messages?brand=${campaign.domain}`) },
    accepted: { label: "Review contract \u2192", icon: <FileText className="h-4 w-4" />, action: () => {} },
    contract: {
      label: deal.contract?.creatorSigned ? "Awaiting brand signature\u2026" : "Sign contract",
      icon: <Check className="h-4 w-4" />,
      action: () => {},
      disabled: deal.contract?.creatorSigned,
      color: deal.contract?.creatorSigned ? undefined : "#000000",
    },
    content: { label: "Go to workspace", icon: <Upload className="h-4 w-4" />, action: () => {} },
    revision: { label: "View revision notes", icon: <AlertCircle className="h-4 w-4" />, action: () => {} },
    posted: { label: "Submit post links", icon: <Link2 className="h-4 w-4" />, action: () => {} },
    tracking: { label: "Message brand", icon: <MessageCircle className="h-4 w-4" />, action: () => router.push(`/messages?brand=${campaign.domain}`) },
    completed: { label: "Download receipt", icon: <FileText className="h-4 w-4" />, action: () => toast.success("Receipt downloaded") },
  }
  
  const action = stageActions[deal.stage]

  return (
    <CardShell className={cn(
      "flex flex-col bg-white dark:bg-[#111111] border border-[#e4e4e7] dark:border-[#27272a] transition-all duration-300", 
      className,
      collapsible && !isExpanded ? "shrink-0" : "h-full flex-1"
    )}>
      {collapsible ? (
        <button 
          type="button"
          onClick={onToggle}
          className={cn("flex w-full items-center justify-between p-5 py-4 shrink-0 text-left", isExpanded && "border-b border-[#e4e4e7] dark:border-[#27272a]")}
        >
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-[#a1a1aa]" />
            <h2 className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">Timeline</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa]">{deal.total}</div>
            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", isExpanded && "rotate-180")} />
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-2 p-5 shrink-0">
          <div className="flex items-center gap-2">
            <Clock3 className="w-4 h-4 text-[#a1a1aa]" />
            <h2 className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">Timeline</h2>
          </div>
          <div className="text-[12px] font-semibold text-[#737373] dark:text-[#a1a1aa]">{deal.total}</div>
        </div>
      )}
      
      {(!collapsible || isExpanded) && (
        <>
          <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="relative pl-8 flex flex-col gap-7">
          <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />
          {deal.timeline.map((event, index) => (
            <div key={event.id} className={cn("relative flex flex-col gap-1", event.status === "pending" && "opacity-40")}>
              <div className={cn(
                "absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 z-10",
                event.status === "completed" ? "border-black dark:border-white bg-white dark:bg-[#111111]" :
                event.status === "active" ? "border-black dark:border-white bg-white dark:bg-[#111111]" :
                "border-[#d4d4d8] dark:border-[#52525b] bg-white dark:bg-[#111111]"
              )} />
              {event.timestamp && (
                <span className="text-[11.5px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">{event.timestamp}</span>
              )}
              <span className={cn(
                "text-[13.5px] font-medium leading-snug",
                event.status === "active" ? "text-[#0a0a0a] dark:text-white" : "text-[#0a0a0a] dark:text-zinc-300"
              )}>{event.label}</span>
              {event.note && (
                <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa] mt-0.5">{event.note}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
        <div className="p-5 pt-0 shrink-0">
          <button
            type="button"
            disabled={action.disabled}
            onClick={action.action}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-bold transition",
              action.disabled
                ? "border border-[#e4e4e7] dark:border-[#27272a] text-[#a1a1aa] cursor-not-allowed"
                : "bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:bg-black/90 dark:hover:bg-gray-200"
            )}
          >
            {action.icon}
            {action.label}
          </button>
        </div>
        </>
      )}
    </CardShell>
  )
}

function AcceptedView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  return (
    <div className="flex flex-col gap-6 p-5 lg:p-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CircleCheck className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="text-center">
          <h2 className="text-[22px] font-bold text-[#0a0a0a] dark:text-white">Your bid was accepted!</h2>
          <p className="mt-1.5 text-[14px] text-[#737373] dark:text-[#a1a1aa]">
            {campaign.brand} loved your pitch. Review and sign the contract to get started.
          </p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] divide-y divide-[#e4e4e7] dark:divide-[#27272a]">
        {[
          { label: "Total agreed", value: deal.total },
          { label: "Deliverables", value: campaign.deliverables.join(", ") },
          { label: "Content deadline", value: deal.due },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">{label}</span>
            <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContractView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  const router = useRouter()
  const [creatorSigned, setCreatorSigned] = useState(deal.contract?.creatorSigned ?? false)
  const [showConfirm, setShowConfirm] = useState(false)
  const docsAppUrl = process.env.NEXT_PUBLIC_CREONITY_DOCS_URL ?? "http://localhost:3001"
  const contract = deal.contract
  if (!contract) return null

  const handleSign = () => {
    setCreatorSigned(true)
    setShowConfirm(false)
    toast.success("Contract signed! Workspace is now unlocked.")
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start h-full">
        {/* Left Side */}
        <div className="w-full max-w-[340px] shrink-0 flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Contract</h2>
            <span className="text-[13px] font-medium text-[#a1a1aa] mt-0.5">Updated today at 10:45 AM</span>
          </div>
          
          <div className="w-full flex flex-col aspect-[1/1.414]">
            {/* Document Body */}
            <div className="flex-1 rounded-t-[24px] border border-[#e4e4e7] dark:border-[#27272a] border-b-0 bg-[#fafafa] dark:bg-[#111111]/80 w-full p-5 flex flex-col relative z-0 -mb-4">
              <div className="flex-1 flex flex-col items-center justify-center opacity-60">
                <FileSignature className="w-8 h-8 mb-3 text-[#a1a1aa]" />
                <span className="text-[14px] font-semibold text-gray-500 text-center">Contract_v2.pdf</span>
                <span className="text-[12px] text-gray-400 mt-1 text-center">Version 2 &middot; Updated today</span>
              </div>
            </div>
            
            {/* Action Button */}
            {false && showConfirm ? (
              <div className="rounded-[16px] border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-none relative z-10 w-full">
                <p className="text-[13px] text-[#0a0a0a] dark:text-white mb-3 font-medium text-center">
                  By clicking confirm, you agree to all terms.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setShowConfirm(false)} className="flex-1 h-11 rounded-lg border border-[#e4e4e7] dark:border-[#27272a] text-[14px] font-semibold text-[#737373] hover:text-[#0a0a0a] dark:hover:text-white transition">
                    Cancel
                  </button>
                  <button onClick={handleSign} className="flex-1 h-11 rounded-lg bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-bold hover:bg-black/90 dark:hover:bg-gray-200 transition">
                    Confirm &amp; Sign
                  </button>
                </div>
              </div>
            ) : !creatorSigned ? (
              <button
                onClick={() => {
                  const returnTo = `${window.location.origin}/campaign?tab=pipeline&campaign=${campaign.id}`
                  window.location.assign(`${docsAppUrl}/doc-nike-1?campaignId=${campaign.id}&returnTo=${encodeURIComponent(returnTo)}`)
                }}
                className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[15.5px] font-bold hover:opacity-90 transition-opacity shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-none relative z-10"
              >
                Open in Creonity Docs
              </button>
            ) : (
              <div className="flex h-[56px] w-full items-center justify-center gap-2 rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 text-[15.5px] font-bold text-emerald-600 dark:text-emerald-400 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] dark:shadow-none relative z-10">
                <Check className="h-5 w-5" />
                Contract Signed
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side: Contract Summary */}
        <div className="flex-1 flex flex-col gap-5">
          <h3 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Summary</h3>
          
          <div className="text-[13.5px] leading-relaxed text-[#404040] dark:text-[#a1a1aa] pr-4">
            <p className="mb-4">
              This contract serves as an agreement between <strong>{campaign.brand}</strong> and yourself for the <strong>{campaign.title}</strong> campaign. It officially grants the brand <strong>{contract.usageRights.toLowerCase()}</strong> over the content produced, strictly on a <strong>{contract.exclusivity.toLowerCase()}</strong> basis.
            </p>
            <p className="mb-4">
              As part of this collaboration, you are required to submit all finalized content by <strong>{contract.deadline}</strong>. To ensure everything aligns perfectly with the brand's vision, this agreement includes up to <strong>{contract.revisionRounds} rounds of revisions</strong>.
            </p>
            <p>
              The exact deliverables required for this campaign include: <strong>{contract.deliverables.map(d => d.name).join(", ")}</strong>. Upon completion and approval of all deliverables, you will receive a total payout of <strong>{contract.totalAmount}</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkspaceView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  const router = useRouter()
  const [isBriefOpen, setIsBriefOpen] = useState(false)
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(
    deal.contract?.deliverables ?? campaign.deliverables.map((d, i) => ({
      id: `d${i}`,
      name: d,
      type: (d.toLowerCase().includes("photo") || d.toLowerCase().includes("edit") ? "upload" : "post") as "upload" | "post",
      status: "pending" as const,
    }))
  )
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUpload = (id: string) => {
    setUploadingId(id)
    setUploadProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += 25
      setUploadProgress(p)
      if (p >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setDeliverables(prev => prev.map(d => d.id === id ? { ...d, status: "uploaded" as const } : d))
          setUploadingId(null)
          toast.success("Draft uploaded for review")
        }, 300)
      }
    }, 150)
  }

  const allUploadsDone = deliverables.filter(d => d.type === "upload").every(d => d.status === "uploaded" || d.status === "approved")

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 lg:p-6 border-b border-[#efefef] dark:border-[#27272a] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">Workspace</h2>
          <button
            onClick={() => router.push(`/messages?brand=${campaign.domain}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] text-[12.5px] font-semibold text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Message Brand
          </button>
        </div>
        {/* Collapsible Brief */}
        <div className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden">
          <button
            onClick={() => setIsBriefOpen(!isBriefOpen)}
            className="w-full flex items-center justify-between p-3 bg-[#fafafa] dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[12.5px] font-semibold text-[#0a0a0a] dark:text-white">Campaign Brief &amp; Your Pitch</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-500 transition-transform duration-200", isBriefOpen && "rotate-180")} />
          </button>
          <AnimatePresence>
            {isBriefOpen && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="p-4 border-t border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a]">
                  <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-relaxed">{campaign.brief.summary}</p>
                  <div className="mt-3 pt-3 border-t border-[#f4f4f5] dark:border-[#27272a]">
                    <span className="text-[11px] font-bold uppercase text-gray-400">Your Pitch</span>
                    <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400 italic">&ldquo;I can show the product in a realistic city-day routine with texture closeups, outdoor movement, and a clear callout around reapplication.&rdquo;</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col gap-5">
        {/* Deliverables */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Deliverables</h3>
            <span className="text-[11.5px] font-semibold text-[#0060ff] bg-[#0060ff]/10 px-2 py-0.5 rounded-full">In Progress</span>
          </div>
          <div className="flex flex-col gap-2">
            {deliverables.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] p-3.5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition",
                    item.status === "approved" || item.status === "posted" ? "border-emerald-500 bg-emerald-500" :
                    item.status === "uploaded" ? "border-[#0060ff] bg-[#0060ff]/10" :
                    "border-[#d4d4d8] dark:border-[#52525b]"
                  )}>
                    {(item.status === "approved" || item.status === "posted") && <Check className="w-2.5 h-2.5 text-white" />}
                    {item.status === "uploaded" && <div className="w-2 h-2 rounded-full bg-[#0060ff]" />}
                  </div>
                  <span className="text-[13.5px] font-semibold text-[#0a0a0a] dark:text-white flex-1">{item.name}</span>
                  <span className={cn(
                    "text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0",
                    item.type === "post"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                  )}>
                    {item.type === "post" ? "Post on Instagram" : "Upload to brand"}
                  </span>
                </div>
                
                {/* Action row */}
                {item.type === "upload" && item.status === "pending" && (
                  <div className="mt-3 pl-8">
                    {uploadingId === item.id ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-[#e4e4e7] dark:bg-[#27272a] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0060ff] rounded-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="text-[12px] text-[#0060ff] font-semibold shrink-0">{uploadProgress}%</span>
                      </div>
                    ) : (
                      <button onClick={() => handleUpload(item.id)} className="text-[12.5px] font-bold text-[#0060ff] hover:text-[#0050dd] transition">
                        Upload draft &rarr;
                      </button>
                    )}
                  </div>
                )}
                {item.type === "upload" && item.status === "uploaded" && (
                  <div className="mt-2 pl-8 flex items-center gap-2">
                    <span className="text-[12.5px] text-emerald-600 dark:text-emerald-400 font-semibold">Uploaded ✓ — Awaiting brand review</span>
                  </div>
                )}
                {item.type === "post" && (
                  <div className="mt-2 pl-8">
                    <p className="text-[12px] text-[#a1a1aa]">Post on your Instagram account once approved, then submit the link</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Batch upload zone */}
        {deliverables.some(d => d.type === "upload" && d.status === "pending") && (
          <div
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition cursor-pointer"
            onClick={() => {
              const firstPending = deliverables.find(d => d.type === "upload" && d.status === "pending")
              if (firstPending) handleUpload(firstPending.id)
            }}
          >
            <Upload className="w-5 h-5 text-gray-400 mb-2" />
            <span className="text-[13.5px] font-bold text-[#0a0a0a] dark:text-white">Batch upload</span>
            <span className="text-[12px] text-gray-500 mt-0.5">Drag and drop or click to browse</span>
          </div>
        )}
        
        {/* Submit for review */}
        {allUploadsDone && (
          <button
            onClick={() => toast.success("Submitted for brand review!")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-bold hover:bg-black/80 dark:hover:bg-gray-200 transition"
          >
            <Check className="h-4 w-4" />
            Submit for brand review
          </button>
        )}
      </div>
    </div>
  )
}

function RevisionView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  const router = useRouter()
  const deliverables = deal.contract?.deliverables ?? []
  const revisionItems = deliverables.filter(d => d.status === "revision")

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-5 lg:p-6 border-b border-[#e4e4e7] dark:border-[#27272a] shrink-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          <h2 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Revisions Requested</h2>
        </div>
        <button onClick={() => router.push(`/messages?brand=${campaign.domain}`)} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition">
          <MessageCircle className="h-3.5 w-3.5" />
          Message Brand
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col gap-4">
        {(revisionItems.length === 0 ? deliverables : revisionItems).map((d) => (
          <div key={d.id} className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13.5px] font-semibold text-[#0a0a0a] dark:text-white">{d.name}</span>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-500/15 dark:text-orange-400 px-2 py-0.5 rounded-full">Needs revision</span>
            </div>
            <div className="rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 p-3">
              <p className="text-[12.5px] text-amber-900 dark:text-amber-300 leading-relaxed">&ldquo;{d.revisionNote ?? "Please adjust the lighting and trim the intro to under 5 seconds. The product should appear in the first 3 seconds."}&rdquo;</p>
            </div>
            <button onClick={() => toast.info("Re-upload your revised content")} className="mt-3 text-[12.5px] font-bold text-[#0060ff] hover:text-[#0050dd] transition">Re-upload &rarr;</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PostingView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  const router = useRouter()
  const [postUrls, setPostUrls] = useState<Record<string, string>>({})
  const deliverables = deal.contract?.deliverables ?? []
  const postDeliverables = deliverables.filter(d => d.type === "post")
  const allPosted = postDeliverables.every(d => postUrls[d.id] || d.postUrl)

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-5 lg:p-6 border-b border-[#e4e4e7] dark:border-[#27272a] shrink-0">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-[#a1a1aa]" />
          <h2 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Go Live</h2>
        </div>
        <button onClick={() => router.push(`/messages?brand=${campaign.domain}`)} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#737373] dark:text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition">
          <MessageCircle className="h-3.5 w-3.5" />
          Message Brand
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col gap-4">
        <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">Content approved! Post these on your Instagram account and submit the links below.</p>
        {postDeliverables.map((d) => {
          const url = postUrls[d.id] || d.postUrl || ""
          const posted = !!url
          return (
            <div key={d.id} className="rounded-xl border border-[#e4e4e7] dark:border-[#27272a] bg-white dark:bg-[#111111] p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", posted ? "border-emerald-500 bg-emerald-500" : "border-[#d4d4d8] dark:border-[#52525b]")}>
                  {posted && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-[13.5px] font-semibold text-[#0a0a0a] dark:text-white">{d.name}</span>
                {posted && <span className="ml-auto text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Posted ✓</span>}
              </div>
              <input
                value={url}
                onChange={(e) => setPostUrls(prev => ({ ...prev, [d.id]: e.target.value }))}
                placeholder="Paste your Instagram post URL here\u2026"
                className="w-full h-10 rounded-lg border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#111111] px-3 text-[13px] outline-none focus:border-[#0060ff] transition dark:text-white"
              />
            </div>
          )
        })}
        {allPosted && (
          <button
            onClick={() => toast.success("All links submitted! Performance tracking has started.")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] text-[14px] font-bold hover:bg-black/80 dark:hover:bg-gray-200 transition"
          >
            <TrendingUp className="h-4 w-4" />
            Confirm all posted &mdash; start tracking
          </button>
        )}
      </div>
    </div>
  )
}

function TrackingView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  const router = useRouter()
  const contract = deal.contract
  const [milestones, setMilestones] = useState<PaymentMilestone[]>(contract?.paymentMilestones ?? [])
  const [views, setViews] = useState(31400)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setViews(v => {
        const next = v + Math.floor(Math.random() * 800 + 200)
        setMilestones(prev => prev.map(m => {
          if (m.type === "performance" && m.targetViews) {
            const newStatus: PaymentMilestone["status"] = next >= m.targetViews ? "unlocked" : "locked"
            return { ...m, currentViews: next, status: newStatus }
          }
          return m
        }))
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between p-6 pb-2 shrink-0">
        <h2 className="text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Performance Tracking</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pt-2 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Stats row */}
        <div className="flex flex-col gap-4 lg:w-[260px] xl:w-[300px] shrink-0">
          {[
            { 
              label: "Total Views", 
              value: views.toLocaleString(), 
              trend: "+1.2K today",
              chartColor: "#0ea5e9",
              data: Array.from({ length: 14 }, (_, i) => ({ value: 50 + i * 15 + Math.random() * 30 }))
            },
            { 
              label: "Engagement", 
              value: "4.8%", 
              trend: "+0.3%",
              chartColor: "#e1306c",
              data: Array.from({ length: 14 }, (_, i) => ({ value: 4 + Math.random() * 2 }))
            },
            { 
              label: "Days Live", 
              value: "4", 
              trend: "",
              chartColor: "#10b981",
              data: Array.from({ length: 14 }, (_, i) => ({ value: i > 9 ? 1 : 0 }))
            },
          ].map(({ label, value, trend, chartColor, data }, i) => (
            <div key={label} className="rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111] p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col justify-between overflow-hidden relative">
              <div className="flex items-start justify-between relative z-10">
                <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa] uppercase tracking-wider">{label}</span>
                {trend && <span className="text-[12px] text-emerald-500 font-semibold">{trend}</span>}
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 relative z-10">
                <p className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white leading-none">{value}</p>
                <div className="h-[40px] w-[90px] -mr-2 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={`chart-gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2} fill={`url(#chart-gradient-${i})`} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Payment Milestones */}
        <div className="flex flex-col gap-5 flex-1">
          <h3 className="text-[16px] font-bold text-[#0a0a0a] dark:text-white tracking-tight">Payment Milestones</h3>
          <div className="flex flex-col gap-4">
            {milestones.map((m) => {
              const progress = m.type === "performance" && m.targetViews ? Math.min(100, (views / m.targetViews) * 100) : 100
              return (
                <div key={m.id} className="group rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#111111] p-5 shadow-sm transition-all hover:shadow-md hover:border-[#e4e4e7] dark:hover:border-[#3f3f46]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        m.status === "released" ? "bg-emerald-500" :
                        m.status === "unlocked" ? "bg-orange-500" :
                        "bg-[#d4d4d8] dark:bg-[#3f3f46]"
                      )} />
                      <span className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">{m.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">{m.amount}</span>
                      <span className={cn(
                        "text-[12px] font-bold px-3 py-1 rounded-lg tracking-wide",
                        m.status === "released" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                        m.status === "unlocked" ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" :
                        "bg-[#f4f4f5] text-[#737373] dark:bg-[#27272a] dark:text-[#a1a1aa]"
                      )}>
                        {m.status === "released" ? "Released" : m.status === "unlocked" ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                  </div>
                  {m.type === "performance" && m.targetViews && (
                    <div className="mt-1">
                      <div className="flex justify-between text-[12px] font-medium text-[#a1a1aa] mb-2.5">
                        <span><strong className="text-[#0a0a0a] dark:text-white">{views.toLocaleString()}</strong> views</span>
                        <span>{m.targetViews.toLocaleString()} target</span>
                      </div>
                      <div className="h-2 w-full bg-[#f4f4f5] dark:bg-[#27272a] rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-1000", progress >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-indigo-500")}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompletedView({ deal, campaign }: { deal: PipelineDeal; campaign: Campaign }) {
  const contract = deal.contract
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center gap-2 p-5 lg:p-6 border-b border-[#e4e4e7] dark:border-[#27272a] shrink-0">
        <Trophy className="h-5 w-5 text-[#a1a1aa]" />
        <h2 className="text-[17px] font-bold text-[#0a0a0a] dark:text-white">Campaign Complete</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5 lg:p-6 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
            <Trophy className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="text-center">
            <h3 className="text-[18px] font-bold text-[#0a0a0a] dark:text-white">All done!</h3>
            <p className="mt-1 text-[13px] text-[#737373] dark:text-[#a1a1aa]">Campaign delivered and payment released to your account.</p>
          </div>
        </div>
        {/* Receipt */}
        <div className="rounded-2xl border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden">
          <div className="bg-[#fafafa] dark:bg-[#111111] px-4 py-3 border-b border-[#e4e4e7] dark:border-[#27272a]">
            <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">Payment Receipt</span>
          </div>
          <div className="divide-y divide-[#e4e4e7] dark:divide-[#27272a]">
            {contract?.paymentMilestones.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-4 py-3">
                <span className="text-[13px] text-[#737373] dark:text-[#a1a1aa]">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#0a0a0a] dark:text-white">{m.amount}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Released ✓</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-[#fafafa] dark:bg-[#111111]">
              <span className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Total</span>
              <span className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">{deal.total}</span>
            </div>
          </div>
        </div>
        <button onClick={() => toast.success("Receipt downloaded")} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] text-[13px] font-bold text-[#0a0a0a] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition">
          <FileText className="h-4 w-4" />
          Download receipt
        </button>
      </div>
    </div>
  )
}

function CampaignDetail({
  campaign,
  campaigns,
  onBack,
  onOpen,
  onToggleSave,
}: {
  campaign: Campaign
  campaigns: Campaign[]
  onBack: () => void
  onOpen: (campaign: Campaign) => void
  onToggleSave: () => void
}) {
  const brandColors = useBrandColor(campaign.domain)
  const deal = PIPELINE_DEALS.find((item) => item.campaignId === campaign.id)
  const hasDeal = !!deal
  const isContentStage = hasDeal && deal?.stage !== "bid" && deal?.stage !== "negotiation"
  const [isApplyingMobile, setIsApplyingMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedRightCard, setExpandedRightCard] = useState<"timeline" | "bid">("timeline")

  const getStageView = () => {
    if (!deal) return null
    switch (deal.stage) {
      case "bid": return null
      case "negotiation": return null
      case "accepted": return <AcceptedView deal={deal} campaign={campaign} />
      case "contract": return <ContractView deal={deal} campaign={campaign} />
      case "content": return <WorkspaceView deal={deal} campaign={campaign} />
      case "revision": return <RevisionView deal={deal} campaign={campaign} />
      case "posted": return <PostingView deal={deal} campaign={campaign} />
      case "tracking": return <TrackingView deal={deal} campaign={campaign} />
      case "completed": return <CompletedView deal={deal} campaign={campaign} />
      default: return <AcceptedView deal={deal} campaign={campaign} />
    }
  }

  return (
    <div className="flex flex-1 flex-col pb-2 xl:min-h-0">
      {/* Back button */}
      <button
        type="button"
        onClick={() => {
          if (isApplyingMobile) setIsApplyingMobile(false)
          else onBack()
        }}
        className="mb-5 flex w-fit items-center gap-2 text-[15px] font-semibold text-gray-400 transition hover:text-[#0a0a0a] dark:hover:text-white"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="hidden xl:inline">Back to campaigns</span>
        <span className="xl:hidden">{isApplyingMobile ? "Back to details" : "Back to campaigns"}</span>
      </button>

      <div className="grid flex-1 grid-cols-1 gap-5 xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left column — stacked cards */}
        <div className={cn("flex flex-col xl:min-h-0", isApplyingMobile && "hidden xl:flex")}>

          {/* ── Hero header card ── */}
          <CardShell
            className="relative z-10 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            style={brandColors ? {
              backgroundImage: `linear-gradient(135deg, ${brandColors.bg} 0%, transparent 100%)`,
              borderColor: brandColors.border,
            } : {}}
          >
            <div className="p-5 lg:p-6">
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <Link href={`/brand/${campaign.brand.toLowerCase().replace(/\\s+/g, '')}`} className="flex min-w-0 items-center gap-4 hover:opacity-80 transition-opacity">
                  {/* Large brand mark */}
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#efefef] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-[#27272a] dark:bg-[#111111]">
                    <BrandLogo domain={campaign.domain} name={campaign.brand} className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[15px] font-bold text-[#0a0a0a] dark:text-white">{campaign.brand}</p>
                      <span className="text-gray-300 dark:text-gray-600">·</span>
                      <p className="text-[13px] font-medium text-gray-500">{campaign.niche}</p>
                      <StatusBadge status={campaign.status} />
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-gray-400">{campaign.location}</p>
                  </div>
                </Link>
                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSave()
                      toast.success(campaign.saved ? "Campaign removed from saved" : "Campaign saved")
                    }}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl border transition",
                      campaign.saved
                        ? "border-[#0060ff] bg-[#0060ff]/5 text-[#0060ff] dark:border-[#4d90fe] dark:bg-[#4d90fe]/10 dark:text-[#4d90fe]"
                        : "border-[#e4e4e7] bg-white text-gray-500 hover:border-gray-300 hover:text-[#0a0a0a] dark:border-white/10 dark:bg-[#111111] dark:hover:text-white"
                    )}
                  >
                    {campaign.saved ? <BookmarkFill className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </button>
                  {/* Three-dot menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e4e7] bg-white text-gray-500 transition hover:border-gray-300 hover:text-[#0a0a0a] dark:border-white/10 dark:bg-[#111111] dark:hover:text-white"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[#e4e4e7] bg-white p-1 shadow-lg dark:border-[#27272a] dark:bg-[#111111]">
                          {[
                            { icon: Send, label: "Share campaign link", action: () => { toast.success("Link copied to clipboard"); setIsMenuOpen(false) } },
                            { icon: Users, label: "View brand profile", action: () => { toast.info("Opening brand profile"); setIsMenuOpen(false) } },
                            { icon: Flag, label: "Report campaign", action: () => { toast.error("Report submitted"); setIsMenuOpen(false) }, danger: true },
                          ].map(({ icon: Icon, label, action, danger }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={action}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors text-left",
                                danger
                                  ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                                  : "text-[#0a0a0a] hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0 opacity-60" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title + description */}
              <h1 className="mt-6 text-[26px] font-bold leading-tight tracking-tight text-[#0a0a0a] dark:text-white lg:text-[30px]">
                {campaign.title}
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-gray-500 dark:text-white/60">
                {campaign.description}
              </p>

              {/* Metric row */}
              <div className="mt-8 flex flex-wrap items-start gap-8 lg:gap-12">
                {[
                  { label: "Budget", value: campaign.budget },
                  { label: "Apply by", value: campaign.daysLeft ? `${campaign.daysLeft} days` : "Filled" },
                  ...(!campaign.invited ? [{ label: "Bids", value: `${campaign.bids} creators` }] : []),
                  { label: "Content due", value: campaign.dueDate },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                    </div>
                    <p className="flex h-7 items-center text-[15px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">{value}</p>
                  </div>
                ))}
                
                {/* Deliverables */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="text-[11px] font-semibold uppercase tracking-wide">Deliverables</span>
                  </div>
                  <p className="flex h-7 items-center text-[15px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">
                    {campaign.deliverables.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </CardShell>

          {/* ── Unified content card ── */}
          <CardShell className="relative z-0 -mt-6 flex flex-1 flex-col overflow-hidden rounded-t-none pt-11 shadow-sm xl:min-h-0">
            <ScrollShadow hideScrollBar className="flex-1 xl:min-h-0">
                <>
                  {/* Brief */}
                  <div className="p-5 lg:p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <h2 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Brief</h2>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-300">{campaign.brief.summary}</p>
                    <button
                      type="button"
                      className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-[12.5px] font-bold text-[#0a0a0a] transition hover:bg-gray-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.07]"
                    >
                      <FileText className="h-3.5 w-3.5 text-gray-400" />
                      {campaign.brief.asset}
                    </button>
                  </div>

                  {/* Eligibility */}
                  <div className="p-5 lg:p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-gray-400" />
                      <h2 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Eligibility</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-y-2.5 sm:grid-cols-2">
                      {campaign.eligibility.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage rights */}
                  <div className="p-5 lg:p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-gray-400" />
                      <h2 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">Usage rights &amp; terms</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-[#0a0a0a] dark:text-white">Included:</span> {campaign.rights.included}
                      </p>
                      <p className="text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-300">
                        <span className="font-semibold text-[#0a0a0a] dark:text-white">Extra:</span> {campaign.rights.paid}
                      </p>
                    </div>
                  </div>

                  {/* Brand Info */}
                  <div className="p-5 lg:p-6 pb-20">
                    <div className="mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <h2 className="text-[14px] font-bold text-[#0a0a0a] dark:text-white">About the brand</h2>
                    </div>
                    <p className="text-[13.5px] leading-relaxed text-gray-600 dark:text-gray-300">
                      {campaign.brand} creates high-quality products for modern consumers. We focus on sustainability, authentic stories, and engaging our audience through creative UGC content that feels natural and compelling.
                    </p>
                  </div>
                </>
            </ScrollShadow>
            
            {/* Mobile Apply Button */}
            {campaign.status !== "Filled" && campaign.status !== "Closed" && (
              <div className="border-t border-gray-100 p-4 dark:border-white/[0.06] xl:hidden">
                <button
                  type="button"
                  onClick={() => setIsApplyingMobile(true)}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-[#0a0a0a] text-[15px] font-bold text-white transition hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a]"
                >
                  Apply for Campaign
                </button>
              </div>
            )}
          </CardShell>
        </div>

        {/* Right column — timeline for deals, bid form otherwise */}
        <div className={cn("min-w-0 h-full", !isApplyingMobile && "hidden xl:block")}>
          {hasDeal ? (
            <div className="flex h-full flex-col gap-5 overflow-hidden">
              <DealTimelineCard 
                deal={deal!} 
                campaign={campaign} 
                collapsible={deal.stage === "bid" || deal.stage === "negotiation"}
                isExpanded={expandedRightCard === "timeline" || (deal.stage !== "bid" && deal.stage !== "negotiation")}
                onToggle={() => setExpandedRightCard("timeline")}
              />
              {(deal.stage === "bid" || deal.stage === "negotiation") && (
                <BidForm 
                  campaign={campaign} 
                  readOnly={true} 
                  collapsible
                  isExpanded={expandedRightCard === "bid"}
                  onToggle={() => setExpandedRightCard("bid")}
                />
              )}
            </div>
          ) : campaign.status === "Filled" || campaign.status === "Closed" ? (
            <CardShell className="p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <Flag className="h-5 w-5 text-rose-500" />
              </div>
              <h2 className="text-[16px] font-bold text-[#0a0a0a] dark:text-white">No longer accepting bids</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
                This campaign stays visible so you don&apos;t lose context. Save it to get notified if a similar opportunity opens.
              </p>
              <button
                type="button"
                onClick={() => toast.success("Campaign saved")}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e4e4e7] bg-white text-[13px] font-bold text-[#0a0a0a] transition hover:bg-gray-50 dark:border-white/10 dark:bg-[#111111] dark:text-white"
              >
                <Bookmark className="h-4 w-4" />
                Save campaign
              </button>
            </CardShell>
          ) : campaign.invited ? (
            <InvitationResponseForm campaign={campaign} />
          ) : (
            <BidForm campaign={campaign} />
          )}
        </div>
      </div>
    </div>
  )
}

function InvitationResponseForm({ campaign }: { campaign: Campaign }) {
  const [decision, setDecision] = useState<"accept" | "decline" | null>(null)
  const [proposedRate, setProposedRate] = useState(campaign.budget.split(" - ")[1] ?? campaign.budget)
  const [message, setMessage] = useState("")
  const [availability, setAvailability] = useState("2026-07-23")

  const inputCls = "h-12 w-full rounded-[14px] border border-[#e2e8f0] bg-white px-4 text-[14px] text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
  const labelCls = "mb-2 block text-[13.5px] font-medium text-[#334155] dark:text-gray-300"

  return (
    <CardShell className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4">
        <div className="mb-1 flex items-center gap-2">
          <LockKeyhole className="h-4 w-4 text-[#0060ff]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#0060ff]">Private Invite</span>
        </div>
        <h2 className="text-[18px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Respond to invite</h2>
        <p className="mt-1 text-[13px] text-gray-400">{campaign.brand} selected you directly for this campaign.</p>
      </div>

      <ScrollShadow hideScrollBar className="flex flex-1 flex-col gap-4 p-5 pt-0">
        {/* Accept / Decline toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDecision("accept")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-bold transition-all",
              decision === "accept"
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "border-[#e4e4e7] bg-white text-gray-500 hover:border-gray-300 dark:border-white/10 dark:bg-[#111111] dark:hover:border-white/20"
            )}
          >
            <Check className="h-4 w-4" />
            Accept
          </button>
          <button
            type="button"
            onClick={() => setDecision("decline")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-[13px] font-bold transition-all",
              decision === "decline"
                ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                : "border-[#e4e4e7] bg-white text-gray-500 hover:border-gray-300 dark:border-white/10 dark:bg-[#111111] dark:hover:border-white/20"
            )}
          >
            <X className="h-4 w-4" />
            Decline
          </button>
        </div>

        {decision === "accept" && (
          <>
            {/* Rate */}
            <div>
              <label className={labelCls}>Your rate</label>
              <div className="relative">
                <input
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. ₹3,500"
                />
              </div>
              <p className="mt-1.5 text-[12px] text-gray-400">Brand offered up to {campaign.budget.split(" - ")[1] ?? campaign.budget}</p>
            </div>

            {/* Availability */}
            <div>
              <label className={labelCls}>I can deliver by</label>
              <input type="date" value={availability} onChange={(e) => setAvailability(e.target.value)} className={inputCls} />
            </div>

            {/* Message */}
            <div>
              <label className={labelCls}>Message to brand <span className="text-gray-400">· optional</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself, share your angle, or ask a quick question..."
                className="min-h-[100px] w-full resize-none rounded-[14px] border border-[#e2e8f0] bg-white px-4 py-3 text-[14px] leading-relaxed text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
              />
            </div>

            {/* Portfolio */}
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-[#fafafa] text-[13px] font-semibold text-gray-500 transition hover:bg-gray-100 dark:border-white/15 dark:bg-white/[0.02] dark:text-gray-400 dark:hover:bg-white/[0.05]"
            >
              <Upload className="h-4 w-4" />
              Attach portfolio / media kit
            </button>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => toast.success("Response sent", { description: "Your acceptance has been sent to " + campaign.brand + "." })}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0a0a0a] text-[14px] font-bold text-white transition hover:bg-black/80 dark:bg-white dark:text-[#0a0a0a]"
              >
                <Send className="h-4 w-4" />
                Send acceptance
              </button>
            </div>
          </>
        )}

        {decision === "decline" && (
          <>
            <div>
              <label className={labelCls}>Reason <span className="text-gray-400">· optional</span></label>
              <textarea
                placeholder="Let the brand know why you're declining (scheduling, rate, brand fit...)."
                className="min-h-[90px] w-full resize-none rounded-[14px] border border-[#e2e8f0] bg-white px-4 py-3 text-[14px] leading-relaxed text-[#0a0a0a] outline-none transition focus:border-[#0060ff] focus:ring-2 focus:ring-[#0060ff]/10 dark:border-white/10 dark:bg-[#111111] dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={() => toast.info("Invitation declined", { description: "Your response has been sent to " + campaign.brand + "." })}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 text-[14px] font-bold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
            >
              <X className="h-4 w-4" />
              Confirm decline
            </button>
          </>
        )}

        {decision === null && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0060ff]/10">
              <LockKeyhole className="h-5 w-5 text-[#0060ff]" />
            </div>
            <p className="text-[13px] text-gray-400 max-w-[200px]">
              Accept to propose your rate and start the conversation with {campaign.brand}.
            </p>
          </div>
        )}
      </ScrollShadow>
    </CardShell>
  )
}

function CampaignFilterPanel({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [selectedSkills, setSelectedSkills] = useState(["beauty", "fashion"])
  const [selectedPlatforms, setSelectedPlatforms] = useState(["instagram", "tiktok"])
  const [selectedTypes, setSelectedTypes] = useState(["sponsored"])

  const innerContent = (
    <div className="flex flex-col gap-6 p-4 h-auto max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col gap-4">
        <Slider
          className="w-full"
          defaultValue={[100, 5000]}
          formatOptions={{currency: "USD", style: "currency"}}
          maxValue={10000}
          minValue={0}
          step={100}
        >
          <Label className="font-semibold text-[14px] text-[#0a0a0a] dark:text-white mb-1">Budget Range</Label>
          <Slider.Output className="text-[13px] font-medium text-gray-500" />
          <Slider.Track className="bg-gray-200 dark:bg-white/10">
            {({state}) => (
              <>
                <Slider.Fill className="bg-[#0a0a0a] dark:bg-white" />
                {state.values.map((_, i) => (
                  <Slider.Thumb key={i} index={i} className="bg-white border border-[#e4e4e7] dark:bg-[#111111] dark:border-[#27272a] shadow-sm" />
                ))}
              </>
            )}
          </Slider.Track>
        </Slider>
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxGroup className="w-full" value={selectedSkills} onChange={setSelectedSkills}>
          <Label className="font-semibold text-[14px] text-[#0a0a0a] dark:text-white mb-1">Niche & Categories</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <Checkbox value="beauty">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Beauty & Skincare</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="fashion">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Fashion</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="tech">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Technology</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="fitness">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Fitness</span>
              </Checkbox.Content>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxGroup className="w-full" value={selectedPlatforms} onChange={setSelectedPlatforms}>
          <Label className="font-semibold text-[14px] text-[#0a0a0a] dark:text-white mb-1">Platforms</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <Checkbox value="instagram">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Instagram</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="tiktok">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">TikTok</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="youtube">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">YouTube</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="x">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">X (Twitter)</span>
              </Checkbox.Content>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxGroup className="w-full" value={selectedTypes} onChange={setSelectedTypes}>
          <Label className="font-semibold text-[14px] text-[#0a0a0a] dark:text-white mb-1">Campaign Type</Label>
          <div className="grid grid-cols-1 gap-3 mt-1">
            <Checkbox value="sponsored">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Sponsored Post</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="ugc">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">UGC (No posting)</span>
              </Checkbox.Content>
            </Checkbox>
            <Checkbox value="affiliate">
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator className="text-white" />
                </Checkbox.Control>
                <span className="text-[14px] text-gray-700 dark:text-gray-300">Affiliate / Commission</span>
              </Checkbox.Content>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Backdrop className="bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
        <Drawer.Content placement="bottom" className="!bottom-[65px]">
          <Drawer.Dialog className="bg-white dark:bg-[#0a0a0a] rounded-t-[20px] outline-none shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <Drawer.Handle className="mt-2 mb-1" />
            {innerContent}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>
    )
  }

  if (!isOpen) return null;

  return (
    <div className="shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.33333%-13.33333px)] xl:w-[calc(25%-15px)]">
      <div className="sticky top-6 flex h-[calc(100vh-180px)] flex-col rounded-[16px] border border-[#efefef] bg-white shadow-sm dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between h-[46px] px-5 shrink-0">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-[#737373] dark:text-gray-400">
            <Filter className="h-[18px] w-[18px]" />
            Filter
          </div>
          <button 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-1 pb-2">
          {innerContent}
        </div>
      </div>
    </div>
  )
}

function SavedCampaignCard({ campaign, onOpen }: { campaign: Campaign; onOpen: (campaign: Campaign) => void }) {
  return (
    <div 
      onClick={() => onOpen(campaign)}
      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <BrandMark campaign={campaign} />
        <div className="flex flex-col min-w-0">
          <span className="truncate text-[14px] font-bold text-[#0a0a0a] dark:text-white leading-tight">{campaign.title}</span>
          <span className="truncate text-[12px] text-gray-500">{campaign.brand}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0 ml-2 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
    </div>
  )
}

export function SavedCampaignsPanel({ isOpen, onOpenChange, campaigns, onOpen }: { isOpen: boolean; onOpenChange: (open: boolean) => void; campaigns: Campaign[]; onOpen: (campaign: Campaign) => void }) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const savedCampaigns = campaigns.filter(c => c.saved)

  const innerContent = (
    <div className="flex flex-col gap-2 p-3 pt-4 pb-24 h-full overflow-y-auto">
      {savedCampaigns.length > 0 ? (
        savedCampaigns.map((campaign) => (
          <SavedCampaignCard key={campaign.id} campaign={campaign} onOpen={onOpen} />
        ))
      ) : (
        <p className="text-[13px] text-gray-500 px-2">No saved campaigns yet.</p>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <Drawer.Backdrop className="bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
        <Drawer.Content placement="bottom" className="!bottom-[65px]">
          <Drawer.Dialog className="bg-white dark:bg-[#0a0a0a] rounded-t-[20px] outline-none shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            <Drawer.Handle className="mt-2 mb-1" />
            {innerContent}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>
    )
  }

  if (!isOpen) return null;

  return (
    <div className="shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.33333%-13.33333px)] xl:w-[calc(25%-15px)]">
      <div className="sticky top-6 flex h-[calc(100vh-180px)] flex-col rounded-[16px] border border-[#efefef] bg-white shadow-sm dark:border-[#27272a] dark:bg-[#111111] overflow-hidden">
        <div className="flex items-center justify-between h-[46px] px-5 shrink-0">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-[#737373] dark:text-gray-400">
            <Bookmark className="h-[18px] w-[18px]" />
            Saved
          </div>
          <button 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-1 pb-2">
          {innerContent}
        </div>
      </div>
    </div>
  )
}

export function CampaignApp() {
  const { isBrand } = useAccount()
  return isBrand ? <BrandCampaignApp /> : <CreatorCampaignApp />
}

function CreatorCampaignApp() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams?.get("tab") as CampaignTab) || "discover"
  const [activeTab, setActiveTab] = useState<CampaignTab>(initialTab)
  const [selectedFilter, setSelectedFilter] = useState("All")

  useEffect(() => {
    const tab = searchParams?.get("tab") as CampaignTab
    if (tab && ["discover", "pipeline", "invitations"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<"filter" | "saved" | null>(null)
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState([...CAMPAIGNS, ...INVITATION_CAMPAIGNS])

  const selectedCampaign = useMemo(() => campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? null, [campaigns, selectedCampaignId])
  const openCampaign = (campaign: Campaign) => {
    setSelectedCampaignId(campaign.id)
    window.history.pushState({ modal: "campaign" }, "")
  }

  const closeCampaign = () => {
    if (window.history.state?.modal === "campaign") {
      window.history.back()
    } else {
      setSelectedCampaignId(null)
    }
  }

  useEffect(() => {
    const handlePopState = () => {
      if (selectedCampaignId) {
        setSelectedCampaignId(null)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [selectedCampaignId])

  const toggleSave = (id: string) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, saved: !c.saved } : c)))
  }

  return (
    <div className={cn("flex h-full w-full flex-col bg-white dark:bg-[#0a0a0a]", selectedCampaign ? "overflow-y-auto xl:overflow-hidden" : "overflow-y-auto")}>
      <div className={cn("flex w-full flex-col px-3 md:px-6 pt-4 md:pt-6 lg:pt-8", selectedCampaign ? "flex-1 pb-4 xl:min-h-0" : "pb-12")}>
        {selectedCampaign ? (
          <CampaignDetail campaign={selectedCampaign} campaigns={campaigns} onBack={closeCampaign} onOpen={openCampaign} onToggleSave={() => toggleSave(selectedCampaign.id)} />
        ) : (
          <>
            <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <h1 className="text-[30px] font-bold leading-none tracking-tight text-[#0a0a0a] dark:text-white">Campaigns</h1>
              <CampaignTabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className="flex items-start gap-5">
              <div className="min-w-0 flex-1">
                {activeTab === "discover" && (
                  <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center">
                    <label className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition focus-within:border-gray-300 dark:border-white/10 dark:bg-[#0a0a0a] dark:focus-within:border-white/20">
                      <Search className="h-4 w-4 text-gray-400" />
                      <input placeholder="Search campaigns, brands, niches..." className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400 dark:text-white" />
                      <div className="hidden items-center gap-1 sm:flex">
                        <span className="flex h-5 items-center justify-center rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] font-semibold text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500">⌘</span>
                        <span className="flex h-5 items-center justify-center rounded border border-gray-200 bg-gray-50 px-1.5 text-[10px] font-semibold text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500">F</span>
                      </div>
                    </label>
                    {!activePanel && (
                      <div className="flex items-center gap-2 shrink-0 w-full md:w-[calc(50%-10px)] lg:w-[calc(33.33333%-13.33333px)] xl:w-[calc(25%-15px)]">
                        <button 
                          type="button" 
                          onClick={() => setSelectedFilter(selectedFilter === "Tech" ? "All" : "Tech")}
                          className={cn("flex flex-1 h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[12px] font-bold transition-all whitespace-nowrap", selectedFilter === "Tech" ? "bg-white border border-[#e4e4e7] dark:border-[#27272a] dark:bg-[#27272a] text-[#0a0a0a] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]" : "bg-[#f4f4f5] dark:bg-[#111111] border border-[#efefef] dark:border-[#27272a] text-[#737373] dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white")}
                        >
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          Niche
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setActivePanel(activePanel === "filter" ? null : "filter")}
                          className="flex flex-1 h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[12px] font-bold transition-all whitespace-nowrap bg-[#f4f4f5] dark:bg-[#111111] border border-[#efefef] dark:border-[#27272a] text-[#737373] dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white"
                        >
                          <Filter className="h-3.5 w-3.5 shrink-0" />
                          Filter
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setActivePanel(activePanel === "saved" ? null : "saved")}
                          className="flex flex-1 h-11 items-center justify-center gap-1.5 rounded-xl px-2 text-[12px] font-bold transition-all whitespace-nowrap bg-[#f4f4f5] dark:bg-[#111111] border border-[#efefef] dark:border-[#27272a] text-[#737373] dark:text-[#a1a1aa] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#0a0a0a] dark:hover:text-white"
                        >
                          <Bookmark className="h-3.5 w-3.5 shrink-0" />
                          Saved
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "discover" ? (
                  <DiscoverView campaigns={campaigns} selectedFilter={selectedFilter} isPanelOpen={!!activePanel} onFilter={setSelectedFilter} onOpen={openCampaign} />
                ) : activeTab === "pipeline" ? <PipelineView campaigns={campaigns} onOpen={openCampaign} /> : activeTab === "invitations" ? <InvitationsView onOpen={openCampaign} /> : null}
              </div>
              
              <CampaignFilterPanel isOpen={activePanel === "filter"} onOpenChange={(open) => setActivePanel(open ? "filter" : null)} />
              <SavedCampaignsPanel isOpen={activePanel === "saved"} onOpenChange={(open) => setActivePanel(open ? "saved" : null)} campaigns={campaigns} onOpen={openCampaign} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
