export type CampaignStatus = "Open" | "Closing Soon" | "Filled" | "Closed"

export type Campaign = {
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
}

export type CampaignPipelineDeal = {
  id: string
  campaignId: string
  stage: "bid" | "negotiation" | "content" | "approval" | "completed"
  total: string
  nextStep: string
  due: string
}

export const CAMPAIGNS: Campaign[] = [
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
    invited: true,
    description: "Introduce Apple Vision Pro as a unique tool for home workouts and fitness routines.",
    deliverables: ["1 Reel", "3 Stories", "1 Feed post"],
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
    invited: true,
    description: "Showcase the Nike Forward collection bridging street style and everyday comfort.",
    deliverables: ["1 Reel", "1 Carousel", "2 Stories"],
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
    invited: true,
    description: "Document a weekend retreat to a unique Airbnb property with honest narration.",
    deliverables: ["2 Reels", "4 Stories", "Usage cutdowns"],
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
    description: "Bridge outdoor utility and city styling across short-form video and stills.",
    deliverables: ["1 Reel", "5 edited photos", "3 Stories"],
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
    description: "A playful food delivery campaign built around late-night cravings.",
    deliverables: ["1 TikTok", "2 Stories"],
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
    description: "Build hype for Spotify Wrapped with listening habits and pop culture content.",
    deliverables: ["1 TikTok", "1 IG Reel"],
  },
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
    invited: true,
    exclusive: true,
    description: "A private get-ready-with-me invitation for selected beauty creators.",
    deliverables: ["1 Reel", "2 Stories", "1 TikTok"],
  },
  {
    id: "apple-macbook",
    brand: "Apple",
    domain: "apple.com",
    title: "MacBook Air student diaries",
    niche: "Tech",
    location: "United States",
    budget: "₹1.5K - ₹2.2K",
    daysLeft: 0,
    bids: 45,
    dueDate: "Jun 15",
    status: "Closed",
    match: 94,
    description: "Show how the M3 MacBook Air fits seamlessly into a busy college student's life.",
    deliverables: ["2 Reels", "1 TikTok"],
    eligibility: ["10K-100K followers", "College students"],
    rights: {
      included: "Organic usage.",
      paid: "Add-ons for paid ads.",
    },
    brief: {
      summary: "Highlight portability and battery life.",
      asset: "MacBook_Brief.pdf",
    },
    qna: [],
    similarIds: [],
  },
  {
    id: "nike-run",
    brand: "Nike",
    domain: "nike.com",
    title: "Summer running essentials",
    niche: "Fitness",
    location: "Global",
    budget: "₹3K - ₹5K",
    daysLeft: 0,
    bids: 88,
    dueDate: "May 20",
    status: "Filled",
    match: 89,
    description: "Showcase the new Dri-FIT ADV running collection during a summer marathon training session.",
    deliverables: ["1 Reel", "1 Carousel"],
    eligibility: ["50K+ followers", "Running niche"],
    rights: {
      included: "Organic usage.",
      paid: "Paid media whitelisting.",
    },
    brief: {
      summary: "Focus on breathability and motion.",
      asset: "Nike_Summer.pdf",
    },
    qna: [],
    similarIds: [],
  },
  {
    id: "ubereats-lunch",
    brand: "Uber Eats",
    domain: "ubereats.com",
    title: "Office lunch savior",
    niche: "Food",
    location: "New York, NY",
    budget: "₹1K - ₹1.8K",
    daysLeft: 0,
    bids: 24,
    dueDate: "Jul 01",
    status: "Closed",
    match: 85,
    description: "Show how Uber Eats saves the day when back-to-back meetings leave no time to grab lunch.",
    deliverables: ["1 Reel", "2 Stories"],
    eligibility: ["20K-100K followers", "Corporate/lifestyle niche"],
    rights: {
      included: "Organic usage.",
      paid: "None.",
    },
    brief: {
      summary: "Make it relatable to office workers.",
      asset: "UberEats_Office.pdf",
    },
    qna: [],
    similarIds: [],
  },
]

export const PIPELINE_DEALS: CampaignPipelineDeal[] = [
  {
    id: "deal-goodday",
    campaignId: "goodday-kit",
    stage: "bid",
    total: "₹2,150",
    due: "Aug 02",
    nextStep: "Waiting for brand review.",
  },
  {
    id: "deal-aura",
    campaignId: "aura-sun",
    stage: "negotiation",
    total: "₹3,450",
    due: "Jul 24",
    nextStep: "Brand countered usage rights. Reply by tomorrow.",
  },
  {
    id: "deal-loom",
    campaignId: "loom-home",
    stage: "contract",
    total: "₹4,800",
    due: "Aug 12",
    nextStep: "Sign the contract to unlock your workspace.",
  },
  {
    id: "deal-glossier",
    campaignId: "glossier-glow",
    stage: "content",
    total: "₹2,100",
    due: "Aug 08",
    nextStep: "Upload first draft for review.",
  },
  {
    id: "deal-northline",
    campaignId: "northline",
    stage: "tracking",
    total: "₹6,250",
    due: "Jul 29",
    nextStep: "Tracking performance.",
  },
]

export function getCardBudget(campaign: Campaign) {
  const maxBudget = campaign.budget.split(" - ")[1]
  return maxBudget ? `Up to ${maxBudget}` : campaign.budget
}
