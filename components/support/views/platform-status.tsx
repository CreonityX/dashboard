"use client"
import { useState } from "react"

import { CircleCheck, TriangleExclamation, Clock, Globe, Server, ChevronDown } from "@gravity-ui/icons"
import { Button, Tooltip, Card, Popover, PopoverTrigger, PopoverContent, Input } from "@heroui/react"
import { PaginationBar } from "@/components/support/pagination-bar"
import { cn } from "@/lib/utils"

// -------------------------------------
// 1. Mock Data & Types
// -------------------------------------
type Status = "operational" | "degraded" | "outage"

interface UptimeDay {
  date: string
  status: Status
  uptime: number
}

interface ComponentStatus {
  id: string
  name: string
  status: Status
  uptimeTotal: number
  history: UptimeDay[]
}

interface RegionStatus {
  id: string
  name: string
  status: Status
}

// Generate 40 days of history
function generateHistory(seedStatus: Status): UptimeDay[] {
  const days: UptimeDay[] = []
  const today = new Date()
  
  for (let i = 39; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    
    // Add some random incidents if not purely operational
    const isIncident = seedStatus === "operational" ? Math.random() > 0.95 : Math.random() > 0.8
    let st: Status = "operational"
    let up = 100
    
    if (isIncident) {
      st = Math.random() > 0.5 ? "degraded" : "outage"
      up = st === "outage" ? 95.5 : 98.2
    }
    
    days.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: st,
      uptime: up,
    })
  }
  return days
}

const COMPONENTS: ComponentStatus[] = [
  { id: "api", name: "API Services", status: "operational", uptimeTotal: 99.99, history: generateHistory("operational") },
  { id: "web", name: "Web Application", status: "operational", uptimeTotal: 99.98, history: generateHistory("operational") },
  { id: "integrations", name: "Integrations & Webhooks", status: "degraded", uptimeTotal: 98.50, history: generateHistory("degraded") },
]

const REGIONS: RegionStatus[] = [
  { id: "us-east", name: "US East (N. Virginia)", status: "operational" },
  { id: "eu-central", name: "Europe (Frankfurt)", status: "operational" },
  { id: "ap-southeast", name: "Asia Pacific (Singapore)", status: "degraded" },
]

const INCIDENTS = [
  {
    id: 1,
    title: "Degraded performance in Integrations",
    status: "Monitoring",
    date: "Today, 10:45 AM",
    description: "We are currently observing degraded performance with some third-party webhooks. We have implemented a fix and are monitoring the results.",
    updates: [
      { time: "10:45 AM", text: "A fix has been implemented and we are monitoring the recovery." },
      { time: "09:30 AM", text: "We have identified the issue causing delayed webhooks." },
      { time: "09:15 AM", text: "We are investigating reports of delayed webhook deliveries." }
    ]
  },
  {
    id: 2,
    title: "API Partial Outage",
    status: "Resolved",
    date: "Jun 24, 2026, 02:15 PM",
    description: "Our core API experienced a brief partial outage due to a database lock. All services are fully recovered.",
    updates: [
      { time: "03:00 PM", text: "All impacted services have fully recovered." },
      { time: "02:30 PM", text: "A fix has been deployed. Metrics are returning to normal." },
      { time: "02:15 PM", text: "We are investigating elevated error rates on the core API." }
    ]
  },
  {
    id: 3,
    title: "Dashboard Latency",
    status: "Resolved",
    date: "Jun 10, 2026, 09:12 AM",
    description: "We experienced intermittent latency spikes in our dashboard, affecting query times for a subset of users.",
    updates: [
      { time: "10:30 AM", text: "Dashboard performance is fully restored." },
      { time: "09:45 AM", text: "We have isolated the source of the latency and are applying a fix." },
      { time: "09:12 AM", text: "Investigating reports of slow load times." }
    ]
  },
  {
    id: 4,
    title: "Authentication Delays",
    status: "Resolved",
    date: "May 28, 2026, 11:05 AM",
    description: "Users experienced delayed email deliveries for authentication codes.",
    updates: [
      { time: "11:50 AM", text: "Email delivery queues have cleared. Authentication is back to normal." },
      { time: "11:05 AM", text: "We are aware of the email delays and are investigating." }
    ]
  }
]

// -------------------------------------
// 2. Helper Components
// -------------------------------------
function StatusBadge({ status }: { status: Status }) {
  if (status === "operational") {
    return (
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-500">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Operational
      </div>
    )
  }
  if (status === "degraded") {
    return (
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-500">
        <div className="h-2 w-2 rounded-full bg-amber-500" />
        Degraded
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-rose-500">
      <div className="h-2 w-2 rounded-full bg-rose-500" />
      Outage
    </div>
  )
}

function UptimeBarChart({ history, componentName }: { history: UptimeDay[], componentName: string }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex h-8 w-full items-end gap-[2px]">
        {history.map((day, i) => {
          const isIncident = day.status !== "operational"
          const isHovered = hoveredIdx === i

          return (
            <div 
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={cn(
                "relative flex-1 rounded-sm cursor-pointer transition-opacity outline-none",
                day.status === "operational" ? "bg-emerald-500 h-full" : 
                day.status === "degraded" ? "bg-amber-400 h-[80%]" : 
                "bg-rose-500 h-[60%]",
                isHovered ? "opacity-80" : "opacity-100"
              )}
            >
              {isHovered && (
                <div 
                  className={cn(
                    "absolute bottom-[calc(100%+12px)] z-50 w-[280px] rounded-xl overflow-hidden border border-[#efefef] dark:border-[#27272a] shadow-xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150",
                    i < 10 ? "-left-2" : 
                    i > 30 ? "right-0" : 
                    "left-1/2 -translate-x-1/2"
                  )}
                >
                  <div className="px-4 py-3 border-b border-[#efefef] dark:border-[#27272a]">
                    <span className="text-[12px] font-medium text-[#a1a1aa]">{day.date}, 2026</span>
                  </div>
                  <div className="px-4 py-3 flex gap-3 text-left">
                    {isIncident ? (
                      <TriangleExclamation className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <CircleCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white leading-tight">
                        {isIncident ? `Users may experience elevated error rates in ${componentName}` : `No downtime recorded for ${componentName}`}
                      </span>
                      {isIncident && (
                        <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa] mt-1">{day.uptime}% uptime</span>
                      )}
                    </div>
                  </div>
                  <div 
                    className={cn(
                      "absolute -bottom-[5px] h-2.5 w-2.5 rotate-45 border-b border-r border-[#efefef] dark:border-[#27272a] bg-white/80 dark:bg-[#0a0a0a]/80",
                      i < 10 ? "left-4" : 
                      i > 30 ? "right-4" : 
                      "left-1/2 -translate-x-1/2"
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[12px] text-[#a1a1aa]">
        <span>40 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}

// -------------------------------------
// 3. Main Component
// -------------------------------------
export function PlatformStatusView({ onBack }: { onBack?: () => void }) {
  const [expandedIncidentId, setExpandedIncidentId] = useState<number | null>(null)
  const [showAlert, setShowAlert] = useState(true)
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(INCIDENTS.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const visibleIncidents = INCIDENTS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-8 pb-20 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          {onBack && (
            <button onClick={onBack} className="lg:hidden flex items-center justify-center shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1.5 -ml-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0a0a0a] dark:text-white">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}
          <h1 className="text-[28px] font-bold tracking-tight text-[#0a0a0a] dark:text-white">Platform Status</h1>
        </div>
        
        {/* @ts-ignore */}
        <Popover placement={"bottom-end" as any} offset={8}>
          <PopoverTrigger>
            <Button variant="primary" className="bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-medium self-start sm:self-auto shadow-sm h-9">
              Subscribe to Updates
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 rounded-2xl shadow-xl border border-[#efefef] dark:border-[#27272a]">
            <div className="w-[320px] p-5 flex flex-col gap-4 bg-white dark:bg-[#0a0a0a]">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[16px] font-bold text-[#0a0a0a] dark:text-white leading-tight">Get status updates</h3>
                <p className="text-[13px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
                  Subscribe to receive email notifications whenever we create or update an incident.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <input 
                  placeholder="name@example.com"
                  type="email"
                  className="h-10 rounded-xl bg-[#f4f4f5] dark:bg-[#1f1f1f] shadow-none px-3 text-[14px] outline-none"
                />
                <Button variant="primary" className="bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] font-medium h-10 w-full">
                  Subscribe
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* DISMISSIBLE ALERT */}
      {showAlert && (
        <Card className="w-full bg-white dark:bg-[#0a0a0a] border border-[#efefef] dark:border-[#27272a] shadow-sm rounded-2xl overflow-hidden">
          <div className="flex items-start justify-between p-4 px-5">
            <div className="flex items-start gap-3">
              <TriangleExclamation className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-[15px] text-[#0a0a0a] dark:text-white">We're currently experiencing issues</h3>
                <p className="text-[14px] text-[#737373] dark:text-[#a1a1aa] leading-relaxed">
                  We have identified an issue causing delayed webhooks. The impact appears limited, and we are monitoring the recovery.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] font-medium text-[#a1a1aa]">Monitoring</span>
                  <span className="w-1 h-1 rounded-full bg-[#d4d4d8] dark:bg-[#3f3f46]"></span>
                  <span className="text-[12px] font-medium text-[#a1a1aa]">Ongoing for 2 hours</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-[#a1a1aa] hover:text-[#0a0a0a] dark:hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </Card>
      )}

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN: COMPONENTS */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Service Availability</h2>
          
          <div className="flex flex-col gap-3">
            {COMPONENTS.map((comp) => (
              <div key={comp.id} className="rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[15px] text-[#0a0a0a] dark:text-white">{comp.name}</span>
                  </div>
                  <span className="text-[14px] font-medium text-[#737373] dark:text-[#a1a1aa]">{comp.uptimeTotal}% uptime</span>
                </div>
                <UptimeBarChart history={comp.history} componentName={comp.name} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REGIONS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Regional Availability</h2>
          
          <div className="flex flex-col rounded-2xl border border-[#efefef] dark:border-[#27272a] bg-white dark:bg-[#0a0a0a] shadow-sm overflow-hidden">
            {REGIONS.map((region, idx) => (
              <div 
                key={region.id} 
                className={cn(
                  "flex items-center justify-between p-4",
                  idx !== REGIONS.length - 1 && "border-b border-[#efefef] dark:border-[#27272a]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-[#a1a1aa]" />
                  <span className="text-[15px] font-medium text-[#0a0a0a] dark:text-white">{region.name}</span>
                </div>
                <StatusBadge status={region.status} />
              </div>
            ))}
          </div>
          
          <div className="rounded-2xl bg-[#f4f4f5] dark:bg-[#1f1f1f] p-4 text-[13px] text-[#737373] dark:text-[#a1a1aa] flex items-start gap-3 mt-4">
            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
            <p>Availability metrics are reported at an aggregate level across all tiers. Auto-refreshing every 60s.</p>
          </div>
        </div>
      </div>

      {/* INCIDENT HISTORY */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[16px] font-semibold text-[#0a0a0a] dark:text-white">Recent Incidents</h2>
        </div>

        {/* TABLE CONTAINER */}
        <div className="w-full flex flex-col bg-[#f4f4f5] dark:bg-[#111111] rounded-2xl shadow-none border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden flex-1">
          
          {/* TABLE HEADER */}
          <div className="flex w-full h-[52px] shrink-0 items-center">
            <div className="w-[90px] sm:w-[120px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center">
              <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">ID</span>
            </div>
            <div className="flex-1 min-w-0 px-4 flex items-center justify-start text-left">
              <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Issue</span>
            </div>
            <div className="hidden sm:flex w-[180px] shrink-0 px-4 items-center justify-center text-center">
              <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Date</span>
            </div>
            <div className="hidden sm:flex w-[120px] shrink-0 px-4 items-center justify-center text-center">
              <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white">Status</span>
            </div>
            <div className="w-[44px] sm:w-[56px] shrink-0" />
          </div>

          {/* TABLE ROWS */}
          <div className="flex flex-col w-full bg-white dark:bg-[#0a0a0a] rounded-2xl overflow-hidden flex-1 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] dark:shadow-none border-t border-b border-[#efefef] dark:border-[#27272a]">
            <div className="flex flex-col w-full divide-y divide-[#efefef] dark:divide-[#27272a]">
            {visibleIncidents.map((inc) => {
              const isExpanded = expandedIncidentId === inc.id;
              const isResolved = inc.status === "Resolved";

              return (
                <div
                  key={inc.id}
                  className={cn(
                    "w-full flex flex-col transition-all overflow-hidden",
                    isExpanded
                      ? cn(
                          "border-l-[3px]",
                          isResolved
                            ? "border-l-emerald-500 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.04]"
                            : "border-l-amber-500 bg-amber-500/[0.03] dark:bg-amber-500/[0.04]"
                        )
                      : "border-l-[3px] border-l-transparent hover:bg-black/[0.025] dark:hover:bg-white/[0.03] cursor-pointer"
                  )}
                >
                  {/* COLLAPSED ROW */}
                  <div
                    className="flex w-full items-center min-h-[64px] cursor-pointer group"
                    onClick={() => setExpandedIncidentId(isExpanded ? null : inc.id)}
                  >
                    {/* ID */}
                    <div className="w-[90px] sm:w-[120px] shrink-0 px-4 sm:px-5 flex items-center justify-center text-center gap-2">
                      <span className="text-[13px] font-semibold text-[#0a0a0a] dark:text-white tabular-nums">
                        #{String(inc.id).padStart(4, '0')}
                      </span>
                    </div>

                    {/* ISSUE */}
                    <div className="flex-1 min-w-0 px-4 flex flex-col justify-center items-start text-left py-3">
                      <span className="text-[14px] font-semibold text-[#0a0a0a] dark:text-white leading-snug">
                        {inc.title}
                      </span>
                      {/* Mobile-only status + date */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 sm:hidden">
                        <span className="text-[11px] text-[#a1a1aa]">{inc.date}</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide", isResolved ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>{inc.status}</span>
                      </div>
                    </div>

                    {/* DATE — hidden on mobile */}
                    <div className="hidden sm:flex w-[180px] shrink-0 px-4 items-center justify-center text-center">
                      <span className="text-[12px] text-[#737373] dark:text-[#a1a1aa]">{inc.date}</span>
                    </div>

                    {/* STATUS — hidden on mobile */}
                    <div className="hidden sm:flex w-[120px] shrink-0 px-4 items-center justify-center text-center">
                      <span className={cn(
                        "text-[11.5px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide",
                        isResolved ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      )}>
                        {inc.status}
                      </span>
                    </div>

                    {/* CHEVRON */}
                    <div className="w-[44px] sm:w-[56px] shrink-0 flex items-center justify-center">
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-300 text-[#a1a1aa]",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </div>
                  </div>

                  {/* EXPANDED PANEL */}
                  {isExpanded && (
                    <div className="flex flex-col w-full px-5 pb-7 pt-1 animate-in slide-in-from-top-1 fade-in duration-250 text-left">
                      
                      {/* Description block (Situation Fix) */}
                      <div className="bg-[#f4f4f5] dark:bg-[#1f1f1f] rounded-xl p-4 mb-6 text-left">
                        <p className="text-[14px] text-[#0a0a0a] dark:text-zinc-300 leading-relaxed text-left">
                          {inc.description}
                        </p>
                      </div>

                      {/* Timeline */}
                      <div className="px-2">
                        <div className="flex items-center gap-2 mb-5">
                          <Clock className="size-4 text-[#a1a1aa]" />
                          <h2 className="text-[15px] font-semibold text-[#0a0a0a] dark:text-white">Activity</h2>
                        </div>

                        <div className="relative pl-10 space-y-6">
                          {/* Vertical line */}
                          <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-[#e4e4e7] dark:bg-[#27272a]" />

                          {inc.updates.map((update, i) => (
                            <div key={i} className="relative flex flex-col gap-1">
                              {/* Dot */}
                              <div
                                className={cn(
                                  "absolute -left-[30px] top-0.5 h-3 w-3 rounded-full border-[2.5px] bg-white dark:bg-[#0a0a0a] z-10",
                                  i === 0 
                                    ? (isResolved ? "border-emerald-500" : "border-amber-500") 
                                    : "border-[#a1a1aa] dark:border-[#52525b]"
                                )}
                              />
                              <span className="text-[12px] font-medium text-[#737373] dark:text-[#a1a1aa] leading-none">
                                {update.time}
                              </span>
                              <span className="text-[13.5px] text-[#0a0a0a] dark:text-zinc-300">
                                {update.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>

          <div className="flex w-full h-[52px] shrink-0 items-center justify-between px-6 bg-transparent mt-auto">
            <span className="text-[13px] font-medium text-[#737373] dark:text-[#a1a1aa]">
              Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, INCIDENTS.length)} of {INCIDENTS.length} incidents
            </span>
            {totalPages > 1 && (
              <div className="flex items-center">
                <PaginationBar page={page} total={totalPages} onChange={setPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
