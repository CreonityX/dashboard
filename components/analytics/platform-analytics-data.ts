export type PlatformAnalyticsId = "ig" | "tt" | "yt"
export type AnalyticsTimeframe = "7d" | "30d" | "90d" | "all"

export type ChartPoint = { name: string; value: number }
export type ComparisonPoint = { name: string; reach: number; impressions: number; engagement: number }
export type RankedPoint = { name: string; value: number }

export interface PlatformMetric {
  id: string
  label: string
  value: number
  suffix?: string
  change: number
  series: ChartPoint[]
}

export interface PlatformAnalyticsData {
  platform: PlatformAnalyticsId
  platformName: string
  accent: string
  followerLabel: "Followers" | "Subscribers"
  overview: PlatformMetric[]
  engagement: PlatformMetric[]
  insights: string[]
  actionItem: string
  contentTypes: RankedPoint[]
  reachVsImpressions: ComparisonPoint[]
  bestTime: { day: string; time: string; note: string; series: ChartPoint[] }
  topContent: Array<{ title: string; type: string; reach: number }>
  audience: {
    gender: ChartPoint[]
    age: ChartPoint[]
    countries: { name: string; value: number; cities: { name: string; value: number }[] }[]
    cities: ChartPoint[]
  }
  youtube?: {
    averageViewDuration: string
    averageViewDurationChange: number
    watchTimeHours: number
    watchTimeChange: number
    retention: Array<{ elapsed: number; retention: number }>
  }
}

const timeframeMultiplier: Record<AnalyticsTimeframe, number> = {
  "7d": 1,
  "30d": 4.15,
  "90d": 11.9,
  all: 37.4,
}

const timeframePoints: Record<AnalyticsTimeframe, string[]> = {
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30d": ["W1", "W2", "W3", "W4"],
  "90d": ["Jan", "Feb", "Mar"],
  all: ["Q1", "Q2", "Q3", "Q4"],
}

const makeSeries = (base: number, platformOffset: number, timeframe: AnalyticsTimeframe): ChartPoint[] => {
  const labels = timeframePoints[timeframe]
  return labels.map((name, index) => ({
    name,
    value: Math.round(base * (0.76 + index * 0.075 + Math.sin(index + platformOffset) * 0.08)),
  }))
}

const metric = (
  id: string,
  label: string,
  base: number,
  change: number,
  platformOffset: number,
  timeframe: AnalyticsTimeframe,
  suffix = "",
  scale = true,
): PlatformMetric => {
  const multiplier = scale ? timeframeMultiplier[timeframe] : 1 + Math.log10(timeframeMultiplier[timeframe]) * 0.035
  return {
    id,
    label,
    value: Number((base * multiplier).toFixed(base < 10 ? 1 : 0)),
    suffix,
    change,
    series: makeSeries(base * (scale ? multiplier : 1), platformOffset, timeframe),
  }
}

const scaleComparison = (items: ComparisonPoint[], timeframe: AnalyticsTimeframe) =>
  items.map((item) => ({
    ...item,
    reach: Math.round(item.reach * timeframeMultiplier[timeframe]),
    impressions: Math.round(item.impressions * timeframeMultiplier[timeframe]),
  }))

const platformFixtures = {
  ig: {
    platformName: "Instagram",
    accent: "#e1306c",
    followerLabel: "Followers" as const,
    bases: { reach: 84200, followers: 12400, impressions: 124500, engagement: 4.8, likes: 11200, comments: 864, shares: 1210 },
    insights: [
      "Reels generated 61% of this period’s reach and are your strongest discovery format.",
      "Carousel posts earned 1.7× more saves than single-image posts.",
      "Posts published on Thursday evening converted the most profile visits into follows.",
    ],
    actionItem: "Publish the next Reel on Thursday between 5:30 PM and 6:30 PM.",
    contentTypes: [{ name: "Reels", value: 68 }, { name: "Carousels", value: 51 }, { name: "Images", value: 34 }, { name: "Stories", value: 27 }],
    comparison: [{ name: "Reels", reach: 42, impressions: 61, engagement: 25 }, { name: "Carousels", reach: 28, impressions: 39, engagement: 18 }, { name: "Images", reach: 18, impressions: 24, engagement: 11 }, { name: "Stories", reach: 12, impressions: 19, engagement: 8 }],
    bestTime: { day: "Thursday", time: "6 PM", note: "Peak follower activity", values: [24, 31, 38, 46, 63, 84, 71, 49] },
    topContent: [
      { title: "The 15-second studio reset", type: "Reel", reach: 38200 },
      { title: "From sketch to final identity", type: "Carousel", reach: 29100 },
      { title: "Three details that changed the layout", type: "Reel", reach: 23800 },
      { title: "A week inside the studio", type: "Carousel", reach: 17400 },
      { title: "Material study no. 04", type: "Image", reach: 12800 },
    ],
    audience: {
      gender: [{ name: "Women", value: 62 }, { name: "Men", value: 35 }, { name: "Other", value: 3 }],
      age: [{ name: "13-17", value: 4 }, { name: "18-21", value: 15 }, { name: "22-25", value: 28 }, { name: "26-29", value: 36 }, { name: "30-34", value: 24 }, { name: "35-39", value: 16 }, { name: "40-44", value: 9 }, { name: "45-49", value: 5 }, { name: "50-54", value: 3 }, { name: "55+", value: 1 }],
      countries: [
        { name: "United States", value: 38, cities: [{ name: "New York", value: 18 }, { name: "Los Angeles", value: 12 }, { name: "Chicago", value: 8 }] },
        { name: "United Kingdom", value: 17, cities: [{ name: "London", value: 9 }, { name: "Manchester", value: 5 }, { name: "Birmingham", value: 3 }] },
        { name: "India", value: 14, cities: [{ name: "Mumbai", value: 7 }, { name: "Delhi", value: 4 }, { name: "Bangalore", value: 3 }] },
        { name: "Canada", value: 9, cities: [{ name: "Toronto", value: 4 }, { name: "Vancouver", value: 3 }, { name: "Montreal", value: 2 }] },
        { name: "Germany", value: 7, cities: [{ name: "Berlin", value: 3 }, { name: "Munich", value: 2 }, { name: "Hamburg", value: 2 }] }
      ],
      cities: [{ name: "New York", value: 18 }, { name: "London", value: 13 }, { name: "Los Angeles", value: 11 }, { name: "Mumbai", value: 8 }, { name: "Toronto", value: 6 }],
    },
  },
  tt: {
    platformName: "TikTok",
    accent: "#06b6d4",
    followerLabel: "Followers" as const,
    bases: { reach: 126800, followers: 18700, impressions: 168400, engagement: 7.2, likes: 24800, comments: 1540, shares: 3610 },
    insights: [
      "Fast-cut tutorials under 20 seconds held viewers 24% longer than your account average.",
      "Search traffic is rising, with design-process keywords driving 18% of new viewers.",
      "Reply videos produce your highest comment-to-view ratio and repeat audience rate.",
    ],
    actionItem: "Turn the most-liked comment into a reply video before Friday afternoon.",
    contentTypes: [{ name: "Tutorials", value: 82 }, { name: "Process", value: 67 }, { name: "Replies", value: 55 }, { name: "Trends", value: 39 }],
    comparison: [{ name: "Tutorials", reach: 58, impressions: 76, engagement: 31 }, { name: "Process", reach: 44, impressions: 57, engagement: 22 }, { name: "Replies", reach: 31, impressions: 43, engagement: 18 }, { name: "Trends", reach: 24, impressions: 35, engagement: 12 }],
    bestTime: { day: "Friday", time: "8 PM", note: "Peak viewer activity", values: [19, 26, 35, 48, 59, 74, 91, 78] },
    topContent: [
      { title: "Fixing this logo in 20 seconds", type: "Tutorial", reach: 64100 },
      { title: "Why this grid finally works", type: "Process", reach: 48700 },
      { title: "Replying to your toughest brief", type: "Reply", reach: 39200 },
      { title: "One type trick I use every day", type: "Tutorial", reach: 31800 },
      { title: "Studio desk before and after", type: "Trend", reach: 24600 },
    ],
    audience: {
      gender: [{ name: "Women", value: 57 }, { name: "Men", value: 40 }, { name: "Other", value: 3 }],
      age: [{ name: "13-17", value: 12 }, { name: "18-21", value: 35 }, { name: "22-25", value: 29 }, { name: "26-29", value: 18 }, { name: "30-34", value: 11 }, { name: "35-39", value: 7 }, { name: "40-44", value: 4 }, { name: "45-49", value: 2 }, { name: "50-54", value: 1 }, { name: "55+", value: 1 }],
      countries: [
        { name: "United States", value: 34, cities: [{ name: "Los Angeles", value: 15 }, { name: "New York", value: 12 }, { name: "Chicago", value: 7 }] },
        { name: "India", value: 19, cities: [{ name: "Mumbai", value: 10 }, { name: "Delhi", value: 6 }, { name: "Bangalore", value: 3 }] },
        { name: "United Kingdom", value: 13, cities: [{ name: "London", value: 9 }, { name: "Manchester", value: 3 }, { name: "Birmingham", value: 1 }] },
        { name: "Australia", value: 8, cities: [{ name: "Sydney", value: 5 }, { name: "Melbourne", value: 2 }, { name: "Brisbane", value: 1 }] },
        { name: "Canada", value: 7, cities: [{ name: "Toronto", value: 4 }, { name: "Vancouver", value: 2 }, { name: "Montreal", value: 1 }] }
      ],
      cities: [{ name: "Los Angeles", value: 15 }, { name: "New York", value: 14 }, { name: "Mumbai", value: 10 }, { name: "London", value: 9 }, { name: "Sydney", value: 5 }],
    },
  },
  yt: {
    platformName: "YouTube",
    accent: "#ef4444",
    followerLabel: "Subscribers" as const,
    bases: { reach: 96300, followers: 28900, impressions: 242000, engagement: 5.6, likes: 14700, comments: 1260, shares: 2180 },
    insights: [
      "Design breakdowns keep 71% of viewers through the first minute, well above channel average.",
      "Videos between 8 and 12 minutes generate the strongest watch-time-to-impression return.",
      "Returning viewers are most responsive to thumbnail titles framed as a specific design problem.",
    ],
    actionItem: "Lead the next breakdown with the final result, then reveal the process within 20 seconds.",
    contentTypes: [{ name: "Breakdowns", value: 78 }, { name: "Tutorials", value: 64 }, { name: "Shorts", value: 59 }, { name: "Studio Vlogs", value: 36 }],
    comparison: [{ name: "Breakdowns", reach: 47, impressions: 116, engagement: 42 }, { name: "Tutorials", reach: 36, impressions: 89, engagement: 28 }, { name: "Shorts", reach: 41, impressions: 67, engagement: 31 }, { name: "Vlogs", reach: 19, impressions: 52, engagement: 15 }],
    bestTime: { day: "Sunday", time: "11 AM", note: "Peak subscriber activity", values: [29, 41, 57, 79, 88, 73, 54, 38] },
    topContent: [
      { title: "I redesigned a real startup in 10 hours", type: "Breakdown", reach: 52800 },
      { title: "The typography system I wish I learned sooner", type: "Tutorial", reach: 43600 },
      { title: "A complete brand identity in 60 seconds", type: "Short", reach: 38100 },
      { title: "Inside a client presentation that won", type: "Breakdown", reach: 29700 },
      { title: "A quiet week building the studio", type: "Studio Vlog", reach: 21300 },
    ],
    audience: {
      gender: [{ name: "Women", value: 43 }, { name: "Men", value: 54 }, { name: "Other", value: 3 }],
      age: [{ name: "13-17", value: 3 }, { name: "18-21", value: 11 }, { name: "22-25", value: 22 }, { name: "26-29", value: 28 }, { name: "30-34", value: 34 }, { name: "35-39", value: 18 }, { name: "40-44", value: 12 }, { name: "45-49", value: 7 }, { name: "50-54", value: 4 }, { name: "55+", value: 2 }],
      countries: [
        { name: "United States", value: 45, cities: [{ name: "Los Angeles", value: 20 }, { name: "New York", value: 15 }, { name: "Miami", value: 10 }] },
        { name: "United Kingdom", value: 20, cities: [{ name: "London", value: 10 }, { name: "Leeds", value: 6 }, { name: "Glasgow", value: 4 }] },
        { name: "Australia", value: 12, cities: [{ name: "Sydney", value: 6 }, { name: "Melbourne", value: 4 }, { name: "Brisbane", value: 2 }] },
        { name: "Canada", value: 11, cities: [{ name: "Toronto", value: 5 }, { name: "Vancouver", value: 4 }, { name: "Calgary", value: 2 }] },
        { name: "Philippines", value: 6, cities: [{ name: "Manila", value: 3 }, { name: "Cebu City", value: 2 }, { name: "Davao", value: 1 }] }
      ],
      cities: [{ name: "Los Angeles", value: 20 }, { name: "New York", value: 15 }, { name: "London", value: 10 }, { name: "Sydney", value: 6 }, { name: "Toronto", value: 5 }],
    },
  },
}

export function getPlatformAnalyticsData(platform: PlatformAnalyticsId, timeframe: AnalyticsTimeframe): PlatformAnalyticsData {
  const fixture = platformFixtures[platform]
  const offset = platform === "ig" ? 1 : platform === "tt" ? 3 : 5
  const b = fixture.bases
  const followerLabel = fixture.followerLabel

  const youtube = platform === "yt" ? {
    averageViewDuration: timeframe === "7d" ? "6m 42s" : timeframe === "30d" ? "6m 31s" : timeframe === "90d" ? "6m 18s" : "6m 08s",
    averageViewDurationChange: 8.4,
    watchTimeHours: Math.round(1840 * timeframeMultiplier[timeframe]),
    watchTimeChange: 16.7,
    retention: [
      { elapsed: "0:00", retention: 100 }, { elapsed: "0:30", retention: 85 }, { elapsed: "1:00", retention: 78 },
      { elapsed: "1:30", retention: 82 }, { elapsed: "2:00", retention: 70 }, { elapsed: "2:30", retention: 65 },
      { elapsed: "3:00", retention: 60 }, { elapsed: "3:30", retention: 88 }, { elapsed: "4:00", retention: 55 },
      { elapsed: "4:30", retention: 52 }, { elapsed: "5:00", retention: 65 }, { elapsed: "5:30", retention: 48 },
      { elapsed: "6:00", retention: 45 }, { elapsed: "6:30", retention: 60 }, { elapsed: "7:00", retention: 40 },
      { elapsed: "7:30", retention: 38 }, { elapsed: "8:00", retention: 35 }, { elapsed: "8:30", retention: 30 },
      { elapsed: "9:00", retention: 25 }, { elapsed: "9:30", retention: 20 }, { elapsed: "10:00", retention: 15 },
    ],
  } : undefined

  return {
    platform,
    platformName: fixture.platformName,
    accent: fixture.accent,
    followerLabel,
    overview: [
      metric("reach", "Total Reach", b.reach, platform === "tt" ? 24.6 : 18.5, offset, timeframe),
      metric("followers", followerLabel, b.followers, platform === "yt" ? 6.8 : 9.2, offset + 1, timeframe, "", false),
      metric("impressions", "Impressions", b.impressions, platform === "yt" ? 21.4 : 14.8, offset + 2, timeframe),
    ],
    engagement: [
      metric("engagement", "Engagement Rate", b.engagement, 1.2, offset, timeframe, "%", false),
      metric("likes", "Likes", b.likes, 17.4, offset + 1, timeframe),
      metric("comments", "Comments", b.comments, 11.8, offset + 2, timeframe),
      metric("shares", "Shares", b.shares, 22.1, offset + 3, timeframe),
    ],
    insights: fixture.insights,
    actionItem: fixture.actionItem,
    contentTypes: fixture.contentTypes,
    reachVsImpressions: scaleComparison(fixture.comparison, timeframe),
    bestTime: {
      day: fixture.bestTime.day,
      time: fixture.bestTime.time,
      note: fixture.bestTime.note,
      series: fixture.bestTime.values.map((value, index) => ({ name: `${index * 3}:00`, value })),
    },
    topContent: fixture.topContent.map((item) => ({ ...item, reach: Math.round(item.reach * timeframeMultiplier[timeframe]) })),
    audience: fixture.audience,
    youtube,
  }
}

export function getGlobalAnalyticsData(timeframe: AnalyticsTimeframe) {
  const ig = getPlatformAnalyticsData("ig", timeframe)
  const tt = getPlatformAnalyticsData("tt", timeframe)
  const yt = getPlatformAnalyticsData("yt", timeframe)
  
  // Aggregate Overview 
  const totalReach = ig.overview[0].value + tt.overview[0].value + yt.overview[0].value
  const totalFollowers = ig.overview[1].value + tt.overview[1].value + yt.overview[1].value
  const totalImpressions = ig.overview[2].value + tt.overview[2].value + yt.overview[2].value
  const avgER = Number(((ig.engagement[0].value + tt.engagement[0].value + yt.engagement[0].value) / 3).toFixed(1))

  // Aggregate Small Metrics
  const totalLikes = ig.engagement[1].value + tt.engagement[1].value + yt.engagement[1].value
  const totalComments = ig.engagement[2].value + tt.engagement[2].value + yt.engagement[2].value
  const totalShares = ig.engagement[3].value + tt.engagement[3].value + yt.engagement[3].value
  const totalSaves = Math.round(totalLikes * 0.15)
  const totalProfileVisits = Math.round(totalImpressions * 0.08)
  const totalMentions = Math.round(totalComments * 0.4)

  // Performance Charts Data
  const bestTimeData = Array.from({ length: 24 }).map((_, i) => {
    const time = i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`
    const baseEng = i >= 17 && i <= 21 ? 6 : i >= 10 && i <= 16 ? 4 : 1.5;
    const engagement = Math.max(1, baseEng + Math.sin(i * 1.7) * 0.85);
    return { time, engagement: Number(engagement.toFixed(1)) }
  })
  
  const platformShareData = [
    { name: 'Instagram', value: Math.round((ig.overview[0].value / totalReach) * 100), stops: [{o: '0%', c: '#f59e0b'}, {o: '50%', c: '#e1306c'}, {o: '100%', c: '#8b5cf6'}] },
    { name: 'TikTok', value: Math.round((tt.overview[0].value / totalReach) * 100), stops: [{o: '0%', c: '#06b6d4'}, {o: '100%', c: '#3b82f6'}] },
    { name: 'YouTube', value: Math.round((yt.overview[0].value / totalReach) * 100), stops: [{o: '0%', c: '#ef4444'}, {o: '100%', c: '#dc2626'}] },
  ]
  
  const remainder = 100 - platformShareData.reduce((acc, curr) => acc + curr.value, 0)
  if (remainder !== 0) platformShareData[0].value += remainder

  const scoreData = [
    { metric: 'Engagement', score: 85 },
    { metric: 'Reach', score: 92 },
    { metric: 'Growth', score: 78 },
    { metric: 'Retention', score: 88 },
    { metric: 'Consistency', score: 95 },
    { metric: 'Quality', score: 82 },
  ]

  // Campaign Analytics Data
  const campaignsCompleted = Math.round(12 * timeframeMultiplier[timeframe])
  const campaignER = Number((avgER * 1.1).toFixed(1))
  const avgEarnings = 18400

  const campaignMetrics = [
    { label: "Campaigns completed", value: campaignsCompleted.toString(), trend: "18%", isPositive: true },
    { label: "Campaign avg ER", value: `${campaignER}%`, trend: "1.4%", isPositive: true },
    { label: "Avg earnings/campaign", value: `₹${(avgEarnings / 1000).toFixed(1)}K`, trend: "8.2%", isPositive: true },
    { label: "On-time delivery", value: "100%" },
  ]

  const labels = timeframePoints[timeframe]
  const campaignPerformanceData = labels.map((label, i) => ({
    month: label,
    campaign: Number((campaignER + Math.sin(i) * 0.5).toFixed(1)),
    organic: Number((avgER + Math.cos(i) * 0.5).toFixed(1))
  }))

  const campaignCategoryData = [
    { name: 'UI/UX Design', value: 45 },
    { name: 'Figma Tips', value: 25 },
    { name: 'Tech Reviews', value: 15 },
    { name: 'Desk Setup', value: 10 },
    { name: 'Career', value: 5 },
  ]

  const campaignEarningsData = labels.map((label, i) => ({
    month: label,
    amount: Math.round((avgEarnings * (0.8 + Math.random() * 0.4))),
    campaignName: `Campaign ${i + 1}`
  }))

  return {
    overview: [
      { id: "reach", label: "Total Reach", value: (totalReach / 1000).toFixed(1) + "K", trend: "24.5%", isPositive: true },
      { id: "followers", label: "Total Audience", value: (totalFollowers / 1000).toFixed(1) + "K", trend: "12.2%", isPositive: true },
      { id: "impressions", label: "Impressions", value: (totalImpressions / 1000).toFixed(1) + "K", trend: "18.4%", isPositive: true },
      { id: "engagement", label: "Avg Engagement", value: `${avgER}%`, trend: "1.2%", isPositive: true },
    ],
    smallMetrics: [
      { id: "likes", label: "Likes", value: (totalLikes / 1000).toFixed(1) + "K", trend: "14%", isPositive: true },
      { id: "comments", label: "Comments", value: (totalComments / 1000).toFixed(1) + "K", trend: "8%", isPositive: true },
      { id: "shares", label: "Shares", value: (totalShares / 1000).toFixed(1) + "K", trend: "22%", isPositive: true },
      { id: "saves", label: "Saves", value: (totalSaves / 1000).toFixed(1) + "K", trend: "16%", isPositive: true },
      { id: "profile_visits", label: "Profile Visits", value: (totalProfileVisits / 1000).toFixed(1) + "K", trend: "11%", isPositive: true },
      { id: "mentions", label: "Mentions", value: (totalMentions / 1000).toFixed(1) + "K", trend: "5%", isPositive: true },
    ],
    performance: {
      bestTimeData,
      platformShareData,
      scoreData
    },
    campaigns: {
      metrics: campaignMetrics,
      performanceData: campaignPerformanceData,
      categoryData: campaignCategoryData,
      earningsData: campaignEarningsData
    }
  }
}
