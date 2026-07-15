"use client"

import { useEffect, useMemo, useState } from "react"
import { Typography, Tooltip as HeroTooltip } from "@heroui/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram, faXTwitter, faTiktok, faSnapchat, faYoutube } from "@fortawesome/free-brands-svg-icons"
import { Bookmark, Play, Pause, Volume2, VolumeX, Maximize2, Send, Eye as LucideEye, Activity as LucideActivity, Clock as LucideClock, TrendingUp as LucideTrendingUp, ChevronRight as LucideChevronRight, Heart as LucideHeart, MessageCircle as LucideMessageCircle, Bookmark as LucideBookmark, Send as LucideSend } from "lucide-react"
import {
  ArrowUpRight,
  Bookmark as GravityBookmark,
  Bulb,
  ChartColumn,
  ChartLine,
  ChevronRight,
  Clock,
  Comment,
  Eye,
  Globe,
  Heart,
  MapPin,
  PaperPlane,
  Person,
  Pulse,
} from "@gravity-ui/icons"
import { cn } from "@/lib/utils"
import {
  getPlatformAnalyticsData,
  type AnalyticsTimeframe,
  type PlatformMetric,
} from "./platform-analytics-data"
import { PostDetailModal } from "@/components/shared/post-detail-modal"

const cardClass = "rounded-2xl border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#0a0a0a]"
const genderColors = ["#0ea5e9", "#38bdf8", "#bae6fd"]

const PillBar = (props: any) => {
  const { fill, x, y, width, height } = props
  if (!width || height === undefined) return null
  const actualHeight = Math.max(height, width)
  const baseline = y + height
  const actualY = baseline - actualHeight
  return (
    <rect x={x} y={actualY} width={width} height={actualHeight} fill={fill} rx={width / 2} ry={width / 2} />
  )
}

function SectionHeading({ icon: Icon, children }: { icon: any; children: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-5 w-5 text-gray-400" />
      <Typography type="body-sm" className="font-semibold text-gray-500 dark:text-gray-400">
        {children}
      </Typography>
    </div>
  )
}

const formatValue = (value: number, suffix = "") => {
  if (suffix === "%") return `${value.toFixed(1)}%`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K${suffix}`
  return `${value.toLocaleString()}${suffix}`
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="min-w-[120px] rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#18181b]">
      {label && <p className="mb-1.5 text-[11px] font-medium text-gray-400">{label}</p>}
      {payload.map((item) => (
        <div key={item.name ?? "value"} className="flex items-center justify-between gap-4 text-[12px]">
          <span className="text-gray-500 dark:text-gray-400">{item.name ?? "Value"}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{Number(item.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

function GeographyTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const country = payload[0].payload
  if (!country.cities) return null
  return (
    <div className="min-w-[140px] rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-[#18181b]">
      <p className="mb-2 text-[12px] font-semibold text-gray-900 dark:text-white">{country.name}</p>
      <div className="flex flex-col gap-2">
        {country.cities.map((city: any, i: number) => (
          <div key={city.name} className="flex items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: payload[i]?.color ?? payload[i]?.fill ?? "#fff",
                  opacity: payload[i]?.payload?.fillOpacity ?? [1, 0.6, 0.2][i],
                }}
              />
              <span className="text-gray-500 dark:text-gray-400">{city.name}</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">{city.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AllPlatformsTopContent({ timeframe }: { timeframe: AnalyticsTimeframe }) {
  const data = useMemo(() => {
    const ig = getPlatformAnalyticsData("ig", timeframe)
    const tt = getPlatformAnalyticsData("tt", timeframe)
    const yt = getPlatformAnalyticsData("yt", timeframe)

    const allContent = [
      ...ig.topContent.map((c) => ({ ...c, platform: "ig", icon: faInstagram, accent: ig.accent })),
      ...tt.topContent.map((c) => ({ ...c, platform: "tt", icon: faTiktok, accent: tt.accent })),
      ...yt.topContent.map((c) => ({ ...c, platform: "yt", icon: faYoutube, accent: yt.accent })),
    ]

    allContent.sort((a, b) => b.reach - a.reach)
    return allContent.slice(0, 5)
  }, [timeframe])

  const maxReach = useMemo(() => Math.max(...data.map((c) => c.reach), 1), [data])

  return (
    <div className={cn(cardClass, "p-5 lg:p-6 lg:col-span-2")}>
      <SectionHeading icon={ArrowUpRight}>Top Performing Content (All Platforms)</SectionHeading>
      <div className="mt-6 flex flex-col relative">
        <div className="absolute left-[48px] top-0 bottom-6 w-px bg-gray-100 dark:bg-white/10 z-0" />

        <div className="flex flex-col gap-4 relative z-10">
          {data.map((item) => {
            const widthPct = Math.max((item.reach / maxReach) * 100, 2)
            const typeLower = item.type.toLowerCase()
            const isVertical = typeLower.includes("reel") || typeLower.includes("short") || typeLower.includes("tiktok")
            const isHorizontal = typeLower.includes("video") || typeLower.includes("vlog") || typeLower.includes("breakdown") || typeLower.includes("tutorial")
            const ratioClass = isVertical ? "aspect-[9/16]" : isHorizontal ? "aspect-video" : "aspect-square"
            const bgGradient = `linear-gradient(135deg, ${item.accent}40, ${item.accent}10)`

            return (
              <div key={item.title} className="flex items-center gap-5">
                <div className="relative group/thumb z-30">
                  <button
                    className="h-9 w-9 rounded-[8px] shrink-0 overflow-hidden border border-gray-200/80 dark:border-white/10 transition-transform hover:scale-105 outline-none flex items-center justify-center text-white"
                    style={{ background: bgGradient }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="size-4" style={{ color: item.accent }} />
                  </button>

                  <div className="absolute opacity-0 group-hover/thumb:opacity-100 transition-opacity left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none z-50">
                    <div className="p-0 rounded-xl overflow-hidden bg-white/70 dark:bg-[#18181b]/70 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 shadow-xl">
                      <div className={cn("relative w-[150px] bg-black/5 dark:bg-white/5", ratioClass)}>
                        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-white">
                          <p className="text-[12px] font-bold leading-tight mb-0.5 line-clamp-2">{item.title}</p>
                          <p className="text-[10px] font-medium opacity-80">
                            {item.type} • {formatValue(item.reach)} reach
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 h-[24px] flex items-center relative group">
                  <div
                    className="h-full rounded-md transition-all duration-1000 ease-out relative"
                    style={{ width: `${widthPct}%`, backgroundColor: item.accent }}
                  />
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity left-full ml-3 whitespace-nowrap bg-white dark:bg-[#18181b] border border-gray-100 dark:border-white/10 shadow-lg rounded-[10px] px-3 py-1.5 z-20 text-[12px] pointer-events-none">
                    <span className="font-medium text-gray-500 dark:text-gray-400 mr-2">Reach</span>
                    <span className="font-bold text-gray-900 dark:text-white">{Number(item.reach).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center pl-[68px] pt-4 mt-2 border-t border-gray-100 dark:border-white/5 relative">
          <div className="flex-1 flex justify-between text-[10px] font-medium text-gray-400">
            <span>0</span>
            <span>{formatValue(Math.round(maxReach / 2))}</span>
            <span>{formatValue(maxReach)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AllPlatformsAudience({ timeframe }: { timeframe: AnalyticsTimeframe }) {
  const [geographyMode, setGeographyMode] = useState<"countries" | "cities">("countries")

  const { genderData, ageData, geography } = useMemo(() => {
    const ig = getPlatformAnalyticsData("ig", timeframe)
    const tt = getPlatformAnalyticsData("tt", timeframe)
    const yt = getPlatformAnalyticsData("yt", timeframe)

    // Aggregate Gender
    const womenVal = Math.round((ig.audience.gender[0].value + tt.audience.gender[0].value + yt.audience.gender[0].value) / 3)
    const menVal = Math.round((ig.audience.gender[1].value + tt.audience.gender[1].value + yt.audience.gender[1].value) / 3)
    const otherVal = 100 - womenVal - menVal
    const genderData = [
      { name: "Women", value: womenVal },
      { name: "Men", value: menVal },
      { name: "Other", value: otherVal },
    ]

    // Aggregate Age
    const ageLabels = ["13-17", "18-21", "22-25", "26-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55+"]
    const ageData = ageLabels.map((label, idx) => {
      const val = Math.round(
        (ig.audience.age[idx].value + tt.audience.age[idx].value + yt.audience.age[idx].value) / 3
      )
      return { name: label, value: val }
    })

    // Aggregate Geography countries
    const countryMap: Record<string, { value: number; cities: Record<string, number> }> = {}
    const addCountryData = (countries: any[]) => {
      countries.forEach((c) => {
        if (!countryMap[c.name]) {
          countryMap[c.name] = { value: 0, cities: {} }
        }
        countryMap[c.name].value += c.value
        c.cities.forEach((city: any) => {
          if (!countryMap[c.name].cities[city.name]) {
            countryMap[c.name].cities[city.name] = 0
          }
          countryMap[c.name].cities[city.name] += city.value
        })
      })
    }
    addCountryData(ig.audience.countries)
    addCountryData(tt.audience.countries)
    addCountryData(yt.audience.countries)

    const geographyCountries = Object.entries(countryMap).map(([name, data]) => {
      const avgVal = Math.round(data.value / 3)
      const sortedCities = Object.entries(data.cities)
        .map(([cityName, cityVal]) => ({ name: cityName, value: Math.round(cityVal / 3) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)

      return {
        name,
        value: avgVal,
        cities: sortedCities,
      }
    })
    geographyCountries.sort((a, b) => b.value - a.value)

    // Aggregate Cities
    const cityMap: Record<string, number> = {}
    const addCityData = (cities: any[]) => {
      cities.forEach((c) => {
        cityMap[c.name] = (cityMap[c.name] || 0) + c.value
      })
    }
    addCityData(ig.audience.cities)
    addCityData(tt.audience.cities)
    addCityData(yt.audience.cities)

    const geographyCities = Object.entries(cityMap)
      .map(([name, val]) => ({ name, value: Math.round(val / 3) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return {
      genderData,
      ageData,
      geography: geographyMode === "countries" ? geographyCountries.slice(0, 5) : geographyCities,
    }
  }, [timeframe, geographyMode])

  const topGeographyValue = useMemo(() => Math.max(...geography.map((item) => item.value), 1), [geography])

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Gender card */}
      <div className={cn(cardClass, "pt-3.5 pb-3 px-5 flex flex-col")}>
        <SectionHeading icon={Person}>Gender Distribution</SectionHeading>
        <div className="flex items-center gap-6 mt-0.5">
          <div className="relative h-[104px] w-[104px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={50}
                  paddingAngle={3}
                  stroke="none"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={entry.name} fill={genderColors[index]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center gap-2.5">
            {genderData.map((item, index) => (
              <div key={item.name} className="flex items-center">
                <span className="h-2 w-2 rounded-full shrink-0 mr-2" style={{ backgroundColor: genderColors[index] }} />
                <span className="text-[12px] text-gray-600 dark:text-gray-300 font-medium w-14">{item.name}</span>
                <span className="text-[12px] text-gray-400 font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age card */}
      <div className={cn(cardClass, "p-5 flex flex-col")}>
        <SectionHeading icon={ChartColumn}>Age Demographics</SectionHeading>
        <div className="flex-1 mt-2 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} margin={{ top: 10, right: 5, left: 5, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e4e4e7" opacity={0.4} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: "#737373" }} tickMargin={8} />
              <YAxis hide={true} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="value"
                name="Audience"
                fill="#0ea5e9"
                maxBarSize={16}
                shape={(props: any) => <PillBar {...props} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Geography card */}
      <div className={cn(cardClass, "overflow-hidden flex flex-col p-5")}>
        <div className="flex w-full items-center justify-between pb-0 text-left">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-gray-600 dark:text-gray-300">Geography</span>
              <span className="mt-0.5 block truncate text-[11px] text-gray-400">
                Top location: {geography[0]?.name}
              </span>
            </span>
          </div>

          <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50/50 p-0.5 dark:border-white/5 dark:bg-white/5">
            <button
              onClick={() => setGeographyMode("countries")}
              className={cn(
                "rounded-[6px] px-2 py-1 text-[10px] font-semibold transition-all",
                geographyMode === "countries"
                  ? "bg-white text-gray-800 shadow-sm dark:bg-[#18181b] dark:text-white"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              Countries
            </button>
            <button
              onClick={() => setGeographyMode("cities")}
              className={cn(
                "rounded-[6px] px-2 py-1 text-[10px] font-semibold transition-all",
                geographyMode === "cities"
                  ? "bg-white text-gray-800 shadow-sm dark:bg-[#18181b] dark:text-white"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              Cities
            </button>
          </div>
        </div>

        <div className="flex-1 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={geography} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={16}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={28}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#737373" }}
                tickMargin={6}
                tickFormatter={(v) =>
                  ({
                    "United States": "US",
                    "United Kingdom": "UK",
                    India: "IN",
                    Canada: "CA",
                    Germany: "DE",
                    Australia: "AU",
                    Philippines: "PH",
                  }[v as string] || v)
                }
              />
              <Tooltip content={geographyMode === "countries" ? <GeographyTooltip /> : <ChartTooltip />} cursor={{ fill: "rgba(161,161,170,.08)" }} />
              {geographyMode === "countries" ? (
                <>
                  <Bar dataKey="cities[0].value" stackId="a" fill="#0ea5e9" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="cities[1].value" stackId="a" fill="#0ea5e9" fillOpacity={0.6} />
                  <Bar dataKey="cities[2].value" stackId="a" fill="#0ea5e9" fillOpacity={0.2} radius={[0, 4, 4, 0]} />
                </>
              ) : (
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}const PostThumbnail = ({ post, ratioClass }: { post: any; ratioClass: string }) => {
  const imageIndex = useMemo(() => {
    // Map post title to a specific pinterest placeholder image
    const val = post.title.charCodeAt(0) + post.title.charCodeAt(post.title.length - 1)
    return (val % 3) + 1
  }, [post.title])

  const emoji = {
    REEL: "🎬",
    CAROUSEL: "🖼️",
    STORY: "📱",
    SHORT: "⚡",
    VIDEO: "📹",
    POST: "📝"
  }[post.displayType as string] || "📝"

  return (
    <div className="relative w-full h-full group overflow-hidden select-none">
      {/* Real Pinterest-inspired image background */}
      <img 
        src={`/images/pinterest-${imageIndex}.jpg`} 
        alt={post.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Brand Color Gradient Overlay */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-40 opacity-60"
        style={{
          background: `linear-gradient(to bottom, ${post.accent}15, ${post.accent}b5)`,
        }}
      />
      


      {/* Bottom overlay: Title */}
      <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12 pointer-events-none">
        <p className="text-[12.5px] sm:text-[13.5px] font-bold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] line-clamp-2">
          {post.title}
        </p>
      </div>
    </div>
  )
}

export function PremiumPostsList({ platform, timeframe, postType = "all" }: { platform: "all" | "ig" | "tt" | "yt"; timeframe: AnalyticsTimeframe; postType?: "posts" | "reels" | "videos" | "shorts" | "all" }) {
  const [filter, setFilter] = useState<"top" | "recent" | "saved">("top")
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  const rawPosts = useMemo(() => {
    if (platform === "all") {
      const ig = getPlatformAnalyticsData("ig", timeframe)
      const tt = getPlatformAnalyticsData("tt", timeframe)
      const yt = getPlatformAnalyticsData("yt", timeframe)
      return [
        ...ig.topContent.map(p => ({ ...p, platform: "ig", accent: ig.accent, platformName: "Instagram" })),
        ...tt.topContent.map(p => ({ ...p, platform: "tt", accent: tt.accent, platformName: "TikTok" })),
        ...yt.topContent.map(p => ({ ...p, platform: "yt", accent: yt.accent, platformName: "YouTube" })),
      ]
    } else {
      const platData = getPlatformAnalyticsData(platform, timeframe)
      return platData.topContent.map(p => ({ ...p, platform, accent: platData.accent, platformName: platData.platformName }))
    }
  }, [platform, timeframe])

  const posts = useMemo(() => {
    const processed = rawPosts.map((item, idx) => {
      const reach = item.reach
      const likes = Math.round(reach * (0.07 + (idx * 0.01) % 0.03))
      const comments = Math.round(likes * (0.03 + (idx * 0.005) % 0.02))
      const savesMultiplier = item.platform === "ig" ? 0.22 : 0.04
      const saves = Math.round(likes * (savesMultiplier + (idx * 0.01) % 0.05))
      const shares = Math.round(likes * (0.12 + (idx * 0.02) % 0.15))
      const viewDuration = item.platform === "yt" ? "4m 12s" : item.platform === "tt" ? "14.2s" : "N/A"
      const er = ((likes + comments + saves + shares) / reach * 100).toFixed(1)
      
      const dates = ["Jul 8", "Jul 5", "Jul 3", "Jul 1", "Jun 28", "Jun 25", "Jun 20"]
      const date = dates[idx % dates.length]
      
      let displayType = "POST"
      const typeLower = item.type.toLowerCase()
      if (typeLower.includes("reel")) displayType = "REEL"
      else if (typeLower.includes("carousel")) displayType = "CAROUSEL"
      else if (typeLower.includes("story")) displayType = "STORY"
      else if (typeLower.includes("short")) displayType = "SHORT"
      else if (typeLower.includes("breakdown") || typeLower.includes("video") || typeLower.includes("tutorial")) displayType = "VIDEO"

      // Define ratios based on platform
      let ratioClass = "aspect-square" // Instagram / default
      if (item.platform === "tt" || displayType === "SHORT" || (item.platform === "ig" && displayType === "REEL")) {
        ratioClass = "aspect-[9/16]" // Vertical video formats
      } else if (item.platform === "yt") {
        ratioClass = "aspect-video" // YouTube Landscape
      }

      return {
        ...item,
        likes,
        comments,
        saves,
        shares,
        er,
        viewDuration,
        date,
        displayType,
        ratioClass,
        dateObj: new Date(2026, 6, 8 - (idx % 7))
      }
    })

    let filteredByType = processed
    if (postType === "posts") {
      filteredByType = processed.filter(p => p.displayType === "POST" || p.displayType === "CAROUSEL")
    } else if (postType === "reels") {
      filteredByType = processed.filter(p => p.displayType === "REEL")
    } else if (postType === "videos") {
      filteredByType = processed.filter(p => p.displayType === "VIDEO")
    } else if (postType === "shorts") {
      filteredByType = processed.filter(p => p.displayType === "SHORT")
    }

    if (filter === "top") {
      filteredByType.sort((a, b) => b.reach - a.reach)
    } else if (filter === "recent") {
      filteredByType.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
    } else if (filter === "saved") {
      filteredByType.sort((a, b) => b.saves - a.saves)
    }

    return filteredByType
  }, [rawPosts, filter, postType])

  const filterOptions = [
    { id: "top", label: "Top Performing" },
    { id: "recent", label: "Most Recent" },
    { id: "saved", label: "Most Saved" },
  ] as const

  // Enforce 4 columns specifically for youtube videos, 5 columns for shorts/reels/tiktok
  const gridColsClass = (platform === "yt" && postType !== "shorts")
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    let interval: any
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 30) {
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="w-full flex flex-col px-6 pb-12">
      {/* Sub filters */}
      <div className="flex items-center gap-3">
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id
          return (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={cn(
                "rounded-[10px] px-4 py-2 text-[13px] font-semibold transition-all outline-none",
                isActive
                  ? "bg-[#0a0a0a] text-white dark:bg-white dark:text-[#0a0a0a]"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Dynamic Grid layout */}
      <div className={cn("grid gap-4 mt-6", gridColsClass)}>
        {posts.map((post) => {
          return (
            <div 
              key={post.title} 
              onClick={() => {
                setSelectedPost(post)
                setIsPlaying(true) // Autoplay simulation on selection
                setCurrentTime(0)
              }}
              className={cn(
                "relative rounded-2xl overflow-hidden border border-gray-200/70 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:border-white/5 dark:bg-[#0d0d0d] group transition-all duration-300 cursor-pointer w-full",
                post.ratioClass
              )}
            >
              {/* Thumbnail representation */}
              <PostThumbnail post={post} ratioClass={post.ratioClass} />

            </div>
          )
        })}
      </div>

      {/* Floating Centered Card overlay styled like Instagram Reels Split player */}
      {selectedPost && (
        <PostDetailModal 
          selectedPost={selectedPost} 
          onClose={() => {
            setIsPlaying(false)
            setSelectedPost(null)
          }} 
        />
      )}
    </div>
  )
}
