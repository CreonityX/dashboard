import type { CalendarEvent } from "@/lib/calendar-data"
import type { Conversation } from "@/lib/messages-data"

const date = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const brandCalendarSeed: CalendarEvent[] = [
  { id: "brand-kickoff", title: "Monsoon Edit — campaign kickoff", type: "campaign", date: date(0), allDay: true, campaign: "Monsoon Edit", assignee: "Maya Shah", priority: "high", description: "Align creative direction, deliverables, and creator shortlist." },
  { id: "brand-brief", title: "Creator briefing — Aanya Kapoor", type: "meeting", date: date(1), startTime: "11:00", endTime: "11:30", allDay: false, creator: "Aanya Kapoor", campaign: "Monsoon Edit", assignee: "Maya Shah", priority: "high" },
  { id: "brand-delivery", title: "First-cut deliverable due", type: "deadline", date: date(3), allDay: true, creator: "Aanya Kapoor", campaign: "Monsoon Edit", workflowStatus: "pending", priority: "high" },
  { id: "brand-review", title: "Approve reel — Neel Verma", type: "approval", date: date(4), startTime: "14:00", endTime: "14:30", allDay: false, creator: "Neel Verma", campaign: "Weekend Escapes", workflowStatus: "pending", priority: "high", description: "Review the submitted Instagram reel and either approve it or request revisions." },
  { id: "brand-revision", title: "Revision deadline — Aanya Kapoor", type: "review", date: date(6), allDay: true, creator: "Aanya Kapoor", campaign: "Monsoon Edit", workflowStatus: "changes_requested", priority: "medium" },
  { id: "brand-launch", title: "Weekend Escapes launch", type: "campaign", date: date(8), allDay: true, campaign: "Weekend Escapes", assignee: "Rishabh", priority: "high" },
  { id: "brand-payment", title: "Creator payment release", type: "payment", date: date(10), allDay: true, creator: "Neel Verma", campaign: "Weekend Escapes", paymentStatus: "scheduled", priority: "medium" },
  { id: "brand-sync", title: "Weekly brand team sync", type: "meeting", date: date(2), startTime: "10:00", endTime: "11:00", allDay: false, assignee: "Creonity team", priority: "low" },
  { id: "brand-leadership", title: "Q3 Leadership Review", type: "meeting", date: date(0), startTime: "15:00", endTime: "16:00", allDay: false, assignee: "Management", priority: "high", notInvited: true, description: "Quarterly review with the board." },
]

export const brandTaskSeed: CalendarEvent[] = [
  { id: "brand-task-1", title: "Finalize Monsoon Edit creator shortlist", type: "personal", date: date(-3), allDay: true, assignee: "Maya Shah", priority: "high", completed: false },
  { id: "brand-task-2", title: "Upload Weekend Escapes usage rights", type: "personal", date: date(2), allDay: true, assignee: "Arjun Mehta", priority: "medium", completed: false },
  { id: "brand-task-3", title: "Reconcile June creator payments", type: "personal", date: date(4), allDay: true, assignee: "Rishabh", priority: "medium", completed: false },
]

export const brandConversationSeed: Conversation[] = [
  { id: "aanya", name: "Aanya Kapoor", handle: "@aanyacreates", systemRole: "Lifestyle creator · Monsoon Edit", tone: "purple", verified: true, online: true, label: { text: "Review due", tone: "pending" }, preview: "Submitted a revised reel", time: "8m", unread: 2, messages: [
    { id: "a1", sender: "them", senderName: "Aanya Kapoor", senderTone: "purple", time: "10:12 AM", kind: "text", text: "I’ve uploaded the revised cut with the requested hook change." },
    { id: "a2", sender: "them", senderName: "Aanya Kapoor", senderTone: "purple", time: "10:13 AM", kind: "review", creator: "Aanya Kapoor", campaign: "Monsoon Edit", title: "Instagram Reel — revised cut", assetName: "aanya-monsoon-reel-v2.mp4", status: "pending" },
  ], brandInfo: { description: "Lifestyle creator collaborating on the Monsoon Edit campaign.", links: [{ label: "Instagram", url: "@aanyacreates" }] }, representative: { name: "Maya Shah", role: "Campaign manager" } },
  { id: "neel", name: "Neel Verma", handle: "@neelgoesplaces", systemRole: "Travel creator · Weekend Escapes", tone: "teal", verified: true, online: false, label: { text: "Payment scheduled", tone: "vip" }, preview: "Reel approved — payment scheduled", time: "1h", messages: [
    { id: "n1", sender: "them", senderName: "Neel Verma", senderTone: "teal", time: "Yesterday", kind: "review", creator: "Neel Verma", campaign: "Weekend Escapes", title: "Weekend getaway reel", assetName: "neel-weekend-escapes.mp4", status: "approved" },
    { id: "n2", sender: "me", time: "Yesterday", kind: "text", text: "Approved — great work. Your payment is now scheduled." },
  ], brandInfo: { description: "Travel creator active on Weekend Escapes.", links: [{ label: "Instagram", url: "@neelgoesplaces" }] }, representative: { name: "Rishabh", role: "Owner" } },
  { id: "monsoon", name: "Monsoon Edit", handle: "#monsoon-edit", tone: "blue", type: "community", role: "admin", label: { text: "Campaign", tone: "deal" }, preview: "3 creators · 1 approval pending", time: "", channels: [
    { id: "general", name: "general", messages: [{ id: "m1", sender: "me", time: "9:00 AM", kind: "text", text: "Welcome to the Monsoon Edit campaign workspace." }] },
    { id: "content-review", name: "content-review", unread: 1, messages: [{ id: "m2", sender: "them", senderName: "Aanya Kapoor", senderTone: "purple", time: "10:13 AM", kind: "review", creator: "Aanya Kapoor", campaign: "Monsoon Edit", title: "Instagram Reel — revised cut", assetName: "aanya-monsoon-reel-v2.mp4", status: "pending" }] },
  ], members: [{ id: "a", name: "Aanya Kapoor", role: "Creator", tone: "purple" }, { id: "m", name: "Maya Shah", role: "Campaign manager", tone: "blue" }], messages: [] },
  { id: "maya", name: "Maya Shah", handle: "@maya", systemRole: "Campaign manager", tone: "blue", verified: false, online: true, preview: "Hey, can you review the brief?", time: "2h", messages: [
    { id: "m1", sender: "them", senderName: "Maya Shah", senderTone: "blue", time: "2h", kind: "text", text: "Hey, can you review the brief for the new campaign?" }
  ] },
  { id: "arjun", name: "Arjun Mehta", handle: "@arjun", systemRole: "Admin", tone: "red", verified: false, online: false, preview: "I'll handle the payments today.", time: "1d", messages: [
    { id: "ar1", sender: "them", senderName: "Arjun Mehta", senderTone: "red", time: "1d", kind: "text", text: "I'll handle the payments today." }
  ] },
  { id: "creonity", name: "Creonity Team", handle: "#creonity", tone: "gray", type: "community", role: "admin", label: { text: "Company", tone: "deal" }, preview: "3 members", time: "", channels: [
    { id: "general", name: "general", messages: [{ id: "c1", sender: "me", time: "9:00 AM", kind: "text", text: "Welcome to the Creonity team workspace." }] },
    { id: "campaign-planning", name: "campaign-planning", messages: [] },
  ], members: [{ id: "c1", name: "Rishabh", role: "Owner", tone: "gray" }, { id: "m", name: "Maya Shah", role: "Campaign manager", tone: "blue" }, { id: "a", name: "Arjun Mehta", role: "Admin", tone: "red" }], messages: [] },
]
