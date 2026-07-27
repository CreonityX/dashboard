export type BrandAnalyticsPlatform = "Instagram" | "TikTok" | "YouTube"

export type BrandAnalyticsCampaign = {
  id: string
  name: string
  status: "Live" | "Planning" | "Completed"
  dates: string
  creatorIds: string[]
  deliverables: { completed: number; total: number }
  reach: number
  impressions: number
  engagements: number
  clicks: number
  conversions: number
  platformShare: Record<BrandAnalyticsPlatform, number>
  weeklyReach: number[]
}

export type BrandAnalyticsCreator = {
  id: string
  name: string
  handle: string
  avatarUrl: string
  campaignIds: string[]
  deliverables: { completed: number; total: number }
  reach: number
  impressions: number
  engagements: number
  clicks: number
  conversions: number
  attributedValue: number
  platformShare: Record<BrandAnalyticsPlatform, number>
}

export type BrandNativePlatformMetric = {
  id: string
  label: string
  value: number
  suffix?: "" | "%" | "h" | "m"
  change: number
}

export type BrandAnalyticsState = {
  campaigns: BrandAnalyticsCampaign[]
  creators: BrandAnalyticsCreator[]
  platformNativeMetrics: Record<BrandAnalyticsPlatform, BrandNativePlatformMetric[]>
}

export const brandAnalyticsSeed: BrandAnalyticsState = {
  campaigns: [
    {
      id: "camp_1", name: "Summer Collection Launch", status: "Live", dates: "Jul 8 – Aug 4", creatorIds: ["creator_1", "creator_2", "creator_3"], deliverables: { completed: 9, total: 12 }, reach: 428000, impressions: 612000, engagements: 29800, clicks: 9340, conversions: 476, platformShare: { Instagram: 48, TikTok: 37, YouTube: 15 }, weeklyReach: [42000, 57000, 65000, 71000, 68000, 59000, 66000]
    },
    {
      id: "camp_2", name: "Q3 Tech Review Series", status: "Live", dates: "Jul 15 – Sep 15", creatorIds: ["creator_2", "creator_4"], deliverables: { completed: 3, total: 8 }, reach: 186000, impressions: 251000, engagements: 14200, clicks: 6240, conversions: 219, platformShare: { Instagram: 18, TikTok: 21, YouTube: 61 }, weeklyReach: [18000, 24000, 33000, 29000, 31000, 24000, 27000]
    },
    {
      id: "camp_3", name: "Holiday Special", status: "Planning", dates: "Nov 1 – Dec 24", creatorIds: ["creator_1", "creator_3"], deliverables: { completed: 0, total: 10 }, reach: 0, impressions: 0, engagements: 0, clicks: 0, conversions: 0, platformShare: { Instagram: 45, TikTok: 40, YouTube: 15 }, weeklyReach: [0, 0, 0, 0, 0, 0, 0]
    }
  ],
  creators: [
    { id: "creator_1", name: "Alex Rivera", handle: "@alexcreates", avatarUrl: "https://i.pravatar.cc/160?img=12", campaignIds: ["camp_1", "camp_3"], deliverables: { completed: 4, total: 6 }, reach: 205000, impressions: 287000, engagements: 15400, clicks: 4010, conversions: 204, attributedValue: 54800, platformShare: { Instagram: 58, TikTok: 34, YouTube: 8 } },
    { id: "creator_2", name: "Sam Jenkins", handle: "@samreviewed", avatarUrl: "https://i.pravatar.cc/160?img=33", campaignIds: ["camp_1", "camp_2"], deliverables: { completed: 5, total: 7 }, reach: 231000, impressions: 339000, engagements: 17600, clicks: 7380, conversions: 315, attributedValue: 75600, platformShare: { Instagram: 26, TikTok: 20, YouTube: 54 } },
    { id: "creator_3", name: "Mia Patel", handle: "@miamakes", avatarUrl: "https://i.pravatar.cc/160?img=47", campaignIds: ["camp_1", "camp_3"], deliverables: { completed: 3, total: 5 }, reach: 178000, impressions: 236000, engagements: 11000, clicks: 2190, conversions: 118, attributedValue: 29600, platformShare: { Instagram: 35, TikTok: 59, YouTube: 6 } },
    { id: "creator_4", name: "Jordan Lee", handle: "@jordanexplains", avatarUrl: "https://i.pravatar.cc/160?img=68", campaignIds: ["camp_2"], deliverables: { completed: 2, total: 3 }, reach: 121000, impressions: 164000, engagements: 6600, clicks: 1980, conversions: 80, attributedValue: 21400, platformShare: { Instagram: 12, TikTok: 18, YouTube: 70 } }
  ],
  platformNativeMetrics: {
    Instagram: [
      { id: "profile_visits", label: "Profile visits", value: 18400, change: 16.8 },
      { id: "saves", label: "Saves", value: 7280, change: 11.2 },
      { id: "shares", label: "Shares", value: 3420, change: 18.5 },
      { id: "followers", label: "Follower growth", value: 1280, change: 9.4 },
    ],
    TikTok: [
      { id: "video_views", label: "Video views", value: 302000, change: 24.6 },
      { id: "shares", label: "Shares", value: 6190, change: 22.4 },
      { id: "average_view_duration", label: "Avg. watch time", value: 18.6, suffix: "m", change: 8.2 },
      { id: "profile_visits", label: "Profile visits", value: 14200, change: 14.7 },
    ],
    YouTube: [
      { id: "video_views", label: "Video views", value: 198000, change: 19.1 },
      { id: "watch_time", label: "Watch time", value: 4210, suffix: "h", change: 17.4 },
      { id: "average_view_duration", label: "Avg. view duration", value: 6.4, suffix: "m", change: 7.8 },
      { id: "subscribers", label: "Subscriber growth", value: 940, change: 6.9 },
    ],
  }
}

export const brandAnalyticsPlatforms: { id: BrandAnalyticsPlatform; color: string }[] = [
  { id: "Instagram", color: "#e1306c" },
  { id: "TikTok", color: "#14b8a6" },
  { id: "YouTube", color: "#ef4444" }
]

export function formatAnalyticsNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 ? 1 : 0)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 100000 ? 0 : 1)}K`
  return value.toLocaleString("en-IN")
}
