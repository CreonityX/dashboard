export type EventType = "post" | "campaign" | "deadline" | "meeting" | "shoot" | "review" | "personal"
export type Platform = "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin"
export type Priority = "low" | "medium" | "high"

export type CalendarEvent = {
  id: string
  title: string
  type: EventType
  date: string
  startTime?: string
  endTime?: string
  allDay: boolean
  description?: string
  platform?: Platform
  brand?: string
  campaign?: string
  priority?: Priority
  completed?: boolean
  reminder?: string
  tags?: string[]
  multiDay?: boolean
  endDate?: string
}

export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; border: string; darkBg: string; darkBorder: string }> = {
  post:      { label: "Post",      color: "#3897f0", bg: "bg-[#e8f3ff]",  border: "border-[#3897f0]/40",  darkBg: "dark:bg-[#1a2e42]",  darkBorder: "dark:border-[#3897f0]/30" },
  campaign:  { label: "Campaign",  color: "#8a5cf7", bg: "bg-[#f0ebff]",  border: "border-[#8a5cf7]/40",  darkBg: "dark:bg-[#271a42]",  darkBorder: "dark:border-[#8a5cf7]/30" },
  deadline:  { label: "Deadline",  color: "#ef4444", bg: "bg-[#fff0f0]",  border: "border-[#ef4444]/40",  darkBg: "dark:bg-[#3d1a1a]",  darkBorder: "dark:border-[#ef4444]/30" },
  meeting:   { label: "Meeting",   color: "#14b8a6", bg: "bg-[#e6faf8]",  border: "border-[#14b8a6]/40",  darkBg: "dark:bg-[#0f2e2b]",  darkBorder: "dark:border-[#14b8a6]/30" },
  shoot:     { label: "Shoot",     color: "#f59e0b", bg: "bg-[#fff9eb]",  border: "border-[#f59e0b]/40",  darkBg: "dark:bg-[#332300]",  darkBorder: "dark:border-[#f59e0b]/30" },
  review:    { label: "Review",    color: "#f97316", bg: "bg-[#fff5ed]",  border: "border-[#f97316]/40",  darkBg: "dark:bg-[#3d1f00]",  darkBorder: "dark:border-[#f97316]/30" },
  personal:  { label: "Personal",  color: "#6b7280", bg: "bg-[#f3f4f6]",  border: "border-[#6b7280]/40",  darkBg: "dark:bg-[#1f2123]",  darkBorder: "dark:border-[#6b7280]/30" },
}

export const PLATFORM_CONFIG: Record<Platform, { label: string; iconId: string; color: string }> = {
  instagram: { label: "Instagram", iconId: "skill-icons:instagram",  color: "#e1306c" },
  youtube:   { label: "YouTube",   iconId: "logos:youtube-icon",      color: "#ff0000" },
  tiktok:    { label: "TikTok",    iconId: "logos:tiktok-icon",       color: "#010101" },
  twitter:   { label: "Twitter/X", iconId: "skill-icons:twitter",     color: "#1da1f2" },
  linkedin:  { label: "LinkedIn",  iconId: "logos:linkedin-icon",     color: "#0a66c2" },
}

function offset(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

export const calendarEvents: CalendarEvent[] = [
  { id: "1", title: "Nike Collab — Campaign Kick-off", type: "campaign", date: offset(-18), allDay: true, brand: "Nike", campaign: "Summer 2026", priority: "high", completed: true, description: "Initial campaign brief review and creative direction alignment.", tags: ["brand deal"] },
  { id: "2", title: "YouTube Vlog #47", type: "post", date: offset(-14), allDay: true, platform: "youtube", priority: "high", completed: true },
  { id: "3", title: "Brand Call — Glossier", type: "meeting", date: offset(-10), startTime: "14:00", endTime: "15:00", allDay: false, brand: "Glossier", priority: "medium", completed: true, description: "Discovery call about a skincare campaign partnership." },
  { id: "4", title: "IG Reel — Summer Collection", type: "post", date: offset(-8), allDay: true, platform: "instagram", brand: "Nike", campaign: "Summer 2026", priority: "high", completed: true },
  { id: "5", title: "Q2 Invoice Deadline", type: "deadline", date: offset(-5), allDay: true, priority: "high", completed: true, description: "Submit Q2 earnings invoices to all brand partners." },
  { id: "6", title: "Studio Shoot — Glossier Look Book", type: "shoot", date: offset(-3), startTime: "09:00", endTime: "17:00", allDay: false, brand: "Glossier", priority: "high", description: "Full-day studio shoot at Tribeca for Glossier Look Book." },
  { id: "7", title: "TikTok — Morning Routine", type: "post", date: offset(0), allDay: true, platform: "tiktok", priority: "medium" },
  { id: "8", title: "Content Review — Nike Ads", type: "review", date: offset(0), startTime: "11:00", endTime: "12:30", allDay: false, brand: "Nike", campaign: "Summer 2026", priority: "high", description: "Review final ad creatives with Nike team before launch." },
  { id: "9", title: "Weekly Team Sync", type: "meeting", date: offset(1), startTime: "10:00", endTime: "11:00", allDay: false, priority: "low", description: "Weekly sync with editor, photographer, and manager." },
  { id: "10", title: "LinkedIn Article — Creator Economy", type: "post", date: offset(1), allDay: true, platform: "linkedin", priority: "low" },
  { id: "11", title: "Contract Deadline — Glossier", type: "deadline", date: offset(2), allDay: true, brand: "Glossier", priority: "high", description: "Sign and return the Glossier Q3 partnership contract." },
  { id: "12", title: "YouTube — Product Review", type: "post", date: offset(3), allDay: true, platform: "youtube", priority: "high" },
  { id: "13", title: "Brand Deal Call — Hims", type: "meeting", date: offset(3), startTime: "16:00", endTime: "17:00", allDay: false, brand: "Hims", priority: "medium", description: "Exploratory call with Hims about a wellness content series." },
  { id: "14", title: "IG Carousel — Style Guide", type: "post", date: offset(7), allDay: true, platform: "instagram", priority: "medium" },
  { id: "15", title: "Location Shoot — Brooklyn Bridge", type: "shoot", date: offset(8), startTime: "07:00", endTime: "13:00", allDay: false, priority: "high", description: "Golden hour shoot for lifestyle content batch." },
  { id: "16", title: "Campaign Deadline — Nike Summer", type: "deadline", date: offset(9), allDay: true, brand: "Nike", campaign: "Summer 2026", priority: "high", description: "Final deliverables due to Nike for Summer 2026 campaign." },
  { id: "17", title: "Twitter Thread — Industry Insights", type: "post", date: offset(10), allDay: true, platform: "twitter", priority: "low" },
  { id: "18", title: "Podcast Recording — The Creator Pod", type: "meeting", date: offset(10), startTime: "13:00", endTime: "15:00", allDay: false, priority: "medium", description: "Recording ep #32 — topic: monetization strategies." },
  { id: "19", title: "Personal — Vacation", type: "personal", date: offset(12), endDate: offset(14), allDay: true, multiDay: true, priority: "low", description: "Offline — minimal posting." },
  { id: "20", title: "Glossier Campaign Launch", type: "campaign", date: offset(16), allDay: true, brand: "Glossier", priority: "high", description: "Glossier Look Book campaign goes live across all channels.", tags: ["launch"] },
  { id: "21", title: "TikTok — Campaign Teaser", type: "post", date: offset(16), allDay: true, platform: "tiktok", brand: "Glossier", priority: "high" },
  { id: "22", title: "YouTube — Monthly Favorites", type: "post", date: offset(18), allDay: true, platform: "youtube", priority: "medium" },
  { id: "23", title: "IG Story Series — BTS", type: "post", date: offset(20), allDay: true, platform: "instagram", brand: "Glossier", priority: "medium" },
  { id: "24", title: "Content Review — Hims Series", type: "review", date: offset(21), startTime: "10:00", endTime: "11:30", allDay: false, brand: "Hims", priority: "medium" },
  { id: "25", title: "Q3 Planning Meeting", type: "meeting", date: offset(22), startTime: "09:00", endTime: "10:30", allDay: false, priority: "high", description: "Q3 content calendar planning with manager and editor." },
  { id: "26", title: "Invoice Deadline — Glossier", type: "deadline", date: offset(24), allDay: true, brand: "Glossier", priority: "high" },
  { id: "27", title: "YouTube — Vlog #48", type: "post", date: offset(28), allDay: true, platform: "youtube", priority: "high" },
  
  // Active Tasks
  { id: "t1", title: "Project proposal.pdf", type: "personal", date: offset(0), allDay: true, priority: "high", completed: false, description: "Review and sign off on the project proposal.", reminder: "1 hour before" },
  { id: "t2", title: "Q4 financial report.xlsx", type: "personal", date: offset(1), allDay: true, priority: "medium", completed: false, description: "Update formulas in sheet 3." },
  { id: "t3", title: "Brand guidelines.fig", type: "personal", date: offset(2), allDay: true, priority: "high", completed: false },
  { id: "t4", title: "Team photo.jpg", type: "personal", date: offset(3), allDay: true, priority: "low", completed: false },
  { id: "t5", title: "Meeting notes.md", type: "personal", date: offset(3), allDay: true, priority: "medium", completed: false },
  { id: "t6", title: "API documentation.pdf", type: "personal", date: offset(5), allDay: true, priority: "medium", completed: false },
]

export function getEventsForDate(date: string): CalendarEvent[] {
  return calendarEvents.filter(e => {
    if (e.multiDay && e.endDate) return date >= e.date && date <= e.endDate
    return e.date === date
  })
}

export function getEventsForMonth(year: number, month: number): CalendarEvent[] {
  const pad = (n: number) => String(n).padStart(2, "0")
  const prefix = `${year}-${pad(month + 1)}`
  return calendarEvents.filter(e => {
    if (e.multiDay && e.endDate) {
      return prefix >= e.date.substring(0, 7) && prefix <= e.endDate.substring(0, 7)
    }
    return e.date.startsWith(prefix)
  })
}

export function getEventsForWeek(weekStart: Date): CalendarEvent[] {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const fmt = (d: Date) => d.toISOString().split("T")[0]
  return calendarEvents.filter(e => e.date >= fmt(weekStart) && e.date <= fmt(weekEnd))
}

export function getUpcomingEvents(limit = 30): CalendarEvent[] {
  const t = new Date().toISOString().split("T")[0]
  return calendarEvents.filter(e => e.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, limit)
}

export function getMonthGrid(year: number, month: number): { date: string; isCurrentMonth: boolean }[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const cells: { date: string; isCurrentMonth: boolean }[] = []
  const pad = (n: number) => String(n).padStart(2, "0")
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    const m = month === 0 ? 12 : month
    const y = month === 0 ? year - 1 : year
    cells.push({ date: `${y}-${pad(m)}-${pad(d)}`, isCurrentMonth: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: `${year}-${pad(month + 1)}-${pad(d)}`, isCurrentMonth: true })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 1 : month + 2
    const y = month === 11 ? year + 1 : year
    cells.push({ date: `${y}-${pad(m)}-${pad(d)}`, isCurrentMonth: false })
  }
  return cells
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number)
  const ampm = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

export function formatDisplayDate(date: string): string {
  const d = new Date(date + "T12:00:00")
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}
